import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';
import { NotificationService } from '../../../core/services/notification.service';

interface ReportType {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private readonly reportService = inject(ReportService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  reportTypes: ReportType[] = [
    { value: 'assets', label: 'Assets Inventory', icon: 'devices' },
    { value: 'warranty', label: 'Warranty Expiry', icon: 'verified' },
    { value: 'employees', label: 'Employees Directory', icon: 'people' },
    { value: 'departments', label: 'Departments List', icon: 'business' },
    { value: 'vendors', label: 'Vendors Directory', icon: 'storefront' },
    { value: 'maintenance', label: 'Maintenance Log', icon: 'build' },
    { value: 'disposal', label: 'Disposal Register', icon: 'delete_forever' }
  ];

  selectedReport = 'assets';
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

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
    this.loadReport();
  }

  onReportTypeChange(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.dataSource.data = [];
    this.cdr.markForCheck();

    switch (this.selectedReport) {
      case 'assets':
        this.displayedColumns = ['assetCode', 'assetName', 'serialNumber', 'model', 'purchaseDate', 'purchaseCost', 'status'];
        this.reportService.getAssetsReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'warranty':
        this.displayedColumns = ['assetCode', 'assetName', 'model', 'purchaseDate', 'warrantyExpiryDate', 'status'];
        this.reportService.getWarrantyExpiryReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'employees':
        this.displayedColumns = ['employeeCode', 'firstName', 'lastName', 'email', 'departmentName', 'designation', 'status'];
        this.reportService.getEmployeesReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'departments':
        this.displayedColumns = ['name', 'code', 'description', 'isActive'];
        this.reportService.getDepartmentsReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'vendors':
        this.displayedColumns = ['vendorName', 'contactPerson', 'email', 'phone', 'address', 'isActive'];
        this.reportService.getVendorsReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'maintenance':
        this.displayedColumns = ['maintenanceType', 'maintenanceDate', 'cost', 'status', 'expectedCompletionDate', 'completedDate'];
        this.reportService.getMaintenanceReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
      case 'disposal':
        this.displayedColumns = ['disposalDate', 'reason', 'disposalMethod', 'amountRecovered', 'approvedBy'];
        this.reportService.getDisposalReport().subscribe({
          next: data => this.updateDataSource(data),
          error: () => this.handleError()
        });
        break;
    }
  }

  updateDataSource(data: any[]): void {
    this.dataSource.data = data;
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  handleError(): void {
    this.notification.error('Failed to load report data.');
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.cdr.markForCheck();
  }

  exportToCSV(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.info('No data available to export.');
      return;
    }

    const headers = this.displayedColumns.join(',');
    const csvRows = this.dataSource.data.map(row => {
      return this.displayedColumns.map(col => {
        const val = row[col];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.selectedReport}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.notification.success('Report exported to CSV successfully.');
  }
}
