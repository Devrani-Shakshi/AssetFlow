import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VendorService } from '../../../../core/services/vendor.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-vendor-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.css']
})
export class VendorEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vendorService = inject(VendorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  isSubmitting = false;
  isLoadingData = true;
  vendorId!: string;

  ngOnInit(): void {
    this.vendorId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadVendorData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.vendorId, [Validators.required]],
      vendorCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      vendorName: ['', [Validators.required, Validators.maxLength(100)]],
      contactPerson: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
      gstNumber: ['', [Validators.required, Validators.maxLength(15)]],
      address: ['', [Validators.required, Validators.maxLength(250)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, Validators.maxLength(10)]],
      website: ['', [Validators.maxLength(100)]],
      isActive: [true, [Validators.required]]
    });
  }

  loadVendorData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    this.vendorService.getById(this.vendorId).subscribe({
      next: (vendor) => {
        this.editForm.patchValue({
          vendorCode: vendor.vendorCode,
          vendorName: vendor.vendorName,
          contactPerson: vendor.contactPerson,
          email: vendor.email,
          phoneNumber: vendor.phoneNumber,
          gstNumber: vendor.gstNumber,
          address: vendor.address,
          city: vendor.city,
          state: vendor.state,
          country: vendor.country,
          postalCode: vendor.postalCode,
          website: vendor.website,
          isActive: vendor.isActive
        });
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load vendor data.');
        this.router.navigate(['/vendors']);
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

    this.vendorService.update(payload).subscribe({
      next: () => {
        this.notification.success('Vendor updated successfully.');
        this.router.navigate(['/vendors']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update vendor.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
