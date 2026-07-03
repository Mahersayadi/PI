import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';
import { CongeRequest, CongeResponse, CongeStatut, CongeValidation } from '../models/conge.model';

@Injectable({ providedIn: 'root' })
export class CongeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.CONGE;

  getAll(): Observable<CongeResponse[]> {
    return this.http.get<CongeResponse[]>(this.baseUrl);
  }

  getByEmployee(employeeId: number): Observable<CongeResponse[]> {
    return this.http.get<CongeResponse[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  getByStatut(statut: CongeStatut): Observable<CongeResponse[]> {
    return this.http.get<CongeResponse[]>(`${this.baseUrl}/statut/${statut}`);
  }

  getById(id: number): Observable<CongeResponse> {
    return this.http.get<CongeResponse>(`${this.baseUrl}/${id}`);
  }

  demanderConge(payload: CongeRequest): Observable<CongeResponse> {
    return this.http.post<CongeResponse>(`${this.baseUrl}/demander`, payload);
  }

  validerConge(id: number, payload: CongeValidation): Observable<CongeResponse> {
    return this.http.put<CongeResponse>(`${this.baseUrl}/${id}/valider`, payload);
  }

  supprimerConge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
