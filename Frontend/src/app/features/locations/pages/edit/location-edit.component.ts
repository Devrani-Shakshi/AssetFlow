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
import { LocationService } from '../../../../core/services/location.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-location-edit',
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
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.css']
})
export class LocationEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  editForm!: FormGroup;
  isSubmitting = false;
  isLoadingData = true;
  locationId!: string;

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadLocationData();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      id: [this.locationId, [Validators.required]],
      locationCode: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
      locationName: ['', [Validators.required, Validators.maxLength(100)]],
      building: ['', [Validators.maxLength(50)]],
      floor: ['', [Validators.maxLength(50)]],
      room: ['', [Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true, [Validators.required]]
    });
  }

  loadLocationData(): void {
    this.isLoadingData = true;
    this.cdr.markForCheck();

    this.locationService.getById(this.locationId).subscribe({
      next: (loc) => {
        this.editForm.patchValue({
          locationCode: loc.locationCode,
          locationName: loc.locationName,
          building: loc.building,
          floor: loc.floor,
          room: loc.room,
          description: loc.description,
          isActive: loc.isActive
        });
        this.isLoadingData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.error('Failed to load location data.');
        this.router.navigate(['/locations']);
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

    this.locationService.update(payload).subscribe({
      next: () => {
        this.notification.success('Location updated successfully.');
        this.router.navigate(['/locations']);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to update location.');
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }
}
