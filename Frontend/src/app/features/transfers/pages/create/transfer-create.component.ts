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
import { TransferService } from '../../../../core/services/transfer.service';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Asset } from '../../../../core/models/asset.model';
import { Employee } from '../../../../core/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-transfer-create',
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
  templateUrl: './transfer-create.component.html',
  styleUrls: ['./transfer-create.component.css']
})
export class TransferCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transferService = inject(TransferService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  assets: Asset[] = [];
  employees: Employee[] = [];
  currentOwnerName = '';
  isSubmitting = false;
  isLoadingData = true;

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      assetId: ['', [Validators.required]],
      toEmployeeId: ['', [Validators.required]]
    });

    // Handle asset selection to show current owner
    this.createForm.get('assetId')?.valueChanges.subscribe(assetId => {
      const selectedAsset = this.assets.find(a => a.id === assetId);
      if (selectedAsset && selectedAsset.assignedEmployeeId) {
        const emp = this.employees.find(e => e.id === selectedAsset.assignedEmployeeId);
        this.currentOwnerName = emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
      } else {
        this.currentOwnerName = 'None';
      }
      this.cdr.markForCheck();
    });
  }

  loadDropdowns(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      assets: this.assetService.getAll(),
      employees: this.employeeService.getAll()
    }).subscribe({
      next: ({ assets, employees }) => {
        // Only allow transferring allocated assets
        this.assets = assets.filter(a => a.status.toLowerCase() === 'allocated');
        this.employees = employees.filter(e => e.status === 1); // active employees
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load transfer dropdown data.');
        this.router.navigate(['/transfers']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    // Check if transferring to the same owner
    const assetId = this.createForm.get('assetId')?.value;
    const toEmployeeId = this.createForm.get('toEmployeeId')?.value;
    const selectedAsset = this.assets.find(a => a.id === assetId);

    if (selectedAsset && selectedAsset.assignedEmployeeId === toEmployeeId) {
      this.notification.error('Asset is already assigned to this employee.');
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.transferService.transfer(this.createForm.value).subscribe({
      next: () => {
        this.notification.success('Asset transferred successfully.');
        this.router.navigate(['/transfers']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to transfer asset.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
