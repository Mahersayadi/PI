import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, RouterModule],
  template: `
    <div class="container" *ngIf="job">
      <div class="header">
        <button mat-button routerLink="/admin/jobs">Retour aux offres</button>
      </div>

      <mat-card class="job-card">
        <h2>{{ job.title }}</h2>
        <p class="meta"><strong>Type:</strong> {{ job.contractType }} | <strong>Statut:</strong> {{ job.status }} | <strong>Deadline:</strong> {{ job.applicationDeadline | date }}</p>
        <p class="description">{{ job.description }}</p>
        <p><strong>Compétences:</strong> {{ job.requirements }}</p>
      </mat-card>

      <h3>Candidatures reçues ({{ applications.length }})</h3>
      
      <table mat-table [dataSource]="applications" class="mat-elevation-z8" *ngIf="applications.length > 0">
        <ng-container matColumnDef="candidateName">
          <th mat-header-cell *matHeaderCellDef> Candidat </th>
          <td mat-cell *matCellDef="let app"> {{app.candidateId}} </td>
        </ng-container>

        <ng-container matColumnDef="aiScore">
          <th mat-header-cell *matHeaderCellDef> Score IA </th>
          <td mat-cell *matCellDef="let app">
            <span class="score" [class.high]="app.aiScore >= 80" [class.medium]="app.aiScore >= 50 && app.aiScore < 80" [class.low]="app.aiScore < 50">
              {{app.aiScore !== null ? app.aiScore + '%' : 'N/A'}}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Statut </th>
          <td mat-cell *matCellDef="let app"> {{app.status}} </td>
        </ng-container>
        
        <ng-container matColumnDef="cv">
          <th mat-header-cell *matHeaderCellDef> CV </th>
          <td mat-cell *matCellDef="let app">
            <a *ngIf="app.cvFilePath" [href]="app.cvFilePath" target="_blank">Voir CV</a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <p *ngIf="applications.length === 0">Aucune candidature pour le moment.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { margin-bottom: 20px; }
    .job-card { margin-bottom: 30px; padding: 20px; }
    .meta { color: #666; font-size: 0.9em; }
    .description { margin-top: 15px; white-space: pre-wrap; }
    table { width: 100%; margin-top: 15px; }
    .score { padding: 4px 8px; border-radius: 4px; font-weight: bold; color: white; }
    .high { background-color: #4caf50; }
    .medium { background-color: #ff9800; }
    .low { background-color: #f44336; }
  `]
})
export class JobDetailComponent implements OnInit {
  job: any;
  applications: any[] = [];
  displayedColumns: string[] = ['candidateName', 'aiScore', 'status', 'cv'];

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private appService: ApplicationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.jobService.getJobById(id).subscribe({
        next: (job) => {
          this.job = job;
          this.loadApplications(id);
        }
      });
    }
  }

  loadApplications(jobId: number) {
    this.appService.getApplicationsByJob(jobId).subscribe({
      next: (apps) => this.applications = apps
    });
  }
}
