import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CongeResponse, CongeStatut } from '../../../core/models/conge.model';
import { CongeService } from '../../../core/services/conge.service';

@Component({
  selector: 'app-conge-validation',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './conge-validation.html',
  styleUrls: ['./conge-validation.scss']
})
export class CongeValidationComponent {
  private readonly congeService = inject(CongeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly pendingConges = signal<CongeResponse[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly commentDrafts = signal<Record<number, FormControl<string>>>({});

  constructor() {
    this.loadPendingConges();
  }

  private loadPendingConges(): void {
    this.congeService
      .getByStatut('EN_ATTENTE')
      .pipe(
        catchError(err => {
          this.error.set('Impossible de récupérer les demandes en attente.');
          console.error(err);
          return of([] as CongeResponse[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conges => {
        this.pendingConges.set(conges);
        const controls: Record<number, FormControl<string>> = {};
        conges.forEach(conge => {
          controls[conge.id] = new FormControl('', { nonNullable: true });
        });
        this.commentDrafts.set(controls);
        this.isLoading.set(false);
      });
  }

  approve(conge: CongeResponse): void {
    this.updateStatus(conge, 'APPROUVE');
  }

  refuse(conge: CongeResponse): void {
    this.updateStatus(conge, 'REFUSE');
  }

  private updateStatus(conge: CongeResponse, statut: CongeStatut): void {
    const control = this.commentDrafts()[conge.id];
    const commentaire = control?.value?.trim() ||
      (statut === 'APPROUVE' ? 'Congé validé' : 'Demande refusée');

    this.isLoading.set(true);
    this.congeService
      .validerConge(conge.id, { statut, commentaireResponsable: commentaire })
      .pipe(
        catchError(err => {
          this.error.set("Impossible de mettre à jour la demande.");
          console.error(err);
          this.isLoading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.snackBar.open(`Demande ${statut === 'APPROUVE' ? 'approuvée' : 'refusée'}`, 'Fermer', {
          duration: 4000
        });
        this.loadPendingConges();
      });
  }

  trackById(_index: number, conge: CongeResponse): number {
    return conge.id;
  }
}
