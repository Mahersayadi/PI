import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../utils/app.config';
import { Notification, NotificationRequest } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = AppConfig.endpoints.NOTIFICATION;

  create(payload: NotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl, payload);
  }

  getByEmployee(employeeId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(employeeId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/employee/${employeeId}/read-all`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
