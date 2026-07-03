import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobCreateComponent } from './jobs/job-create/job-create.component';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';
import { ApplicationListComponent } from './applications/application-list/application-list.component';
import { PerformanceListComponent } from './performances/performance-list/performance-list.component';
import {
  AdminDashboardComponent,
  EmployeeListComponent,
  EmployeeAddComponent,
  EmployeeEditComponent,
  CongeListComponent,
  CongeValidationComponent,
  PaieListComponent,
  PaieEditComponent
} from './index';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees', 
    component: EmployeeListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees/add', 
    component: EmployeeAddComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'employees/edit/:id', 
    component: EmployeeEditComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'conges', 
    component: CongeListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'conges/validation', 
    component: CongeValidationComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'paie', 
    component: PaieListComponent,
    canActivate: [adminGuard]
  },
  { 
    path: 'paie/edit', 
    component: PaieEditComponent,
    canActivate: [adminGuard]
  },
  { path: 'jobs', component: JobListComponent, canActivate: [adminGuard] },
  { path: 'jobs/create', component: JobCreateComponent, canActivate: [adminGuard] },
  { path: 'jobs/:id', component: JobDetailComponent, canActivate: [adminGuard] },
  { path: 'applications', component: ApplicationListComponent, canActivate: [adminGuard] },
  { path: 'performances', component: PerformanceListComponent, canActivate: [adminGuard] }
];
