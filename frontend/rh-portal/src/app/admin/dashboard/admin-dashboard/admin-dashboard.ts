import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { combineLatest, map, of } from 'rxjs';
import { catchError, shareReplay, startWith } from 'rxjs/operators';
import { CongeService } from '../../../core/services/conge.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { PaieService } from '../../../core/services/paie.service';
import { CongeResponse } from '../../../core/models/conge.model';
import { DepartmentStats, EmployeeStats } from '../../../core/models/employee.model';
import { Salaire } from '../../../core/models/paie.model';

interface DashboardCard {
  label: string;
  value: string;
  icon: string;
  tone: 'primary' | 'accent' | 'warn';
  helper?: string;
}

interface DashboardViewModel {
  cards: DashboardCard[];
  pendingLeaves: CongeResponse[];
  latestLeaves: CongeResponse[];
  departments: DepartmentStats[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    NgForOf,
    NgIf,
    TitleCasePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly congeService = inject(CongeService);
  private readonly paieService = inject(PaieService);

  readonly error = signal<string | null>(null);

  private readonly employeeStats$ = this.employeeService.getEmployeeStats().pipe(
    catchError(err => {
      this.error.set("Impossible de récupérer les statistiques employé.");
      console.error(err);
      return of(null as EmployeeStats | null);
    }),
    startWith(null as EmployeeStats | null),
    shareReplay(1)
  );

  private readonly pendingLeavesSource$ = this.congeService.getByStatut('EN_ATTENTE').pipe(
    catchError(err => {
      this.error.set("Impossible de récupérer les congés en attente.");
      console.error(err);
      return of([] as CongeResponse[]);
    }),
    startWith([] as CongeResponse[]),
    shareReplay(1)
  );

  private readonly latestLeavesSource$ = this.congeService.getAll().pipe(
    map(conges =>
      conges
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6)
    ),
    catchError(err => {
      this.error.set("Impossible de charger l'historique des congés.");
      console.error(err);
      return of([] as CongeResponse[]);
    }),
    startWith([] as CongeResponse[]),
    shareReplay(1)
  );

  private readonly salariesSource$ = this.paieService.getAllSalaires().pipe(
    catchError(err => {
      this.error.set('Impossible de récupérer les informations de paie.');
      console.error(err);
      return of([] as Salaire[]);
    }),
    startWith([] as Salaire[]),
    shareReplay(1)
  );

  private readonly cardsSource$ = combineLatest([
    this.employeeStats$,
    this.pendingLeavesSource$,
    this.salariesSource$
  ]).pipe(
    map(([employeeStats, pendingLeaves, salaries]) => {
      const totalEmployees = employeeStats?.totalEmployees ?? 0;
      const departments = employeeStats?.totalDepartments ?? 0;
      const pending = pendingLeaves.length;
      const salariesCount = salaries.length;

      return [
        {
          label: 'Collaborateurs',
          value: totalEmployees.toString(),
          icon: 'groups',
          tone: 'primary',
          helper: departments > 0 ? `${departments} départements` : undefined
        },
        {
          label: 'Congés en attente',
          value: pending.toString(),
          icon: 'event_available',
          tone: 'warn',
          helper: pending > 0 ? 'À traiter rapidement' : 'Aucune demande en attente'
        },
        {
          label: 'Fiches de paie suivies',
          value: salariesCount.toString(),
          icon: 'payments',
          tone: 'accent',
          helper:
            totalEmployees > 0
              ? `${Math.round((salariesCount / Math.max(totalEmployees, 1)) * 100)}% des salariés`
              : 'Synchronisé avec le service paie'
        }
      ] as DashboardCard[];
    }),
    startWith([] as DashboardCard[]),
    shareReplay(1)
  );

  private readonly departmentStatsSource$ = this.employeeStats$.pipe(
    map(stats => {
      if (!stats) {
        return [] as DepartmentStats[];
      }
      return Object.entries(stats.employeesPerDepartment ?? {})
        .map(([name, count]) => ({ departmentId: 0, departmentName: name, employeeCount: count }))
        .sort((a, b) => b.employeeCount - a.employeeCount)
        .slice(0, 5);
    }),
    startWith([] as DepartmentStats[]),
    shareReplay(1)
  );

  readonly viewModel$ = combineLatest({
    cards: this.cardsSource$,
    pendingLeaves: this.pendingLeavesSource$,
    latestLeaves: this.latestLeavesSource$,
    departments: this.departmentStatsSource$
  }).pipe(startWith(null as DashboardViewModel | null));
}
