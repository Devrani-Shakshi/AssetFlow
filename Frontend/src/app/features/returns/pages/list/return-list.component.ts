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
import { ReturnService } from '../../../../core/services/return.service';
import { AssetService } from '../../../../core/services/asset.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { AssetReturn } from '../../../../core/models/return.model';

@Component({
  selector: 'app-return-list',
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
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent implements OnInit {
  private readonly returnService = inject(ReturnService);
  private readonly assetService = inject(AssetService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'employeeName', 'returnDate', 'receivedBy', 'condition'];
  dataSource = new MatTableDataSource<AssetReturn>([]);
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
    this.loadReturns();
  }

  loadReturns(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    forkJoin({
      returns: this.returnService.getAll(),
      assets: this.assetService.getAll(),
      employees: this.employeeService.getAll()
    }).subscribe({
      next: ({ returns, assets, employees }) => {
        const assetMap = new Map(assets.map(a => [a.id, a]));
        const empMap = new Map(employees.map(e => [e.id, `${e.firstName} ${e.lastName}`]));

        returns.forEach(ret => {
          const asset = assetMap.get(ret.assetId);
          ret.assetName = asset ? asset.assetName : 'Unknown';
          ret.assetCode = asset ? asset.assetCode : 'Unknown';
          ret.employeeName = empMap.get(ret.employeeId) || 'Unknown';
        });

        this.dataSource.data = returns;
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
    this.router.navigate(['/returns/create']);
  }
}
