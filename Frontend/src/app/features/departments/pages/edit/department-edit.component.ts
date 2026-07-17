import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DepartmentService } from '../../../../core/services/department.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-department-edit',
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
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css']
})
export class DepartmentEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editForm!: FormGroup;
  employees: Employee[] = [];
  isSubmitting = false;
  isLoadingData = true;
  departmentId!: string;

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadEmployees();
    this.loadDepartmentData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.departmentId, [Validators.required]],
      code: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      managerId: [null],
      isActive: [true, [Validators.required]]
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {
        this.snackBar.open('Failed to load employees for manager selection.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  loadDepartmentData(): void {
    this.isLoadingData = true;
    this.departmentService.getById(this.departmentId).subscribe({
      next: (dept) => {
        this.editForm.patchValue({
          code: dept.code,
          name: dept.name,
          description: dept.description,
          managerId: dept.managerId,
          isActive: dept.isActive
        });
        this.isLoadingData = false;
      },
      error: () => {
        this.snackBar.open('Failed to load department data.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/departments']);
        this.isLoadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.isSubmitting = true;
    // Extract raw values as 'code' is disabled and we want to include it or we can just send the raw values
    const payload = this.editForm.getRawValue();

    this.departmentService.update(payload).subscribe({
      next: () => {
        this.snackBar.open('Department updated successfully.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/departments']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to update department.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
      }
    });
  }
}
