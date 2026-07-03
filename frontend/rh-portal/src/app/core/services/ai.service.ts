import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';

export interface ChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.AI;

  /** POST /ai/chat */
  chat(message: string, context: string = ''): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/chat`, { message, context });
  }

  /** POST /ai/analyze-cv */
  analyzeCv(cvText: string, jobDescription: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/analyze-cv`, { cvText, jobDescription });
  }

  /** POST /ai/match-score */
  matchScore(cvText: string, jobRequirements: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/match-score`, { cvText, jobRequirements });
  }

  /** POST /ai/generate-job */
  generateJob(title: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-job`, { title });
  }
}
