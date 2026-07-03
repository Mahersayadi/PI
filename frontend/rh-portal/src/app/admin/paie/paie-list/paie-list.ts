import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { catchError, combineLatest, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Department, Employee } from '../../../core/models/employee.model';
import { Salaire } from '../../../core/models/paie.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { PaieService } from '../../../core/services/paie.service';

interface SalaireView extends Salaire {
  employeeName: string;
  departmentName?: string;
  departmentId?: number | null;
}

@Component({
  selector: 'app-paie-list',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './paie-list.html',
  styleUrls: ['./paie-list.scss']
})
export class PaieListComponent {
  private readonly paieService = inject(PaieService);
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly departmentControl = new FormControl<'ALL' | number>('ALL', { nonNullable: true });

  readonly salaries = signal<SalaireView[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly filteredSalaries = computed(() => {
    const department = this.departmentControl.value;
    return this.salaries().filter(salaire => department === 'ALL' || salaire.departmentId === department);
  });

  readonly displayedColumns = ['employee', 'department', 'salaireBase', 'primes', 'deductions', 'net', 'actions'] as const;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    combineLatest([
      this.paieService.getAllSalaires().pipe(
        catchError(err => {
          this.error.set('Impossible de récupérer les salaires.');
          console.error(err);
          return of([] as Salaire[]);
        })
      ),
      this.employeeService.getEmployees().pipe(
        catchError(err => {
          console.error(err);
          return of([] as Employee[]);
        })
      ),
      this.employeeService.getDepartments().pipe(
        catchError(err => {
          console.error(err);
          return of([] as Department[]);
        })
      )
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([salaries, employees, departments]) => {
        const employeeMap = new Map<number, Employee>();
        employees.forEach(employee => {
          if (employee.id) {
            employeeMap.set(employee.id, employee);
          }
        });

        const salaireViews = salaries.map(salaire => {
          const employee = employeeMap.get(salaire.employeeId);
          return {
            ...salaire,
            employeeName: employee ? `${employee.firstName} ${employee.lastName}` : `Employé #${salaire.employeeId}`,
            departmentName: employee?.departmentName,
            departmentId: employee?.departmentId ?? null
          } as SalaireView;
        });

        this.salaries.set(salaireViews);
        this.departments.set(departments);
        this.isLoading.set(false);
      });
  }

  refresh(): void {
    this.loadData();
  }

  generateFiche(salaire: SalaireView): void {
    const periode = new Date();
    const isoDate = new Date(periode.getFullYear(), periode.getMonth(), 1).toISOString().split('T')[0];

    this.paieService
      .genererFichePaie({ employeeId: salaire.employeeId, periodePaie: isoDate })
      .pipe(
        catchError(err => {
          this.error.set('Impossible de générer la fiche de paie.');
          console.error(err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.snackBar.open('Fiche de paie générée', 'Fermer', { duration: 4000 });
      });
  }

  trackById(_index: number, salaire: SalaireView): number | undefined {
    return salaire.id;
  }
}
