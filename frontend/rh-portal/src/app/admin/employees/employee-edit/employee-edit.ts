import { NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Department, Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.scss']
})
export class EmployeeEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly employeeForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
    departmentId: [null, Validators.required],
    baseSalary: [null, [Validators.min(0)]],
    hireDate: [null, Validators.required]
  });

  readonly departments = signal<Department[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);

  private employeeId: number | null = null;

  constructor() {
    this.loadDepartments();
    this.loadEmployee();
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

  private loadEmployee(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const idParam = params.get('id');
          if (!idParam) {
            this.error.set('Identifiant collaborateur manquant.');
            return of(null);
          }
          this.employeeId = Number(idParam);
          return this.employeeService.getEmployeeById(this.employeeId).pipe(
            catchError(err => {
              this.error.set("Impossible de récupérer le collaborateur.");
              console.error(err);
              return of(null);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employee => {
        if (!employee) {
          this.isLoading.set(false);
          return;
        }
        this.populateForm(employee);
        this.isLoading.set(false);
      });
  }

  private populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      departmentId: employee.departmentId,
      baseSalary: employee.baseSalary ?? null,
      hireDate: new Date(employee.hireDate)
    });
  }

  onSubmit(): void {
    if (!this.employeeId || this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    const hireDate: Date | string | null = formValue.hireDate ?? null;

    const payload: Employee = {
      id: this.employeeId,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      position: formValue.position,
      departmentId: Number(formValue.departmentId),
      hireDate:
        hireDate instanceof Date ? hireDate.toISOString().split('T')[0] : (hireDate as string),
      baseSalary: formValue.baseSalary ?? undefined
    };

    this.isSubmitting.set(true);
    this.employeeService
      .updateEmployee(this.employeeId, payload)
      .pipe(
        catchError(err => {
          this.error.set("Impossible de mettre à jour le collaborateur.");
          console.error(err);
          this.isSubmitting.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(employee => {
        if (!employee) {
          return;
        }
        this.snackBar.open('Collaborateur mis à jour', 'Fermer', { duration: 4000 });
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/employees']);
      });
  }
}
