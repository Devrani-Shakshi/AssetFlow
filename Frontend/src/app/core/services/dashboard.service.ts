import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary, CategorySummary, DepartmentSummary, MonthlyAllocation, MonthlyPurchase } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Dashboard`; // maps to DashboardController

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getCategorySummary(): Observable<CategorySummary[]> {
    return this.http.get<CategorySummary[]>(`${this.apiUrl}/category-summary`);
  }

  getDepartmentSummary(): Observable<DepartmentSummary[]> {
    return this.http.get<DepartmentSummary[]>(`${this.apiUrl}/department-summary`);
  }

  getMonthlyPurchases(): Observable<MonthlyPurchase[]> {
    return this.http.get<MonthlyPurchase[]>(`${this.apiUrl}/monthly-purchases`);
  }

  getMonthlyAllocations(): Observable<MonthlyAllocation[]> {
    return this.http.get<MonthlyAllocation[]>(`${this.apiUrl}/monthly-allocations`);
  }
}
