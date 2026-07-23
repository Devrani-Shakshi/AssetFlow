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
import { DisposalService } from '../../../../core/services/disposal.service';
import { AssetService } from '../../../../core/services/asset.service';
import { Asset } from '../../../../core/models/asset.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-disposal-create',
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
  templateUrl: './disposal-create.component.html',
  styleUrls: ['./disposal-create.component.css']
})
export class DisposalCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly disposalService = inject(DisposalService);
  private readonly assetService = inject(AssetService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  assets: Asset[] = [];
  isSubmitting = false;
  isLoadingData = true;

  disposalMethods = ['Scrapped', 'Sold', 'Donated', 'Recycled', 'Returned to Vendor'];

  ngOnInit(): void {
    this.initForm();
    this.loadAssets();
  }

  initForm(): void {
    const currentUser = this.authService.currentUser();
    const approvedByStr = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin';
    const today = new Date().toISOString().substring(0, 10);

    this.createForm = this.fb.group({
      assetId: ['', [Validators.required]],
      disposalDate: [today, [Validators.required]],
      reason: ['', [Validators.required, Validators.maxLength(250)]],
      disposalMethod: ['Scrapped', [Validators.required]],
      amountRecovered: [0, [Validators.required, Validators.min(0)]],
      approvedBy: [approvedByStr, [Validators.required]],
      remarks: ['', [Validators.maxLength(500)]]
    });
  }

  loadAssets(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    this.assetService.getAll().subscribe({
      next: (data) => {
        // Only show assets that are not disposed yet
        this.assets = data.filter(a => a.status.toLowerCase() !== 'disposed');
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load assets list.');
        this.router.navigate(['/disposal']);
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
    if (formValue.disposalDate) {
      formValue.disposalDate = new Date(formValue.disposalDate).toISOString();
    }

    this.disposalService.create(formValue).subscribe({
      next: () => {
        this.notification.success('Asset disposal processed successfully.');
        this.router.navigate(['/disposal']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to process asset disposal.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
