import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PerformanceService } from '../../../core/services/performance.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-performances',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <div class="container">
      <h2>Mes Évaluations</h2>
      
      <table mat-table [dataSource]="performances" class="mat-elevation-z8" *ngIf="performances.length > 0">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef> Date </th>
          <td mat-cell *matCellDef="let perf"> {{perf.evaluationDate | date}} </td>
        </ng-container>

        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef> Score (/100) </th>
          <td mat-cell *matCellDef="let perf"> {{perf.score}} </td>
        </ng-container>

        <ng-container matColumnDef="comments">
          <th mat-header-cell *matHeaderCellDef> Commentaires </th>
          <td mat-cell *matCellDef="let perf"> {{perf.comments}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-card *ngIf="performances.length === 0" class="empty-card">
        <p>Vous n'avez pas encore d'évaluations de performance.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    table { width: 100%; margin-top: 15px; }
    .empty-card { padding: 20px; text-align: center; margin-top: 20px; }
  `]
})
export class MyPerformancesComponent implements OnInit {
  performances: any[] = [];
  displayedColumns: string[] = ['date', 'score', 'comments'];

  constructor(private perfService: PerformanceService, private auth: AuthService) {}

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (userId) {
      this.perfService.getByEmployee(userId).subscribe({
        next: (data) => this.performances = data,
        error: (err) => console.error(err)
      });
    }
  }
}
