import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransferAssetRequest } from '../models/transfer.model';
import { Asset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Asset/transfer`; // maps to AssetController.Transfer

  transfer(request: TransferAssetRequest): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, request);
  }
}
