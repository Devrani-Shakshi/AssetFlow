import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

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
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly hidePassword = signal(true);
  readonly isLoading = signal(false);
  token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.notification.error('Invalid reset token or link. Please request a new link.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading.set(true);
    const newPassword = this.resetForm.value.password!;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.notification.success('Password reset successful! Please login with your new password.');
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const errMsg = err.error?.message || 'Failed to reset password. The link might have expired.';
        this.notification.error(errMsg);
        this.isLoading.set(false);
      }
    });
  }
}
