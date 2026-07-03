import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>

        <form (ngSubmit)="onSubmit()" [formGroup]="forgotForm" *ngIf="!successMessage">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput placeholder="exemple@email.com" formControlName="email" />
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" [disabled]="forgotForm.invalid || isLoading">
            {{ isLoading ? 'Envoi...' : 'Envoyer le lien' }}
          </button>
        </form>

        <div class="success-message" *ngIf="successMessage">
          <p>{{ successMessage }}</p>
        </div>

        <div class="link">
          <p><a routerLink="/auth/login">Retour à la connexion</a></p>
        </div>
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
    .link {
      margin-top: 1rem;
    }
    .success-message {
      color: green;
      font-weight: bold;
      margin: 1rem 0;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.auth.forgotPassword(this.forgotForm.value.email).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.';
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Forgot password error:', err);
          alert('Erreur : ' + (err.error?.message || 'Une erreur est survenue.'));
        }
      });
    }
  }
}
