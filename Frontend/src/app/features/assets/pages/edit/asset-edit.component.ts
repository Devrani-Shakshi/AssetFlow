import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { AssetService } from '../../../../core/services/asset.service';
import { CategoryService } from '../../../../core/services/category.service';
import { VendorService } from '../../../../core/services/vendor.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { LocationService } from '../../../../core/services/location.service';
import { AssetCategory } from '../../../../core/models/category.model';
import { Vendor } from '../../../../core/models/vendor.model';
import { Department } from '../../../../core/models/department.model';
import { Location } from '../../../../core/models/location.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.css']
})
export class AssetEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(AssetService);
  private readonly categoryService = inject(CategoryService);
  private readonly vendorService = inject(VendorService);
  private readonly departmentService = inject(DepartmentService);
  private readonly locationService = inject(LocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  categories: AssetCategory[] = [];
  vendors: Vendor[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  isSubmitting = false;
  isLoadingData = true;
  assetId!: string;

  conditions = ['New', 'Good', 'Fair', 'Poor', 'Broken'];
  statuses = ['Available', 'Allocated', 'Maintenance', 'Disposed'];

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadFormData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.assetId, [Validators.required]],
      assetCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      assetName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      serialNumber: ['', [Validators.maxLength(100)]],
      barcode: ['', [Validators.maxLength(100)]],
      qrCode: ['', [Validators.maxLength(100)]],
      categoryId: ['', [Validators.required]],
      vendorId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      purchaseCost: [0, [Validators.required, Validators.min(0)]],
      warrantyStart: [null],
      warrantyEnd: [null],
      depreciationRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      currentValue: [0, [Validators.required, Validators.min(0)]],
      condition: ['Good', [Validators.required]],
      status: ['Available', [Validators.required]],
      notes: ['', [Validators.maxLength(1000)]]
    });
  }

  loadFormData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      asset: this.assetService.getById(this.assetId),
      categories: this.categoryService.getAll(),
      vendors: this.vendorService.getAll(),
      departments: this.departmentService.getAll(),
      locations: this.locationService.getAll()
    }).subscribe({
      next: ({ asset, categories, vendors, departments, locations }) => {
        this.categories = categories;
        this.vendors = vendors;
        this.departments = departments;
        this.locations = locations;

        // format date fields for date input
        const purchaseDateStr = asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().substring(0, 10) : '';
        const warrantyStartStr = asset.warrantyStart ? new Date(asset.warrantyStart).toISOString().substring(0, 10) : '';
        const warrantyEndStr = asset.warrantyEnd ? new Date(asset.warrantyEnd).toISOString().substring(0, 10) : '';

        this.editForm.patchValue({
          assetCode: asset.assetCode,
          assetName: asset.assetName,
          description: asset.description,
          serialNumber: asset.serialNumber,
          barcode: asset.barcode,
          qrCode: asset.qrCode,
          categoryId: asset.categoryId,
          vendorId: asset.vendorId,
          departmentId: asset.departmentId,
          locationId: asset.locationId,
          purchaseDate: purchaseDateStr,
          purchaseCost: asset.purchaseCost,
          warrantyStart: warrantyStartStr || null,
          warrantyEnd: warrantyEndStr || null,
          depreciationRate: asset.depreciationRate,
          currentValue: asset.currentValue,
          condition: asset.condition,
          status: asset.status,
          notes: asset.notes
        });

        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load asset details.');
        this.router.navigate(['/assets']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = this.editForm.getRawValue();
    
    // convert dates to ISO format
    if (payload.purchaseDate) {
      payload.purchaseDate = new Date(payload.purchaseDate).toISOString();
    }
    if (payload.warrantyStart) {
      payload.warrantyStart = new Date(payload.warrantyStart).toISOString();
    }
    if (payload.warrantyEnd) {
      payload.warrantyEnd = new Date(payload.warrantyEnd).toISOString();
    }

    payload.imageUrls = [];

    this.assetService.update(payload).subscribe({
      next: () => {
        this.notification.success('Asset updated successfully.');
        this.router.navigate(['/assets']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update asset.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
