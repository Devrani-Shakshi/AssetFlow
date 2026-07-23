import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssetMaintenance, CreateMaintenanceRequest, UpdateMaintenanceRequest } from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/AssetMaintenance`; // maps to AssetMaintenanceController

  getAll(): Observable<AssetMaintenance[]> {
    return this.http.get<AssetMaintenance[]>(this.apiUrl);
  }

  getById(id: string): Observable<AssetMaintenance> {
    return this.http.get<AssetMaintenance>(`${this.apiUrl}/${id}`);
  }

  getByAssetId(assetId: string): Observable<AssetMaintenance[]> {
    return this.http.get<AssetMaintenance[]>(`${this.apiUrl}/asset/${assetId}`);
  }

  create(request: CreateMaintenanceRequest): Observable<AssetMaintenance> {
    return this.http.post<AssetMaintenance>(this.apiUrl, request);
  }

  update(request: UpdateMaintenanceRequest): Observable<AssetMaintenance> {
    return this.http.put<AssetMaintenance>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
