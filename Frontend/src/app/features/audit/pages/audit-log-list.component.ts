import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLog } from '../../../core/models/audit-log.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-audit-log-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Audit Log JSON Diff</h2>
    <mat-dialog-content>
      <div class="diff-container">
        @if (data.oldValue) {
          <div class="diff-box">
            <h4>Old Value:</h4>
            <pre>{{ formatJson(data.oldValue) }}</pre>
          </div>
        }
        @if (data.newValue) {
          <div class="diff-box">
            <h4>New Value:</h4>
            <pre>{{ formatJson(data.newValue) }}</pre>
          </div>
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .diff-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      min-width: 320px;
      max-width: 600px;
    }
    @media (min-width: 600px) {
      .diff-container {
        grid-template-columns: 1fr 1fr;
      }
    }
    .diff-box pre {
      background-color: #f1f5f9;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 12px;
      max-height: 300px;
    }
    h4 {
      margin-top: 0;
      color: #334155;
    }
  `]
})
export class AuditLogDetailDialogComponent {
  data = inject<{ oldValue?: string, newValue?: string }>(MAT_DIALOG_DATA);

  formatJson(val?: string): string {
    if (!val) return '';
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch {
      return val;
    }
  }
}

@Component({
  selector: 'app-audit-log-list',
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
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.css']
})
export class AuditLogListComponent implements OnInit {
  private readonly auditLogService = inject(AuditLogService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['timestamp', 'action', 'entityName', 'entityId', 'ipAddress', 'actions'];
  dataSource = new MatTableDataSource<AuditLog>([]);
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
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.auditLogService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load audit logs.');
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

  getActionClass(action: string): string {
    switch (action?.toLowerCase()) {
      case 'create': return 'action-create';
      case 'update': return 'action-update';
      case 'delete': return 'action-delete';
      case 'allocate':
      case 'assign': return 'action-allocate';
      case 'return': return 'action-return';
      case 'transfer': return 'action-transfer';
      default: return 'action-default';
    }
  }

  viewDetail(log: AuditLog): void {
    this.dialog.open(AuditLogDetailDialogComponent, {
      width: '650px',
      data: {
        oldValue: log.oldValue,
        newValue: log.newValue
      }
    });
  }
}
