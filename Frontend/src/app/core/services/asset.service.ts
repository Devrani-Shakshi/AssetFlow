import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { Asset, CreateAssetRequest, UpdateAssetRequest } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${ApiConstants.ASSETS}`;

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  getById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, request);
  }

  update(request: UpdateAssetRequest): Observable<Asset> {
    return this.http.put<Asset>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
