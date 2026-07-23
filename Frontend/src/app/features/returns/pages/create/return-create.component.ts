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
import { ReturnService } from '../../../../core/services/return.service';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Asset } from '../../../../core/models/asset.model';
import { Employee } from '../../../../core/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-return-create',
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
  templateUrl: './return-create.component.html',
  styleUrls: ['./return-create.component.css']
})
export class ReturnCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly returnService = inject(ReturnService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  assets: Asset[] = [];
  employees: Employee[] = [];
  currentOwnerName = '';
  isSubmitting = false;
  isLoadingData = true;

  conditions = ['New', 'Good', 'Fair', 'Poor', 'Broken'];

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  initForm(): void {
    const currentUser = this.authService.currentUser();
    const receivedByStr = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin';

    this.createForm = this.fb.group({
      assetId: ['', [Validators.required]],
      employeeId: ['', [Validators.required]], // automatically set based on selected asset
      condition: ['Good', [Validators.required]],
      remarks: ['', [Validators.maxLength(500)]],
      receivedBy: [receivedByStr, [Validators.required]]
    });

    // Automatically set employeeId when asset changes
    this.createForm.get('assetId')?.valueChanges.subscribe(assetId => {
      const selectedAsset = this.assets.find(a => a.id === assetId);
      if (selectedAsset && selectedAsset.assignedEmployeeId) {
        const emp = this.employees.find(e => e.id === selectedAsset.assignedEmployeeId);
        this.currentOwnerName = emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
        this.createForm.get('employeeId')?.setValue(selectedAsset.assignedEmployeeId);
      } else {
        this.currentOwnerName = 'None';
        this.createForm.get('employeeId')?.setValue('');
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
        // Only return assets that are currently allocated
        this.assets = assets.filter(a => a.status.toLowerCase() === 'allocated');
        this.employees = employees;
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load return form dropdowns.');
        this.router.navigate(['/returns']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.returnService.processReturn(this.createForm.value).subscribe({
      next: () => {
        this.notification.success('Asset returned successfully.');
        this.router.navigate(['/returns']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to process asset return.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
