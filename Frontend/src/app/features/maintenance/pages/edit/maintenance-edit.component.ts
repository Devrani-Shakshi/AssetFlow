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
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { AssetService } from '../../../../core/services/asset.service';
import { VendorService } from '../../../../core/services/vendor.service';
import { Asset } from '../../../../core/models/asset.model';
import { Vendor } from '../../../../core/models/vendor.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-maintenance-edit',
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
  templateUrl: './maintenance-edit.component.html',
  styleUrls: ['./maintenance-edit.component.css']
})
export class MaintenanceEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly assetService = inject(AssetService);
  private readonly vendorService = inject(VendorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  assets: Asset[] = [];
  vendors: Vendor[] = [];
  isSubmitting = false;
  isLoadingData = true;
  maintenanceId!: string;

  maintenanceTypes = ['Preventative', 'Repair', 'Upgrade', 'Inspection'];
  statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  ngOnInit(): void {
    this.maintenanceId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadFormData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.maintenanceId, [Validators.required]],
      assetId: ['', [Validators.required]],
      vendorId: ['', [Validators.required]],
      maintenanceDate: ['', [Validators.required]],
      maintenanceType: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      status: ['', [Validators.required]],
      expectedCompletionDate: [null],
      completedDate: [null],
      remarks: ['', [Validators.maxLength(500)]]
    });
  }

  loadFormData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      record: this.maintenanceService.getById(this.maintenanceId),
      assets: this.assetService.getAll(),
      vendors: this.vendorService.getAll()
    }).subscribe({
      next: ({ record, assets, vendors }) => {
        this.assets = assets;
        this.vendors = vendors;

        const mainDateStr = record.maintenanceDate ? new Date(record.maintenanceDate).toISOString().substring(0, 10) : '';
        const expDateStr = record.expectedCompletionDate ? new Date(record.expectedCompletionDate).toISOString().substring(0, 10) : '';
        const compDateStr = record.completedDate ? new Date(record.completedDate).toISOString().substring(0, 10) : '';

        this.editForm.patchValue({
          assetId: record.assetId,
          vendorId: record.vendorId,
          maintenanceDate: mainDateStr,
          maintenanceType: record.maintenanceType,
          description: record.description,
          cost: record.cost,
          status: record.status,
          expectedCompletionDate: expDateStr || null,
          completedDate: compDateStr || null,
          remarks: record.remarks
        });

        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load maintenance record.');
        this.router.navigate(['/maintenance']);
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

    if (payload.maintenanceDate) {
      payload.maintenanceDate = new Date(payload.maintenanceDate).toISOString();
    }
    if (payload.expectedCompletionDate) {
      payload.expectedCompletionDate = new Date(payload.expectedCompletionDate).toISOString();
    }
    if (payload.completedDate) {
      payload.completedDate = new Date(payload.completedDate).toISOString();
    }

    this.maintenanceService.update(payload).subscribe({
      next: () => {
        this.notification.success('Maintenance record updated successfully.');
        this.router.navigate(['/maintenance']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update maintenance record.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
