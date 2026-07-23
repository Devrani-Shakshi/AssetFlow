export interface AssetAllocation {
  id: string;
  assetId: string;
  assetName?: string; // mapped helper
  assetCode?: string; // mapped helper
  employeeId: string;
  employeeName?: string; // mapped helper
  departmentId: string;
  departmentName?: string; // mapped helper
  allocatedBy: string;
  allocatedDate: string;
  remarks?: string;
  status: string;
}

export interface AllocateAssetRequest {
  assetId: string;
  employeeId: string;
  departmentId: string;
  allocatedBy: string;
  remarks?: string;
}
