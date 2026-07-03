import { Routes } from '@angular/router';
import { employeeGuard } from '../core/guards/employee.guard';
import { MyPerformancesComponent } from './performances/my-performances/my-performances.component';
import {
  EmployeeDashboardComponent,
  MesCongesComponent,
  MesPaieComponent,
  ProfileComponent
} from './index';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: EmployeeDashboardComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'mes-conges', 
    component: MesCongesComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'mes-paie', 
    component: MesPaieComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [employeeGuard]
  },
  { 
    path: 'performances', 
    component: MyPerformancesComponent,
    canActivate: [employeeGuard]
  }
];
