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
import { DepartmentService } from '../../../../core/services/department.service';
import { Department } from '../../../../core/models/department.model';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-department-list',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['code', 'name', 'description', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Department>([]);
  isLoading = true;

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
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load departments.');
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
    this.router.navigate(['/departments/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate([`/departments/edit`, id]);
  }

  deleteDepartment(department: Department): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Department',
        message: `Are you sure you want to delete department "${department.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.departmentService.delete(department.id).subscribe({
          next: () => {
            this.notification.success('Department deleted successfully.');
            this.loadDepartments();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete department.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
