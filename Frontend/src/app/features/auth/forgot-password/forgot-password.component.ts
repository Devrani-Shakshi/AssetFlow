import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

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
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly isSubmitted = signal(false);
  readonly emailSent = signal('');
  readonly isLoading = signal(false);

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    const email = this.forgotForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.emailSent.set(email);
        this.isSubmitted.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to send reset link. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isLoading.set(false);
      }
    });
  }
}
