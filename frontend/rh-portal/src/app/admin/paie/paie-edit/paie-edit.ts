import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { PaieService } from '../../../core/services/paie.service';

@Component({
  selector: 'app-paie-edit',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './paie-edit.html',
  styleUrls: ['./paie-edit.scss']
})
export class PaieEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paieService = inject(PaieService);
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly salaryForm: FormGroup = this.fb.group({
    employeeId: [null, Validators.required],
    salaireBase: [0, [Validators.required, Validators.min(0)]],
    primes: [0, [Validators.min(0)]],
    deductions: [0, [Validators.min(0)]]
  });

  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly netSalaire = computed(() => {
    const value = this.salaryForm.value;
    const base = Number(value.salaireBase ?? 0);
    const primes = Number(value.primes ?? 0);
    const deductions = Number(value.deductions ?? 0);
    return base + primes - deductions;
  });

  constructor() {
    this.loadEmployees();
    this.setupEmployeeWatcher();
  }

  private loadEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe(
        catchError(err => {
          this.error.set('Impossible de récupérer les collaborateurs.');
          console.error(err);
          return of([] as Employee[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employees => {
        this.employees.set(employees);
        this.isLoading.set(false);
      });
  }

  private setupEmployeeWatcher(): void {
    this.salaryForm
      .get('employeeId')
      ?.valueChanges.pipe(
        switchMap(employeeId => {
          if (!employeeId) {
            return of(null);
          }
          return this.paieService.getSalaireByEmployee(Number(employeeId)).pipe(
            catchError(err => {
              console.warn('Salaire introuvable pour employé', employeeId, err);
              return of(null);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(salaire => {
        if (salaire) {
          this.salaryForm.patchValue({
            salaireBase: salaire.salaireBase,
            primes: salaire.primes,
            deductions: salaire.deductions
          });
        } else {
          this.salaryForm.patchValue({ primes: 0, deductions: 0 });
        }
      });
  }

  onSubmit(): void {
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }

    const value = this.salaryForm.value;
    const payload = {
      employeeId: Number(value.employeeId),
      salaireBase: Number(value.salaireBase),
      primes: Number(value.primes ?? 0),
      deductions: Number(value.deductions ?? 0),
      salaireNet: this.netSalaire()
    };

    this.isSubmitting.set(true);
    this.paieService
      .creerOuModifierSalaire(payload)
      .pipe(
        catchError(err => {
          this.error.set('Impossible de sauvegarder la fiche salaire.');
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
        this.snackBar.open('Salaire enregistré', 'Fermer', { duration: 4000 });
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/paie']);
      });
  }
}
