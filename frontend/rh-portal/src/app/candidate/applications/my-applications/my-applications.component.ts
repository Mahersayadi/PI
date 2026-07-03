import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <div class="container">
      <h2>Mes candidatures</h2>
      
      <table mat-table [dataSource]="applications" class="mat-elevation-z8" *ngIf="applications.length > 0">
        <ng-container matColumnDef="jobId">
          <th mat-header-cell *matHeaderCellDef> Offre </th>
          <td mat-cell *matCellDef="let app"> ID: {{app.jobOfferId}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let app">
            <span class="status-badge" [ngClass]="app.status?.toLowerCase()">{{app.status}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let app"> {{app.createdAt | date:'shortDate'}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-card *ngIf="applications.length === 0" class="empty-card">
        <p>Vous n'avez soumis aucune candidature.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    table { width: 100%; margin-top: 15px; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; background-color: #607d8b; }
    .applied { background-color: #2196f3; }
    .in_review { background-color: #ff9800; }
    .interview_scheduled { background-color: #9c27b0; }
    .accepted { background-color: #4caf50; }
    .rejected { background-color: #f44336; }
    .empty-card { padding: 20px; text-align: center; margin-top: 20px; }
  `]
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];
  displayedColumns: string[] = ['jobId', 'status', 'date'];

  constructor(private appService: ApplicationService, private auth: AuthService) {}

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (userId) {
      this.appService.getMyApplications(userId).subscribe({
        next: (data) => this.applications = data,
        error: (err) => console.error(err)
      });
    }
  }
}
