import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asset } from '../models/asset.model';
import { Vendor } from '../models/vendor.model';
import { Employee } from '../models/employee.model';
import { Department } from '../models/department.model';
import { AssetMaintenance } from '../models/maintenance.model';
import { AssetDisposal } from '../models/disposal.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Reports`; // maps to ReportsController

  getAssetsReport(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/assets-report`);
  }

  getVendorsReport(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors-report`);
  }

  getEmployeesReport(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees-report`);
  }

  getDepartmentsReport(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments-report`);
  }

  getMaintenanceReport(): Observable<AssetMaintenance[]> {
    return this.http.get<AssetMaintenance[]>(`${this.apiUrl}/maintenance-report`);
  }

  getDisposalReport(): Observable<AssetDisposal[]> {
    return this.http.get<AssetDisposal[]>(`${this.apiUrl}/disposal-report`);
  }

  getWarrantyExpiryReport(): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.apiUrl}/warranty-expiry`);
  }
}
