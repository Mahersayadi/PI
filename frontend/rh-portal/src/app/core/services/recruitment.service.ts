import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';

export interface JobOffer {
  id?: number;
  title: string;
  description: string;
  location?: string;
  contractType?: string;
  requiredSkills?: string;
  experienceYears?: number;
  salaryRange?: string;
  status?: string;
  departmentId?: number;
  deadline?: string;
}

@Injectable({ providedIn: 'root' })
export class RecruitmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.JOBS;

  /** GET /jobs */
  getJobs(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.baseUrl);
  }

  /** POST /jobs */
  createJob(job: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.baseUrl, job);
  }

  /** PUT /jobs/{id} */
  updateJob(id: number, job: JobOffer): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.baseUrl}/${id}`, job);
  }

  /** DELETE /jobs/{id} */
  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** PATCH /jobs/{id}/status */
  changeStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, { status });
  }
}
