export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  userId: string;
}

export interface UpdateNotificationRequest {
  id: string;
  title: string;
  message: string;
  type: string;
  userId: string;
  isRead: boolean;
}
