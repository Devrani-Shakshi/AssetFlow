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
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { AssetService } from '../../../../core/services/asset.service';
import { VendorService } from '../../../../core/services/vendor.service';
import { Asset } from '../../../../core/models/asset.model';
import { Vendor } from '../../../../core/models/vendor.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-maintenance-create',
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
  templateUrl: './maintenance-create.component.html',
  styleUrls: ['./maintenance-create.component.css']
})
export class MaintenanceCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly assetService = inject(AssetService);
  private readonly vendorService = inject(VendorService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  assets: Asset[] = [];
  vendors: Vendor[] = [];
  isSubmitting = false;
  isLoadingData = true;

  maintenanceTypes = ['Preventative', 'Repair', 'Upgrade', 'Inspection'];

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  initForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.createForm = this.fb.group({
      assetId: ['', [Validators.required]],
      vendorId: ['', [Validators.required]],
      maintenanceDate: [today, [Validators.required]],
      maintenanceType: ['Repair', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      expectedCompletionDate: [null],
      remarks: ['', [Validators.maxLength(500)]]
    });
  }

  loadDropdowns(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      assets: this.assetService.getAll(),
      vendors: this.vendorService.getAll()
    }).subscribe({
      next: ({ assets, vendors }) => {
        // filter out disposed assets
        this.assets = assets.filter(a => a.status.toLowerCase() !== 'disposed');
        this.vendors = vendors.filter(v => v.isActive);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load form dropdown data.');
        this.router.navigate(['/maintenance']);
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

    if (formValue.maintenanceDate) {
      formValue.maintenanceDate = new Date(formValue.maintenanceDate).toISOString();
    }
    if (formValue.expectedCompletionDate) {
      formValue.expectedCompletionDate = new Date(formValue.expectedCompletionDate).toISOString();
    }

    this.maintenanceService.create(formValue).subscribe({
      next: () => {
        this.notification.success('Maintenance record created successfully.');
        this.router.navigate(['/maintenance']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to schedule maintenance.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
