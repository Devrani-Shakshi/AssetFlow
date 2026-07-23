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
import { AllocationService } from '../../../../core/services/allocation.service';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Asset } from '../../../../core/models/asset.model';
import { Employee } from '../../../../core/models/employee.model';
import { Department } from '../../../../core/models/department.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-allocation-create',
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
  templateUrl: './allocation-create.component.html',
  styleUrls: ['./allocation-create.component.css']
})
export class AllocationCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly allocationService = inject(AllocationService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  assets: Asset[] = [];
  employees: Employee[] = [];
  departments: Department[] = [];
  isSubmitting = false;
  isLoadingData = true;

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  initForm(): void {
    // get current logged in user name for AllocatedBy field
    const currentUser = this.authService.currentUser();
    const allocatedByStr = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin';

    this.createForm = this.fb.group({
      assetId: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      allocatedBy: [allocatedByStr, [Validators.required]],
      remarks: ['', [Validators.maxLength(500)]]
    });

    // Automatically update department when employee is selected
    this.createForm.get('employeeId')?.valueChanges.subscribe(empId => {
      const selectedEmp = this.employees.find(e => e.id === empId);
      if (selectedEmp) {
        this.createForm.get('departmentId')?.setValue(selectedEmp.departmentId);
      }
    });
  }

  loadDropdowns(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      assets: this.assetService.getAll(),
      employees: this.employeeService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: ({ assets, employees, departments }) => {
        // Only show assets that are 'available' for allocation
        this.assets = assets.filter(a => a.status.toLowerCase() === 'available');
        this.employees = employees.filter(e => e.status === 1); // active employees
        this.departments = departments.filter(d => d.isActive);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load dropdown data for allocation.');
        this.router.navigate(['/allocations']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.allocationService.allocate(this.createForm.value).subscribe({
      next: () => {
        this.notification.success('Asset allocated successfully.');
        this.router.navigate(['/allocations']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to allocate asset.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
