import { Routes } from '@angular/router';
import { JobBoardComponent } from './jobs/job-board/job-board.component';
import { ApplyComponent } from './jobs/apply/apply.component';
import { MyApplicationsComponent } from './applications/my-applications/my-applications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobBoardComponent },
  { path: 'jobs/:id/apply', component: ApplyComponent },
  { path: 'applications', component: MyApplicationsComponent }
];
