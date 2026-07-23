import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-category-edit',
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
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  isSubmitting = false;
  isLoadingData = true;
  categoryId!: string;

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadCategoryData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.categoryId, [Validators.required]],
      categoryCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      categoryName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      depreciationRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      usefulLifeYears: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      isActive: [true, [Validators.required]]
    });
  }

  loadCategoryData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    this.categoryService.getById(this.categoryId).subscribe({
      next: (category) => {
        this.editForm.patchValue({
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
          description: category.description,
          depreciationRate: category.depreciationRate,
          usefulLifeYears: category.usefulLifeYears,
          isActive: category.isActive
        });
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load asset category data.');
        this.router.navigate(['/categories']);
        this.isLoadingData = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const payload = this.editForm.getRawValue();

    this.categoryService.update(payload).subscribe({
      next: () => {
        this.notification.success('Asset category updated successfully.');
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update asset category.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
