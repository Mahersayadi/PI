import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Department, Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    DatePipe,
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
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly departmentControl = new FormControl<'ALL' | number>('ALL', { nonNullable: true });

  readonly displayedColumns = ['identity', 'department', 'position', 'email', 'hireDate', 'actions'] as const;

  constructor() {
    this.loadDepartments();
    this.setupEmployeesStream();
  }

  private loadDepartments(): void {
    this.employeeService
      .getDepartments()
      .pipe(
        catchError(err => {
          console.error(err);
          return of([] as Department[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(departments => this.departments.set(departments));
  }

  private setupEmployeesStream(): void {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.departmentControl.valueChanges.pipe(startWith<'ALL' | number>('ALL'))
    ])
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.error.set(null);
        }),
        switchMap(([search, department]) => {
          const filters: { search?: string; departmentId?: number } = {};
          if (search?.trim()) {
            filters.search = search.trim();
          }
          if (department !== 'ALL') {
            filters.departmentId = department;
          }
          return this.employeeService.getEmployees(filters).pipe(
            catchError(err => {
              this.error.set("Impossible de récupérer les collaborateurs.");
              console.error(err);
              return of([] as Employee[]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employees => {
        this.employees.set(employees);
        this.isLoading.set(false);
      });
  }

  onCreate(): void {
    this.router.navigate(['/admin/employees/add']);
  }

  onEdit(employee: Employee): void {
    if (!employee.id) {
      return;
    }
    this.router.navigate(['/admin/employees/edit', employee.id]);
  }

  onDelete(employee: Employee): void {
    if (!employee.id) {
      return;
    }
    this.isLoading.set(true);
    this.employeeService
      .deleteEmployee(employee.id)
      .pipe(
        catchError(err => {
          this.error.set("Impossible de supprimer le collaborateur.");
          console.error(err);
          this.isLoading.set(false);
          return of(null);
        }),
        switchMap(result => {
          if (result === null) {
            return of(null);
          }
          this.snackBar.open(`${employee.firstName} ${employee.lastName} a été supprimé`, 'Fermer', {
            duration: 4000
          });
          return this.employeeService.getEmployees();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employees => {
        if (employees) {
          this.employees.set(employees);
        }
        this.isLoading.set(false);
      });
  }

  trackById(_index: number, employee: Employee): number | undefined {
    return employee.id;
  }
}
