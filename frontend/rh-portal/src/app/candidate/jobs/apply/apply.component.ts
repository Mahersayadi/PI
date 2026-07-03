import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterModule],
  template: `
    <div class="container">
      <mat-card>
        <h2>Postuler à l'offre</h2>
        
        <form [formGroup]="applyForm" (ngSubmit)="onSubmit()">
          
          <div class="file-upload">
            <label for="cvFile">CV (PDF ou DOCX) *</label>
            <input type="file" id="cvFile" (change)="onFileSelected($event)" accept=".pdf,.doc,.docx" required>
            <div *ngIf="fileError" class="error">{{ fileError }}</div>
          </div>

          <mat-form-field appearance="outline" class="full-width mt-3">
            <mat-label>Lettre de motivation</mat-label>
            <textarea matInput formControlName="coverLetter" rows="6" placeholder="Présentez-vous brièvement..."></textarea>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/candidate/jobs">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="applyForm.invalid || !selectedFile || isSubmitting">
              {{ isSubmitting ? 'Envoi...' : 'Envoyer ma candidature' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: auto; }
    .full-width { width: 100%; margin-top: 15px; }
    .file-upload { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
    .error { color: red; font-size: 0.85em; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ApplyComponent implements OnInit {
  applyForm: FormGroup;
  jobId!: number;
  selectedFile: File | null = null;
  fileError = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private appService: ApplicationService,
    private auth: AuthService,
    private router: Router
  ) {
    this.applyForm = this.fb.group({
      coverLetter: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'Le fichier est trop volumineux (max 5MB).';
        this.selectedFile = null;
      } else {
        this.fileError = '';
        this.selectedFile = file;
      }
    }
  }

  onSubmit() {
    if (this.applyForm.valid && this.selectedFile && this.jobId) {
      this.isSubmitting = true;
      const candidateId = this.auth.getUserId();
      
      const formData = new FormData();
      formData.append('jobOfferId', this.jobId.toString());
      formData.append('candidateId', candidateId ? candidateId.toString() : '0');
      formData.append('coverLetter', this.applyForm.value.coverLetter);
      formData.append('cvFile', this.selectedFile);

      this.appService.applyForJob(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Candidature envoyée avec succès !');
          this.router.navigate(['/candidate/applications']);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
          alert('Erreur lors de l\'envoi de la candidature.');
        }
      });
    }
  }
}
