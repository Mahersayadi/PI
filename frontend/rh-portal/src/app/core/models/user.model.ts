export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}
