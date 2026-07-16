import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="header-section">
        <h1>Dashboard</h1>
        <p>Real-time analytics and asset flow summaries</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card primary-card">
          <mat-card-header>
            <mat-icon matCardAvatar class="card-icon">devices</mat-icon>
            <mat-card-title>Total Assets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">1,240</div>
            <div class="stat-meta">Active enterprise devices</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card success-card">
          <mat-card-header>
            <mat-icon matCardAvatar class="card-icon">assignment_turned_in</mat-icon>
            <mat-card-title>Allocated Assets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">842</div>
            <div class="stat-meta">Assigned to employees</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card warning-card">
          <mat-card-header>
            <mat-icon matCardAvatar class="card-icon">build</mat-icon>
            <mat-card-title>In Maintenance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">18</div>
            <div class="stat-meta">Undergoing active repair</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card danger-card">
          <mat-card-header>
            <mat-icon matCardAvatar class="card-icon">delete_sweep</mat-icon>
            <mat-card-title>Disposed Assets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">45</div>
            <div class="stat-meta">Sold or recycled this fiscal year</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .header-section {
      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 4px 0;
      }
      p {
        font-size: 14px;
        color: #64748b;
        margin: 0;
      }
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }
    .stat-card {
      border-radius: 12px !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #e2e8f0 !important;
      background-color: #ffffff !important;
      padding: 16px;
    }
    mat-card-header {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      font-size: 24px;
    }
    mat-card-title {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: #64748b !important;
      margin: 0 !important;
    }
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-meta {
      font-size: 12px;
      color: #94a3b8;
    }
    .primary-card .card-icon {
      background-color: #eff6ff;
      color: #3b82f6;
    }
    .success-card .card-icon {
      background-color: #ecfdf5;
      color: #10b981;
    }
    .warning-card .card-icon {
      background-color: #fffbfe;
      color: #f59e0b;
    }
    .danger-card .card-icon {
      background-color: #fef2f2;
      color: #ef4444;
    }
  `]
})
export class DashboardComponent {}
