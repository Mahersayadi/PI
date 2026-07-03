import { NgForOf, NgIf } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notification } from '../../core/models/notification.model';
import { UserProfile } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user: UserProfile = {
    id: 1,
    firstName: 'Aminata',
    lastName: 'Diop',
    email: 'aminata.diop@company.com',
    role: 'ADMIN'
  };

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter(n => n.status !== 'READ').length);

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.notificationService
      .getByEmployee(this.user.id)
      .pipe(
        catchError(err => {
          console.warn('Impossible de charger les notifications', err);
          return of([] as Notification[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(notifications => this.notifications.set(notifications));
  }

  markAllAsRead(): void {
    this.notificationService
      .markAllAsRead(this.user.id)
      .pipe(
        catchError(err => {
          console.warn('Impossible de marquer les notifications comme lues', err);
          return of(void 0);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadNotifications());
  }

  logout(): void {
    console.info('Logout requested');
  }
}
