import { Component, OnInit } from '@angular/core';
import { RecruitmentService, JobOffer } from '../core/services/recruitment.service';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.scss']
})
export class RecruitmentComponent implements OnInit {
  jobs: JobOffer[] = [];
  loading = true;
  error?: string;

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.recruitmentService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load jobs';
        this.loading = false;
      }
    });
  }
}
