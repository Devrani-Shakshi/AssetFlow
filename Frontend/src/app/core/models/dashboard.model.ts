export interface DashboardSummary {
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  maintenanceAssets: number;
  disposedAssets: number;
  totalEmployees: number;
  totalDepartments: number;
  totalVendors: number;
  totalCategories: number;
  totalLocations: number;
}

export interface CategorySummary {
  categoryName: string;
  assetCount: number;
}

export interface DepartmentSummary {
  departmentName: string;
  assetCount: number;
}

export interface MonthlyAllocation {
  month: string;
  count: number;
}

export interface MonthlyPurchase {
  month: string;
  totalCost: number;
  count: number;
}
