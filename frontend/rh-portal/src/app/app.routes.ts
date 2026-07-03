import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.routes) },
  { path: 'employee', loadChildren: () => import('./employee/employee.routes').then(m => m.routes) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.routes) },
  { path: 'recruitment', loadChildren: () => import('./recruitment/recruitment.module').then(m => m.RecruitmentModule) },
  { path: 'ai', loadChildren: () => import('./ai/ai.module').then(m => m.AiModule) },
  { path: 'candidate', loadChildren: () => import('./candidate/candidate.routes').then(m => m.routes) },
  { path: '**', redirectTo: 'auth/login' }
];
