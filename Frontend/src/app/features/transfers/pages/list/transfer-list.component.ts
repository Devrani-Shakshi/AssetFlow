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
  selector: 'app-transfer-list',
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
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit {
  private readonly allocationService = inject(AllocationService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'fromEmployeeName', 'departmentName', 'allocatedBy', 'allocatedDate'];
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
    this.loadTransfers();
  }

  loadTransfers(): void {
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

        // Filter and map only Transferred allocations
        const transfers = allocations
          .filter(a => a.status.toLowerCase() === 'transferred')
          .map(alloc => {
            const asset = assetMap.get(alloc.assetId);
            return {
              ...alloc,
              assetName: asset ? asset.assetName : 'Unknown',
              assetCode: asset ? asset.assetCode : 'Unknown',
              employeeName: empMap.get(alloc.employeeId) || 'Unknown',
              departmentName: deptMap.get(alloc.departmentId) || 'Unknown'
            };
          });

        this.dataSource.data = transfers;
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
    this.router.navigate(['/transfers/create']);
  }
}
