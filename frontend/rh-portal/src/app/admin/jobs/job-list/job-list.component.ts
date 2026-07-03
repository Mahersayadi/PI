import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Gestion des offres d'emploi</h2>
        <button mat-raised-button color="primary" routerLink="/admin/jobs/create">
          <mat-icon>add</mat-icon> Nouvelle Offre
        </button>
      </div>

      <table mat-table [dataSource]="jobs" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef> Titre </th>
          <td mat-cell *matCellDef="let job"> {{job.title}} </td>
        </ng-container>

        <ng-container matColumnDef="contractType">
          <th mat-header-cell *matHeaderCellDef> Contrat </th>
          <td mat-cell *matCellDef="let job"> {{job.contractType}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let job">
            <span class="status-badge" [ngClass]="job.status?.toLowerCase()">{{job.status}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let job">
            <button mat-icon-button color="primary" [routerLink]="['/admin/jobs', job.id]" title="Détails">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="closeJob(job.id)" *ngIf="job.status === 'OPEN'" title="Fermer">
              <mat-icon>block</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
    .open { background-color: #4caf50; }
    .closed { background-color: #f44336; }
  `]
})
export class JobListComponent implements OnInit {
  jobs: any[] = [];
  displayedColumns: string[] = ['title', 'contractType', 'status', 'actions'];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getAllJobs().subscribe({
      next: (data) => this.jobs = data,
      error: (err) => console.error('Erreur chargement jobs', err)
    });
  }

  closeJob(id: number) {
    if (confirm('Voulez-vous vraiment fermer cette offre ?')) {
      this.jobService.changeStatus(id, 'CLOSED').subscribe({
        next: () => this.loadJobs(),
        error: (err) => console.error('Erreur fermeture', err)
      });
    }
  }
}
