import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
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
    <div class="forgot-container">
      <mat-card class="forgot-card">
        <mat-card-header>
          <mat-card-title>Forgot Password</mat-card-title>
          <mat-card-subtitle>Enter your email to receive a password reset link</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (isSubmitted()) {
            <div class="success-message">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <p>A password reset link has been sent to <strong>{{ emailSent() }}</strong>.</p>
              <a [routerLink]="['/login']" mat-flat-button color="primary" class="full-width back-btn">Back to Sign In</a>
            </div>
          } @else {
            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" placeholder="name@company.com" />
                <mat-icon matSuffix>email</mat-icon>
                @if (forgotForm.get('email')?.hasError('required') && forgotForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (forgotForm.get('email')?.hasError('email') && forgotForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email address</mat-error>
                }
              </mat-form-field>

              <button mat-flat-button color="primary" class="full-width submit-btn" [disabled]="forgotForm.invalid">
                Send Reset Link
              </button>

              <div class="back-row">
                <a [routerLink]="['/login']" class="back-link">Back to Sign In</a>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 16px;
    }
    .forgot-card {
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
    .submit-btn, .back-btn {
      height: 48px !important;
      font-size: 16px !important;
      font-weight: 500 !important;
      border-radius: 8px !important;
      background-color: #3b82f6 !important;
      color: #ffffff !important;
    }
    .back-row {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
    .back-link {
      font-size: 13px;
      color: #64748b;
      text-decoration: none;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    .success-message {
      text-align: center;
      padding: 16px 0;
    }
    .success-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #10b981;
      margin-bottom: 16px;
    }
  `]
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  readonly forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly isSubmitted = signal(false);
  readonly emailSent = signal('');

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.emailSent.set(this.forgotForm.value.email || '');
    this.isSubmitted.set(true);
  }
}
