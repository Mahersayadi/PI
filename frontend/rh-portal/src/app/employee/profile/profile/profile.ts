import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee, PositionHistory } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { PaieService } from '../../../core/services/paie.service';
import { Salaire } from '../../../core/models/paie.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgForOf, NgIf, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly paieService = inject(PaieService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly employeeId = 1;

  readonly employee = signal<Employee | null>(null);
  readonly positionHistory = signal<PositionHistory[]>([]);
  readonly salaire = signal<Salaire | null>(null);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal(true);

  constructor() {
    this.loadProfile();
    this.loadHistory();
    this.loadSalaire();
  }

  private loadProfile(): void {
    this.employeeService
      .getEmployeeById(this.employeeId)
      .pipe(
        catchError(err => {
          this.error.set('Impossible de charger votre profil.');
          console.error(err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employee => {
        this.employee.set(employee);
        this.isLoading.set(false);
      });
  }

  private loadHistory(): void {
    this.employeeService
      .getPositionHistory(this.employeeId)
      .pipe(
        catchError(err => {
          console.warn('Aucun historique de mobilité', err);
          return of([] as PositionHistory[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(history => this.positionHistory.set(history));
  }

  private loadSalaire(): void {
    this.paieService
      .getSalaireByEmployee(this.employeeId)
      .pipe(
        catchError(err => {
          console.warn('Salaire non renseigné', err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(salaire => this.salaire.set(salaire));
  }

  editProfile(): void {
    console.info('Edit profile');
  }
}
