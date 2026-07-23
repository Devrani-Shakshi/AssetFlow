import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  summary: DashboardSummary | null = null;
  isLoading = true;

  quickActions = [
    { label: 'Add Asset', icon: 'add_to_queue', link: '/assets/create', color: 'action-primary' },
    { label: 'Allocate Asset', icon: 'assignment_ind', link: '/allocations/create', color: 'action-success' },
    { label: 'Transfer Asset', icon: 'swap_horiz', link: '/transfers/create', color: 'action-info' },
    { label: 'Schedule Service', icon: 'build_circle', link: '/maintenance/create', color: 'action-warning' }
  ];

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load dashboard summaries.');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
