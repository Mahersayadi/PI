import { DatePipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, of } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CongeResponse, CongeStatut } from '../../../core/models/conge.model';
import { CongeService } from '../../../core/services/conge.service';

@Component({
  selector: 'app-conge-list',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    TitleCasePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './conge-list.html',
  styleUrls: ['./conge-list.scss']
})
export class CongeListComponent {
  private readonly congeService = inject(CongeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<'ALL' | CongeStatut>('ALL', { nonNullable: true });

  readonly conges = signal<CongeResponse[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly filteredConges = computed(() => {
    const search = this.searchControl.value?.toLowerCase().trim() ?? '';
    const status = this.statusControl.value;
    return this.conges().filter(conge => {
      const matchesStatus = status === 'ALL' || conge.statut === status;
      const matchesSearch = !search ||
        conge.employeeNom?.toLowerCase().includes(search) ||
        conge.typeConge.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  });

  readonly displayedColumns = ['employee', 'type', 'dates', 'status', 'actions'] as const;

  constructor() {
    this.setupDataStream();
  }

  private setupDataStream(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.statusControl.valueChanges.pipe(startWith<'ALL' | CongeStatut>('ALL'))
    ])
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.error.set(null);
        }),
        switchMap(([_search, status]) => {
          if (status !== 'ALL') {
            return this.congeService.getByStatut(status).pipe(
              catchError(err => {
                this.error.set('Impossible de récupérer les congés.');
                console.error(err);
                return of([] as CongeResponse[]);
              })
            );
          }
          return this.congeService.getAll().pipe(
            catchError(err => {
              this.error.set('Impossible de récupérer les congés.');
              console.error(err);
              return of([] as CongeResponse[]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conges => {
        this.conges.set(conges);
        this.isLoading.set(false);
      });
  }

  refresh(): void {
    this.statusControl.setValue(this.statusControl.value, { emitEvent: true });
  }

  onDelete(conge: CongeResponse): void {
    this.isLoading.set(true);
    this.congeService
      .supprimerConge(conge.id)
      .pipe(
        catchError(err => {
          this.error.set("Impossible de supprimer la demande de congé.");
          console.error(err);
          this.isLoading.set(false);
          return of(null);
        }),
        switchMap(result => {
          if (result === null) {
            return of(null);
          }
          this.snackBar.open('Demande de congé supprimée', 'Fermer', { duration: 4000 });
          return this.congeService.getAll();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conges => {
        if (conges) {
          this.conges.set(conges);
        }
        this.isLoading.set(false);
      });
  }

  trackById(_index: number, conge: CongeResponse): number {
    return conge.id;
  }
}
