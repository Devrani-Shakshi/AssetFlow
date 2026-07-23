import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { Vendor, CreateVendorRequest, UpdateVendorRequest } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${ApiConstants.VENDORS}`;

  getAll(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl);
  }

  getById(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateVendorRequest): Observable<Vendor> {
    return this.http.post<Vendor>(this.apiUrl, request);
  }

  update(request: UpdateVendorRequest): Observable<Vendor> {
    return this.http.put<Vendor>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
