import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${ApiConstants.LOCATIONS}`;

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  getById(id: string): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateLocationRequest): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, request);
  }

  update(request: UpdateLocationRequest): Observable<Location> {
    return this.http.put<Location>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
