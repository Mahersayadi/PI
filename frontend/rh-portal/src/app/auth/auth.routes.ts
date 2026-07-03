import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - Portail RH'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription - Portail RH'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Mot de passe oublié - Portail RH'
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Réinitialisation - Portail RH'
  }
];
