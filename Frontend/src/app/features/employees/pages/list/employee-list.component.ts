import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Employee, EmployeeStatus } from '../../../../core/models/employee.model';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['employeeCode', 'fullName', 'email', 'departmentName', 'designation', 'status', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  isLoading = true;
  EmployeeStatus = EmployeeStatus;

  private paginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (mp) {
      this.paginator = mp;
      this.dataSource.paginator = this.paginator;
      this.cdr.markForCheck();
    }
  }

  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    if (ms) {
      this.sort = ms;
      this.dataSource.sort = this.sort;
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    forkJoin({
      employees: this.employeeService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: ({ employees, departments }) => {
        // Map departmentName and managerName
        const deptMap = new Map(departments.map(d => [d.id, d.name]));
        const empMap = new Map(employees.map(e => [e.id, `${e.firstName} ${e.lastName}`]));

        employees.forEach(emp => {
          emp.departmentName = deptMap.get(emp.departmentId) || 'Unknown';
          if (emp.managerId) {
            emp.managerName = empMap.get(emp.managerId) || 'Unknown';
          }
        });

        this.dataSource.data = employees;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load employees.');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.cdr.markForCheck();
  }

  navigateToAdd(): void {
    this.router.navigate(['/employees/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate([`/employees/edit`, id]);
  }

  getStatusName(status: EmployeeStatus): string {
    switch (status) {
      case EmployeeStatus.Active: return 'Active';
      case EmployeeStatus.Inactive: return 'Inactive';
      case EmployeeStatus.OnLeave: return 'On Leave';
      case EmployeeStatus.Resigned: return 'Resigned';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: EmployeeStatus): string {
    switch (status) {
      case EmployeeStatus.Active: return 'status-active';
      case EmployeeStatus.Inactive: return 'status-inactive';
      case EmployeeStatus.OnLeave: return 'status-leave';
      case EmployeeStatus.Resigned: return 'status-resigned';
      default: return '';
    }
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete employee "${employee.firstName} ${employee.lastName}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.delete(employee.id).subscribe({
          next: () => {
            this.notification.success('Employee deleted successfully.');
            this.loadData();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete employee.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
