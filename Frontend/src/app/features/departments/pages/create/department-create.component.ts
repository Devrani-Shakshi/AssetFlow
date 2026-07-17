import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

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
    MatSnackBarModule,
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
  private readonly snackBar = inject(MatSnackBar);

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
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        setTimeout(() => {
          this.isLoadingEmployees = false;
        });
      },
      error: () => {
        this.snackBar.open('Failed to load employees for manager selection.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        setTimeout(() => {
          this.isLoadingEmployees = false;
        });
      }
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.departmentService.create(this.createForm.value).subscribe({
      next: () => {
        this.snackBar.open('Department created successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to create department.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }
}
