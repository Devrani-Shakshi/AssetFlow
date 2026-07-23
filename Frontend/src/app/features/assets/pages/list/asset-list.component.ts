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
import { AssetService } from '../../../../core/services/asset.service';
import { CategoryService } from '../../../../core/services/category.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { LocationService } from '../../../../core/services/location.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Asset } from '../../../../core/models/asset.model';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-asset-list',
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
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
  private readonly assetService = inject(AssetService);
  private readonly categoryService = inject(CategoryService);
  private readonly departmentService = inject(DepartmentService);
  private readonly locationService = inject(LocationService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'categoryName', 'locationName', 'purchaseCost', 'status', 'actions'];
  dataSource = new MatTableDataSource<Asset>([]);
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
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    forkJoin({
      assets: this.assetService.getAll(),
      categories: this.categoryService.getAll(),
      departments: this.departmentService.getAll(),
      locations: this.locationService.getAll(),
      employees: this.employeeService.getAll()
    }).subscribe({
      next: ({ assets, categories, departments, locations, employees }) => {
        const catMap = new Map(categories.map(c => [c.id, c.categoryName]));
        const deptMap = new Map(departments.map(d => [d.id, d.name]));
        const locMap = new Map(locations.map(l => [l.id, l.locationName]));
        const empMap = new Map(employees.map(e => [e.id, `${e.firstName} ${e.lastName}`]));

        assets.forEach(asset => {
          asset.categoryName = catMap.get(asset.categoryId) || 'Unknown';
          asset.departmentName = deptMap.get(asset.departmentId) || 'Unknown';
          asset.locationName = locMap.get(asset.locationId) || 'Unknown';
          if (asset.assignedEmployeeId) {
            asset.assignedEmployeeName = empMap.get(asset.assignedEmployeeId) || 'Unknown';
          }
        });

        this.dataSource.data = assets;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load assets.');
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
    this.router.navigate(['/assets/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate([`/assets/edit`, id]);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'available': return 'status-available';
      case 'allocated': return 'status-allocated';
      case 'maintenance': return 'status-maintenance';
      case 'disposed': return 'status-disposed';
      default: return 'status-unknown';
    }
  }

  deleteAsset(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Asset',
        message: `Are you sure you want to delete asset "${asset.assetName}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.assetService.delete(asset.id).subscribe({
          next: () => {
            this.notification.success('Asset deleted successfully.');
            this.loadData();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete asset.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
