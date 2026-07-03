import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Offres d'emploi disponibles</h2>
      
      <div class="job-grid">
        <mat-card *ngFor="let job of jobs" class="job-card">
          <mat-card-header>
            <mat-card-title>{{ job.title }}</mat-card-title>
            <mat-card-subtitle>{{ job.contractType }} | Expire le {{ job.applicationDeadline | date }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="description">{{ job.description }}</p>
            <p><strong>Compétences :</strong> {{ job.requirements }}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/candidate/jobs', job.id, 'apply']">Postuler</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <p *ngIf="jobs.length === 0">Aucune offre d'emploi disponible pour le moment.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .job-card { display: flex; flex-direction: column; }
    .description { margin-top: 10px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    mat-card-actions { margin-top: auto; padding: 16px; }
  `]
})
export class JobBoardComponent implements OnInit {
  jobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.jobService.getAllJobs().subscribe({
      // We only show OPEN jobs to candidates
      next: (data) => this.jobs = data.filter(j => j.status === 'OPEN'),
      error: (err) => console.error(err)
    });
  }
}
