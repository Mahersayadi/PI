import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="container">
      <h2>Toutes les candidatures</h2>
      
      <table mat-table [dataSource]="applications" class="mat-elevation-z8">
        <ng-container matColumnDef="jobId">
          <th mat-header-cell *matHeaderCellDef> Offre </th>
          <td mat-cell *matCellDef="let app"> ID: {{app.jobOfferId}} </td>
        </ng-container>

        <ng-container matColumnDef="candidateId">
          <th mat-header-cell *matHeaderCellDef> Candidat </th>
          <td mat-cell *matCellDef="let app"> ID: {{app.candidateId}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let app">
            <span class="status-badge" [ngClass]="app.status?.toLowerCase()">{{app.status}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef> Score IA </th>
          <td mat-cell *matCellDef="let app"> {{app.aiScore !== null ? app.aiScore + '%' : 'N/A'}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let app">
            <button mat-button [matMenuTriggerFor]="menu">Changer Statut</button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="updateStatus(app.id, 'IN_REVIEW')">En revue</button>
              <button mat-menu-item (click)="updateStatus(app.id, 'INTERVIEW_SCHEDULED')">Entretien</button>
              <button mat-menu-item (click)="updateStatus(app.id, 'ACCEPTED')">Accepter</button>
              <button mat-menu-item (click)="updateStatus(app.id, 'REJECTED')">Refuser</button>
            </mat-menu>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
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
  `]
})
export class ApplicationListComponent implements OnInit {
  applications: any[] = [];
  displayedColumns: string[] = ['jobId', 'candidateId', 'score', 'status', 'actions'];

  constructor(private appService: ApplicationService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.appService.getAllApplications().subscribe({
      next: (data) => this.applications = data,
      error: (err) => console.error(err)
    });
  }

  updateStatus(id: number, status: string) {
    this.appService.changeStatus(id, status).subscribe({
      next: () => this.loadApplications(),
      error: (err) => alert('Erreur mise à jour statut')
    });
  }
}
