import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-asset-create',
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
  templateUrl: './asset-create.component.html',
  styleUrls: ['./asset-create.component.css']
})
export class AssetCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(AssetService);
  private readonly categoryService = inject(CategoryService);
  private readonly vendorService = inject(VendorService);
  private readonly departmentService = inject(DepartmentService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  categories: AssetCategory[] = [];
  vendors: Vendor[] = [];
  departments: Department[] = [];
  locations: Location[] = [];
  isSubmitting = false;
  isLoadingData = true;

  conditions = ['New', 'Good', 'Fair', 'Poor', 'Broken'];

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      assetCode: ['', [Validators.required, Validators.maxLength(20)]],
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
      condition: ['Good', [Validators.required]],
      notes: ['', [Validators.maxLength(1000)]]
    });
  }

  loadDropdowns(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      categories: this.categoryService.getAll(),
      vendors: this.vendorService.getAll(),
      departments: this.departmentService.getAll(),
      locations: this.locationService.getAll()
    }).subscribe({
      next: ({ categories, vendors, departments, locations }) => {
        this.categories = categories.filter(c => c.isActive);
        this.vendors = vendors.filter(v => v.isActive);
        this.departments = departments.filter(d => d.isActive);
        this.locations = locations.filter(l => l.isActive);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load form dropdown data.');
        this.router.navigate(['/assets']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const formValue = { ...this.createForm.value };
    
    // convert dates to ISO format
    if (formValue.purchaseDate) {
      formValue.purchaseDate = new Date(formValue.purchaseDate).toISOString();
    }
    if (formValue.warrantyStart) {
      formValue.warrantyStart = new Date(formValue.warrantyStart).toISOString();
    }
    if (formValue.warrantyEnd) {
      formValue.warrantyEnd = new Date(formValue.warrantyEnd).toISOString();
    }

    formValue.imageUrls = []; // default empty image list

    this.assetService.create(formValue).subscribe({
      next: () => {
        this.notification.success('Asset created successfully.');
        this.router.navigate(['/assets']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to create asset.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
