export interface AssetReturn {
  id: string;
  assetId: string;
  assetName?: string; // mapped helper
  assetCode?: string; // mapped helper
  employeeId: string;
  employeeName?: string; // mapped helper
  returnDate: string;
  condition: string;
  remarks?: string;
  receivedBy: string;
}

export interface ProcessReturnRequest {
  assetId: string;
  employeeId: string;
  condition: string;
  remarks?: string;
  receivedBy: string;
}
