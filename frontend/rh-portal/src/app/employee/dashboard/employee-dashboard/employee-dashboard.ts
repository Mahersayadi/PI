import { DatePipe, DecimalPipe, NgForOf, NgIf, SlicePipe, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CongeResponse } from '../../../core/models/conge.model';
import { FichePaie } from '../../../core/models/paie.model';
import { Employee } from '../../../core/models/employee.model';
import { CongeService } from '../../../core/services/conge.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { PaieService } from '../../../core/services/paie.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    NgForOf,
    NgIf,
    SlicePipe,
    TitleCasePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.scss']
})
export class EmployeeDashboardComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly congeService = inject(CongeService);
  private readonly paieService = inject(PaieService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly employeeId = 1;

  readonly employee = signal<Employee | null>(null);
  readonly conges = signal<CongeResponse[]>([]);
  readonly fichesPaie = signal<FichePaie[]>([]);
  readonly error = signal<string | null>(null);

  readonly pendingConges = computed(() => this.conges().filter(conge => conge.statut === 'EN_ATTENTE'));
  readonly lastFichePaie = computed(() =>
    this.fichesPaie()
      .slice()
      .sort((a, b) => b.periodePaie.localeCompare(a.periodePaie))[0] || null
  );

  constructor() {
    this.loadEmployee();
    this.loadConges();
    this.loadFichesPaie();
  }

  private loadEmployee(): void {
    this.employeeService
      .getEmployeeWithSalary(this.employeeId)
      .pipe(
        catchError(err => {
          this.error.set("Impossible de récupérer le profil collaborateur.");
          console.error(err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employee => this.employee.set(employee));
  }

  private loadConges(): void {
    this.congeService
      .getByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          console.error(err);
          return of([] as CongeResponse[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conges => this.conges.set(conges));
  }

  private loadFichesPaie(): void {
    this.paieService
      .getFichesPaieByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          console.error(err);
          return of([] as FichePaie[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(fiches => this.fichesPaie.set(fiches));
  }
}
