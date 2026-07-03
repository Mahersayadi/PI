import { DatePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CongeResponse, CongeStatut } from '../../../core/models/conge.model';
import { CongeService } from '../../../core/services/conge.service';

@Component({
  selector: 'app-mes-conges',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    TitleCasePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mes-conges.html',
  styleUrls: ['./mes-conges.scss']
})
export class MesCongesComponent {
  private readonly congeService = inject(CongeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly employeeId = 1;

  readonly conges = signal<CongeResponse[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly statusFilter = signal<'ALL' | CongeStatut>('ALL');

  readonly filteredConges = computed(() => {
    const status = this.statusFilter();
    return this.conges().filter(conge => status === 'ALL' || conge.statut === status);
  });

  readonly balances = computed(() => {
    const totals = new Map<string, number>();
    this.conges().forEach(conge => {
      totals.set(conge.typeConge, (totals.get(conge.typeConge) ?? 0) + conge.nombreJours);
    });
    return Array.from(totals.entries()).map(([type, days]) => ({ type, days }));
  });

  readonly leaveForm: FormGroup = inject(FormBuilder).group({
    typeConge: ['Congé payé', Validators.required],
    dateDebut: [null, Validators.required],
    dateFin: [null, Validators.required],
    motif: ['', Validators.required]
  });

  constructor() {
    this.loadConges();
  }

  private loadConges(): void {
    this.congeService
      .getByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          this.error.set('Impossible de récupérer vos congés.');
          console.error(err);
          return of([] as CongeResponse[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conges => {
        this.conges.set(conges);
        this.isLoading.set(false);
      });
  }

  submitRequest(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const formValue = this.leaveForm.value;
    const payload = {
      employeeId: this.employeeId,
      typeConge: formValue.typeConge,
      dateDebut:
        formValue.dateDebut instanceof Date
          ? formValue.dateDebut.toISOString().split('T')[0]
          : formValue.dateDebut,
      dateFin:
        formValue.dateFin instanceof Date
          ? formValue.dateFin.toISOString().split('T')[0]
          : formValue.dateFin,
      motif: formValue.motif
    };

    this.isSubmitting.set(true);
    this.congeService
      .demanderConge(payload)
      .pipe(
        catchError(err => {
          this.error.set('Impossible d\'enregistrer la demande de congé.');
          console.error(err);
          this.isSubmitting.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.snackBar.open('Demande de congé envoyée', 'Fermer', { duration: 4000 });
        this.leaveForm.reset({ typeConge: 'Congé payé', dateDebut: null, dateFin: null, motif: '' });
        this.isSubmitting.set(false);
        this.loadConges();
      });
  }

  trackById(_index: number, conge: CongeResponse): number {
    return conge.id;
  }
}
