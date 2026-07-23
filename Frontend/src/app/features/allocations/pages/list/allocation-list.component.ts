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
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { AllocationService } from '../../../../core/services/allocation.service';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { AssetAllocation } from '../../../../core/models/allocation.model';

@Component({
  selector: 'app-allocation-list',
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
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.css']
})
export class AllocationListComponent implements OnInit {
  private readonly allocationService = inject(AllocationService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'employeeName', 'departmentName', 'allocatedBy', 'allocatedDate', 'status'];
  dataSource = new MatTableDataSource<AssetAllocation>([]);
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
      allocations: this.allocationService.getAll(),
      assets: this.assetService.getAll(),
      employees: this.employeeService.getAll(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: ({ allocations, assets, employees, departments }) => {
        const assetMap = new Map(assets.map(a => [a.id, a]));
        const empMap = new Map(employees.map(e => [e.id, `${e.firstName} ${e.lastName}`]));
        const deptMap = new Map(departments.map(d => [d.id, d.name]));

        allocations.forEach(alloc => {
          const asset = assetMap.get(alloc.assetId);
          alloc.assetName = asset ? asset.assetName : 'Unknown';
          alloc.assetCode = asset ? asset.assetCode : 'Unknown';
          alloc.employeeName = empMap.get(alloc.employeeId) || 'Unknown';
          alloc.departmentName = deptMap.get(alloc.departmentId) || 'Unknown';
        });

        this.dataSource.data = allocations;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
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
    this.router.navigate(['/allocations/create']);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'returned': return 'status-returned';
      case 'transferred': return 'status-transferred';
      default: return 'status-unknown';
    }
  }
}
