import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PerformanceService } from '../../../core/services/performance.service';

@Component({
  selector: 'app-performance-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <div class="container">
      <h2>Évaluations des performances</h2>
      <p class="placeholder-text">Module d'évaluations en cours de développement.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .placeholder-text { font-style: italic; color: #666; }
  `]
})
export class PerformanceListComponent implements OnInit {
  // Placeholder pour Task 7.5
  ngOnInit() {}
}
