import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private baseUrl = `${environment.apiUrl}/performances`;

  constructor(private http: HttpClient) {}

  getByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  createEvaluation(perf: any): Observable<any> {
    return this.http.post(this.baseUrl, perf);
  }

  updateEvaluation(id: number, perf: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, perf);
  }
}
