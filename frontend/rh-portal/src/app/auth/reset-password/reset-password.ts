import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <h2>Nouveau mot de passe</h2>
        <p>Veuillez entrer votre nouveau mot de passe.</p>

        <form (ngSubmit)="onSubmit()" [formGroup]="resetForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nouveau mot de passe</mat-label>
            <input matInput type="password" formControlName="newPassword" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmer le mot de passe</mat-label>
            <input matInput type="password" formControlName="confirmPassword" />
          </mat-form-field>

          <div *ngIf="resetForm.errors?.['mismatch'] && (resetForm.touched || resetForm.dirty)" class="error-message">
            Les mots de passe ne correspondent pas.
          </div>

          <button mat-raised-button color="primary" class="full-width" [disabled]="resetForm.invalid || isLoading">
            {{ isLoading ? 'En cours...' : 'Réinitialiser' }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .auth-card {
      width: 400px;
      padding: 2rem;
      text-align: center;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .error-message {
      color: red;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-align: left;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        alert('Jeton de réinitialisation manquant.');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.isLoading = true;
      const newPassword = this.resetForm.value.newPassword;
      this.auth.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Mot de passe réinitialisé avec succès !');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Reset password error:', err);
          alert('Erreur : ' + (err.error?.message || 'Impossible de réinitialiser le mot de passe.'));
        }
      });
    }
  }
}
