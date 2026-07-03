import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FichePaie, Salaire } from '../../../core/models/paie.model';
import { PaieService } from '../../../core/services/paie.service';

@Component({
  selector: 'app-mes-paie',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    NgForOf,
    NgIf,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mes-paie.html',
  styleUrls: ['./mes-paie.scss']
})
export class MesPaieComponent {
  private readonly paieService = inject(PaieService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly employeeId = 1;

  readonly fichesPaie = signal<FichePaie[]>([]);
  readonly salaire = signal<Salaire | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadSalaire();
    this.loadFichesPaie();
  }

  private loadSalaire(): void {
    this.paieService
      .getSalaireByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          console.warn('Aucun salaire renseigné', err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(salaire => this.salaire.set(salaire));
  }

  private loadFichesPaie(): void {
    this.paieService
      .getFichesPaieByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          this.error.set('Impossible de récupérer vos fiches de paie.');
          console.error(err);
          return of([] as FichePaie[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(fiches => {
        this.fichesPaie.set(fiches);
        this.isLoading.set(false);
      });
  }

  downloadPayslip(fiche: FichePaie): void {
    console.info('Téléchargement de la fiche', fiche);
  }

  trackById(_index: number, fiche: FichePaie): number {
    return fiche.id;
  }
}
