import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${ApiConstants.DEPARTMENTS}`;

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDepartmentRequest): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, request);
  }

  update(request: UpdateDepartmentRequest): Observable<Department> {
    return this.http.put<Department>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
