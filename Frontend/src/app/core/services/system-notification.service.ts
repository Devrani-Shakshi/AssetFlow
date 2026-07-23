import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemNotification, CreateNotificationRequest, UpdateNotificationRequest } from '../models/system-notification.model';

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Notification`; // maps to NotificationController

  getAll(): Observable<SystemNotification[]> {
    return this.http.get<SystemNotification[]>(this.apiUrl);
  }

  getById(id: string): Observable<SystemNotification> {
    return this.http.get<SystemNotification>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<SystemNotification[]> {
    return this.http.get<SystemNotification[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUnreadByUserId(userId: string): Observable<SystemNotification[]> {
    return this.http.get<SystemNotification[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  create(request: CreateNotificationRequest): Observable<SystemNotification> {
    return this.http.post<SystemNotification>(this.apiUrl, request);
  }

  update(request: UpdateNotificationRequest): Observable<SystemNotification> {
    return this.http.put<SystemNotification>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {});
  }
}
