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
import { DisposalService } from '../../../../core/services/disposal.service';
import { AssetService } from '../../../../core/services/asset.service';
import { AssetDisposal } from '../../../../core/models/disposal.model';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-disposal-list',
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
  templateUrl: './disposal-list.component.html',
  styleUrls: ['./disposal-list.component.css']
})
export class DisposalListComponent implements OnInit {
  private readonly disposalService = inject(DisposalService);
  private readonly assetService = inject(AssetService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['assetCode', 'assetName', 'disposalDate', 'reason', 'disposalMethod', 'amountRecovered', 'approvedBy', 'actions'];
  dataSource = new MatTableDataSource<AssetDisposal>([]);
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
      disposals: this.disposalService.getAll(),
      assets: this.assetService.getAll()
    }).subscribe({
      next: ({ disposals, assets }) => {
        const assetMap = new Map(assets.map(a => [a.id, a]));

        disposals.forEach(d => {
          const asset = assetMap.get(d.assetId);
          d.assetName = asset ? asset.assetName : 'Unknown';
          d.assetCode = asset ? asset.assetCode : 'Unknown';
        });

        this.dataSource.data = disposals;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load asset disposal records.');
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
    this.router.navigate(['/disposal/create']);
  }

  deleteRecord(record: AssetDisposal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Disposal Record',
        message: `Are you sure you want to delete disposal record for "${record.assetName}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.disposalService.delete(record.id).subscribe({
          next: () => {
            this.notification.success('Disposal record deleted successfully.');
            this.loadData();
          },
          error: (err) => {
            this.notification.error(err.error?.message || 'Failed to delete disposal record.');
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}
