import { environment } from '../../environments/environment';

export const AppConfig = {
  roles: {
    ADMIN: 'ADMIN',
    RH_MANAGER: 'RH_MANAGER',
    EMPLOYEE: 'EMPLOYEE',
    CANDIDATE: 'CANDIDATE'
  },
  endpoints: {
    AUTH: `${environment.apiUrl}/auth`,
    EMPLOYEE: `${environment.apiUrl}/employees`,
    CONGE: `${environment.apiUrl}/conges`,
    NOTIFICATION: `${environment.apiUrl}/notifications`,
    PAIE: `${environment.apiUrl}/paie`,
    JOBS: `${environment.apiUrl}/jobs`,
    APPLICATIONS: `${environment.apiUrl}/applications`,
    AI: `${environment.apiUrl}/ai`
  }
};
