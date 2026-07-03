import { NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Department, Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
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
    MatSnackBarModule
  ],
  templateUrl: './employee-add.html',
  styleUrls: ['./employee-add.scss']
})
export class EmployeeAddComponent {
  private readonly fb = inject(FormBuilder);
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
    baseSalary: [null, [Validators.required, Validators.min(0)]],
    hireDate: [null, Validators.required]
  });

  readonly departments = signal<Department[]>([]);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.employeeService
      .getDepartments()
      .pipe(
        catchError(err => {
          console.error(err);
          this.error.set('Impossible de récupérer les départements.');
          return of([] as Department[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(departments => this.departments.set(departments));
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    const hireDate: Date | string | null = formValue.hireDate ?? null;

    const payload: Employee = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      position: formValue.position,
      departmentId: Number(formValue.departmentId),
      hireDate:
        hireDate instanceof Date
          ? hireDate.toISOString().split('T')[0]
          : (hireDate as string),
      baseSalary: formValue.baseSalary ?? undefined
    };

    this.isSubmitting.set(true);
    this.employeeService
      .createEmployee(payload)
      .pipe(
        catchError(err => {
          this.error.set("Impossible d'enregistrer le collaborateur.");
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
        this.snackBar.open('Collaborateur créé avec succès', 'Fermer', { duration: 4000 });
        this.employeeForm.reset();
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/employees']);
      });
  }
}
