export interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  description?: string;
  serialNumber?: string;
  barcode?: string;
  qrCode?: string;
  categoryId: string;
  categoryName?: string; // mapped helper
  vendorId: string;
  vendorName?: string; // mapped helper
  departmentId: string;
  departmentName?: string; // mapped helper
  locationId: string;
  locationName?: string; // mapped helper
  assignedEmployeeId?: string | null;
  assignedEmployeeName?: string; // mapped helper
  purchaseDate: string;
  purchaseCost: number;
  warrantyStart?: string | null;
  warrantyEnd?: string | null;
  depreciationRate: number;
  currentValue: number;
  condition: string;
  status: string;
  notes?: string;
  imageUrls: string[];
  invoiceDocument?: string;
}

export interface CreateAssetRequest {
  assetCode: string;
  assetName: string;
  description?: string;
  serialNumber?: string;
  barcode?: string;
  qrCode?: string;
  categoryId: string;
  vendorId: string;
  departmentId: string;
  locationId: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyStart?: string | null;
  warrantyEnd?: string | null;
  depreciationRate: number;
  condition: string;
  notes?: string;
  imageUrls: string[];
  invoiceDocument?: string;
}

export interface UpdateAssetRequest {
  id: string;
  assetCode: string;
  assetName: string;
  description?: string;
  serialNumber?: string;
  barcode?: string;
  qrCode?: string;
  categoryId: string;
  vendorId: string;
  departmentId: string;
  locationId: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyStart?: string | null;
  warrantyEnd?: string | null;
  depreciationRate: number;
  currentValue: number;
  condition: string;
  status: string;
  notes?: string;
  imageUrls: string[];
  invoiceDocument?: string;
}
