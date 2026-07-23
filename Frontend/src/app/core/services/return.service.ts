import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssetReturn, ProcessReturnRequest } from '../models/return.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/AssetReturn`; // maps to AssetReturnController

  getAll(): Observable<AssetReturn[]> {
    return this.http.get<AssetReturn[]>(this.apiUrl);
  }

  getHistory(assetId: string): Observable<AssetReturn[]> {
    return this.http.get<AssetReturn[]>(`${this.apiUrl}/history/${assetId}`);
  }

  processReturn(request: ProcessReturnRequest): Observable<AssetReturn> {
    return this.http.post<AssetReturn>(`${this.apiUrl}/return`, request);
  }
}
