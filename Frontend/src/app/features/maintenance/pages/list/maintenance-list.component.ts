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
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { AssetService } from '../../../../core/services/asset.service';
import { VendorService } from '../../../../core/services/vendor.service';
import { AssetMaintenance } from '../../../../core/models/maintenance.model';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-maintenance-list',
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
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css']
})
export class MaintenanceListComponent implements OnInit {
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly assetService = inject(AssetService);
  private readonly vendorService = inject(VendorService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'vendorName', 'maintenanceType', 'cost', 'status', 'expectedCompletionDate', 'actions'];
  dataSource = new MatTableDataSource<AssetMaintenance>([]);
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
      maintenances: this.maintenanceService.getAll(),
      assets: this.assetService.getAll(),
      vendors: this.vendorService.getAll()
    }).subscribe({
      next: ({ maintenances, assets, vendors }) => {
        const assetMap = new Map(assets.map(a => [a.id, a]));
        const vendorMap = new Map(vendors.map(v => [v.id, v.vendorName]));

        maintenances.forEach(m => {
          const asset = assetMap.get(m.assetId);
          m.assetName = asset ? asset.assetName : 'Unknown';
          m.assetCode = asset ? asset.assetCode : 'Unknown';
          m.vendorName = vendorMap.get(m.vendorId) || 'Unknown';
        });

        this.dataSource.data = maintenances;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load maintenance records.');
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
    this.router.navigate(['/maintenance/create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate([`/maintenance/edit`, id]);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'status-scheduled';
      case 'in progress':
      case 'inprogress': return 'status-inprogress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  deleteRecord(record: AssetMaintenance): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Maintenance Record',
        message: `Are you sure you want to delete maintenance record for "${record.assetName}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.maintenanceService.delete(record.id).subscribe({
          next: () => {
            this.notification.success('Record deleted successfully.');
            this.loadData();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete maintenance record.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
