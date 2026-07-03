import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';
import {
  Department,
  DepartmentStats,
  Employee,
  EmployeeFilters,
  EmployeeStats,
  PositionHistory
} from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.EMPLOYEE;
  private readonly departmentsUrl = this.baseUrl.replace('/employees', '/departments');

  getEmployees(filters?: EmployeeFilters): Observable<Employee[]> {
    if (filters?.search) {
      const params = new HttpParams().set('name', filters.search);
      return this.http.get<Employee[]>(`${this.baseUrl}/search`, { params });
    }

    if (filters?.departmentId) {
      return this.http.get<Employee[]>(`${this.baseUrl}/department/${filters.departmentId}`);
    }

    return this.http.get<Employee[]>(this.baseUrl);
  }

  getEmployeesPaged(page = 0, size = 10, sortBy = 'lastName'): Observable<{
    content: Employee[];
    totalElements: number;
  }> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    return this.http.get<{ content: Employee[]; totalElements: number }>(`${this.baseUrl}/paged`, {
      params
    });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  createEmployee(payload: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, payload);
  }

  updateEmployee(id: number, payload: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updatePosition(
    id: number,
    updates: { newPosition: string; newDepartmentId?: number }
  ): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/${id}/position`, updates);
  }

  getPositionHistory(id: number): Observable<PositionHistory[]> {
    return this.http.get<PositionHistory[]>(`${this.baseUrl}/${id}/position-history`);
  }

  getEmployeeStats(): Observable<EmployeeStats> {
    return this.http.get<EmployeeStats>(`${this.baseUrl}/stats`);
  }

  getDepartmentStats(departmentId: number): Observable<DepartmentStats> {
    return this.http.get<DepartmentStats>(`${this.baseUrl}/department/${departmentId}/stats`);
  }

  getEmployeeWithSalary(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}/with-salary`);
  }

  checkEmployeeExists(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${id}/exists`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.departmentsUrl);
  }
}
