export interface AssetMaintenance {
  id: string;
  assetId: string;
  assetName?: string; // mapped helper
  assetCode?: string; // mapped helper
  vendorId: string;
  vendorName?: string; // mapped helper
  maintenanceDate: string;
  maintenanceType: string;
  description?: string;
  cost: number;
  status: string;
  expectedCompletionDate?: string | null;
  completedDate?: string | null;
  remarks?: string;
}

export interface CreateMaintenanceRequest {
  assetId: string;
  vendorId: string;
  maintenanceDate: string;
  maintenanceType: string;
  description?: string;
  cost: number;
  expectedCompletionDate?: string | null;
  remarks?: string;
}

export interface UpdateMaintenanceRequest {
  id: string;
  assetId: string;
  vendorId: string;
  maintenanceDate: string;
  maintenanceType: string;
  description?: string;
  cost: number;
  status: string;
  expectedCompletionDate?: string | null;
  completedDate?: string | null;
  remarks?: string;
}
