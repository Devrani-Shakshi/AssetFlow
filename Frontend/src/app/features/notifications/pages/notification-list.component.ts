import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SystemNotificationService } from '../../../core/services/system-notification.service';
import { SystemNotification } from '../../../core/models/system-notification.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  private readonly systemNotificationService = inject(SystemNotificationService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  notifications: SystemNotification[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.systemNotificationService.getAll().subscribe({
      next: (data) => {
        // Sort by date desc
        this.notifications = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to load notifications.');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  markAsRead(n: SystemNotification): void {
    if (n.isRead) return;

    this.systemNotificationService.markAsRead(n.id).subscribe({
      next: () => {
        n.isRead = true;
        this.notification.success('Notification marked as read.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update notification.');
        this.cdr.markForCheck();
      }
    });
  }

  deleteNotification(id: string): void {
    this.systemNotificationService.delete(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notification.success('Notification deleted.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to delete notification.');
        this.cdr.markForCheck();
      }
    });
  }

  getIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'alert':
      case 'danger': return 'error';
      case 'success': return 'check_circle';
      default: return 'notifications';
    }
  }

  getIconClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'info': return 'icon-info';
      case 'warning': return 'icon-warning';
      case 'alert':
      case 'danger': return 'icon-danger';
      case 'success': return 'icon-success';
      default: return 'icon-default';
    }
  }
}
