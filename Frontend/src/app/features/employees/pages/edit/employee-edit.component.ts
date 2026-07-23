import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Employee, EmployeeStatus } from '../../../../core/models/employee.model';
import { Department } from '../../../../core/models/department.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-edit',
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
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  employees: Employee[] = [];
  departments: Department[] = [];
  isSubmitting = false;
  isLoadingData = true;
  employeeId!: string;
  EmployeeStatus = EmployeeStatus;

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadFormData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.employeeId, [Validators.required]],
      employeeCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$'), Validators.maxLength(20)]],
      departmentId: ['', [Validators.required]],
      designation: ['', [Validators.required, Validators.maxLength(100)]],
      joiningDate: ['', [Validators.required]],
      managerId: [null],
      status: [EmployeeStatus.Active, [Validators.required]]
    });
  }

  loadFormData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      employee: this.employeeService.getById(this.employeeId),
      employees: this.employeeService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: ({ employee, employees, departments }) => {
        // filter out current employee from potential managers list
        this.employees = employees.filter(e => e.id !== this.employeeId);
        this.departments = departments;

        // format joiningDate to YYYY-MM-DD for date input
        let formattedDate = '';
        if (employee.joiningDate) {
          formattedDate = new Date(employee.joiningDate).toISOString().substring(0, 10);
        }

        this.editForm.patchValue({
          employeeCode: employee.employeeCode,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          departmentId: employee.departmentId,
          designation: employee.designation,
          joiningDate: formattedDate,
          managerId: employee.managerId,
          status: employee.status
        });

        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load employee data.');
        this.router.navigate(['/employees']);
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
    if (payload.joiningDate) {
      payload.joiningDate = new Date(payload.joiningDate).toISOString();
    }

    this.employeeService.update(payload).subscribe({
      next: () => {
        this.notification.success('Employee updated successfully.');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update employee.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
