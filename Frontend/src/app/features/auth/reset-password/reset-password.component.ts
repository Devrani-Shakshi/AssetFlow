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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

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
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
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
      this.snackBar.open('Invalid reset token or link. Please request a new link.', 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading.set(true);
    const newPassword = this.resetForm.value.password!;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password reset successful! Please login with your new password.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to reset password. The link might have expired.', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading.set(false);
      }
    });
  }
}
