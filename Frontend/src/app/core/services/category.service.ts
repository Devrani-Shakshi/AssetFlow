import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiConstants } from '../constants/api.constants';
import { AssetCategory, CreateAssetCategoryRequest, UpdateAssetCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/${ApiConstants.CATEGORIES}`;

  getAll(): Observable<AssetCategory[]> {
    return this.http.get<AssetCategory[]>(this.apiUrl);
  }

  getById(id: string): Observable<AssetCategory> {
    return this.http.get<AssetCategory>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateAssetCategoryRequest): Observable<AssetCategory> {
    return this.http.post<AssetCategory>(this.apiUrl, request);
  }

  update(request: UpdateAssetCategoryRequest): Observable<AssetCategory> {
    return this.http.put<AssetCategory>(this.apiUrl, request);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
