import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private baseUrl = AppConfig.endpoints.APPLICATIONS;

  constructor(private http: HttpClient) {}

  applyForJob(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  getMyApplications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidate/${userId}`);
  }

  getApplicationsByJob(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/job/${jobId}`);
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  changeStatus(id: number, status: string, hrComment?: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, { status, hrComment });
  }

  scheduleInterview(id: number, interviewDate: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/interview`, { interviewDate });
  }
}
