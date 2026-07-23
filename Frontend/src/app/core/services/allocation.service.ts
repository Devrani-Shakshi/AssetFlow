import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssetAllocation, AllocateAssetRequest } from '../models/allocation.model';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Allocation`; // maps to AllocationController

  getAll(): Observable<AssetAllocation[]> {
    return this.http.get<AssetAllocation[]>(this.apiUrl);
  }

  getHistory(assetId: string): Observable<AssetAllocation[]> {
    return this.http.get<AssetAllocation[]>(`${this.apiUrl}/history/${assetId}`);
  }

  getCurrent(assetId: string): Observable<AssetAllocation> {
    return this.http.get<AssetAllocation>(`${this.apiUrl}/current/${assetId}`);
  }

  allocate(request: AllocateAssetRequest): Observable<AssetAllocation> {
    return this.http.post<AssetAllocation>(`${this.apiUrl}/allocate`, request);
  }
}
