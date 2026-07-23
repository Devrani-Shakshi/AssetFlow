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
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Employee } from '../../../../core/models/employee.model';
import { Department } from '../../../../core/models/department.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-create',
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
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  employees: Employee[] = [];
  departments: Department[] = [];
  isSubmitting = false;
  isLoadingLists = false;

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      employeeCode: ['', [Validators.required, Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$'), Validators.maxLength(20)]],
      departmentId: ['', [Validators.required]],
      designation: ['', [Validators.required, Validators.maxLength(100)]],
      joiningDate: ['', [Validators.required]],
      managerId: [null]
    });
  }

  loadDropdownData(): void {
    this.isLoadingLists = true;
    this.cdr.markForCheck();

    this.departmentService.getAll().subscribe({
      next: (depts) => {
        this.departments = depts;
        this.loadEmployees();
      },
      error: () => {
        this.notification.error('Failed to load departments.');
        this.isLoadingLists = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoadingLists = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load employee list for manager selection.');
        this.isLoadingLists = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const formValue = { ...this.createForm.value };
    // backend expects joiningDate in ISO format, type="date" input gives "YYYY-MM-DD"
    if (formValue.joiningDate) {
      formValue.joiningDate = new Date(formValue.joiningDate).toISOString();
    }

    this.employeeService.create(formValue).subscribe({
      next: () => {
        this.notification.success('Employee created successfully.');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to create employee.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
