import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssetDisposal, CreateDisposalRequest, UpdateDisposalRequest } from '../models/disposal.model';

@Injectable({
  providedIn: 'root'
})
export class DisposalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/AssetDisposal`; // maps to AssetDisposalController

  getAll(): Observable<AssetDisposal[]> {
    return this.http.get<AssetDisposal[]>(this.apiUrl);
  }

  getById(id: string): Observable<AssetDisposal> {
    return this.http.get<AssetDisposal>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDisposalRequest): Observable<AssetDisposal> {
    return this.http.post<AssetDisposal>(this.apiUrl, request);
  }

  update(request: UpdateDisposalRequest): Observable<AssetDisposal> {
    return this.http.put<AssetDisposal>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
