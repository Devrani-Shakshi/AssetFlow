import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="reset-container">
      <mat-card class="reset-card">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Choose a new secure password for your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" />
              <button mat-icon-button type="button" matSuffix (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (resetForm.get('password')?.hasError('required') && resetForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" class="full-width submit-btn" [disabled]="resetForm.invalid">
              Reset Password
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 16px;
    }
    .reset-card {
      width: 100%;
      max-width: 420px;
      padding: 24px;
      border-radius: 16px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
    }
    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 24px;
    }
    mat-card-title {
      font-size: 22px !important;
      font-weight: 600 !important;
      color: #1e293b;
      margin-bottom: 4px;
    }
    mat-card-subtitle {
      font-size: 14px !important;
      color: #64748b !important;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .submit-btn {
      height: 48px !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      border-radius: 8px !important;
      background-color: #3b82f6 !important;
      color: #ffffff !important;
    }
  `]
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly hidePassword = signal(true);

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    // Simulate reset and navigate to login
    alert('Password reset successful! Please login with your new password.');
    this.router.navigate(['/login']);
  }
}
