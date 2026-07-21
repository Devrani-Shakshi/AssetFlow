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
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-department-create',
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
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.css']
})
export class DepartmentCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  employees: Employee[] = [];
  isSubmitting = false;
  isLoadingEmployees = false;

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      managerId: [null]
    });
  }

  loadEmployees(): void {
    this.isLoadingEmployees = true;
    this.cdr.markForCheck();
    
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoadingEmployees = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load employees for manager selection.');
        this.isLoadingEmployees = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();
    
    this.departmentService.create(this.createForm.value).subscribe({
      next: () => {
        this.notification.success('Department created successfully.');
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to create department.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
