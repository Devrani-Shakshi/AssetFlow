import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  createForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      categoryCode: ['', [Validators.required, Validators.maxLength(20)]],
      categoryName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      depreciationRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      usefulLifeYears: [1, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.categoryService.create(this.createForm.value).subscribe({
      next: () => {
        this.notification.success('Asset category created successfully.');
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to create asset category.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
