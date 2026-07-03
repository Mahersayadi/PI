import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, RouterModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <h2>Créer une offre d'emploi</h2>
        
        <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titre de l'offre</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="4" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Compétences requises (séparées par des virgules)</mat-label>
            <input matInput formControlName="requirements" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Type de contrat</mat-label>
            <mat-select formControlName="contractType" required>
              <mat-option value="CDI">CDI</mat-option>
              <mat-option value="CDD">CDD</mat-option>
              <mat-option value="STAGE">Stage</mat-option>
              <mat-option value="FREELANCE">Freelance</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date limite</mat-label>
            <input matInput type="date" formControlName="applicationDeadline" required>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/admin/jobs">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="jobForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : 'Créer' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: auto; }
    .full-width { width: 100%; margin-bottom: 15px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class JobCreateComponent {
  jobForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private jobService: JobService, private router: Router) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      contractType: ['', Validators.required],
      applicationDeadline: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.isSubmitting = true;
      this.jobService.createJob(this.jobForm.value).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Offre créée avec succès');
          this.router.navigate(['/admin/jobs']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Erreur', err);
          alert('Erreur lors de la création');
        }
      });
    }
  }
}
