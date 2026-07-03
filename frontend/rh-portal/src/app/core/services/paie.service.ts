import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';
import { FichePaie, FichePaieRequest, Salaire } from '../models/paie.model';

@Injectable({ providedIn: 'root' })
export class PaieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.PAIE;

  getAllSalaires(): Observable<Salaire[]> {
    return this.http.get<Salaire[]>(`${this.baseUrl}/salaires`);
  }

  getSalaireByEmployee(employeeId: number): Observable<Salaire> {
    return this.http.get<Salaire>(`${this.baseUrl}/salaires/employee/${employeeId}`);
  }

  creerOuModifierSalaire(payload: Salaire): Observable<Salaire> {
    return this.http.post<Salaire>(`${this.baseUrl}/salaires`, payload);
  }

  genererFichePaie(payload: FichePaieRequest): Observable<FichePaie> {
    return this.http.post<FichePaie>(`${this.baseUrl}/fiches-paie/generer`, payload);
  }

  getFichesPaieByEmployee(employeeId: number): Observable<FichePaie[]> {
    return this.http.get<FichePaie[]>(`${this.baseUrl}/fiches-paie/employee/${employeeId}`);
  }

  checkSalaireExists(employeeId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/salaires/employee/${employeeId}/exists`);
  }
}
