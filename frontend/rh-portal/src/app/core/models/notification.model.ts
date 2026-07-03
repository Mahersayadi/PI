export interface NotificationRequest {
  employeeId: number;
  type: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface Notification {
  id: number;
  employeeId: number;
  type: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  details?: Record<string, unknown>;
}
