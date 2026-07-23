export interface AssetDisposal {
  id: string;
  assetId: string;
  assetName?: string; // mapped helper
  assetCode?: string; // mapped helper
  disposalDate: string;
  reason: string;
  disposalMethod: string;
  amountRecovered: number;
  approvedBy: string;
  remarks?: string;
}

export interface CreateDisposalRequest {
  assetId: string;
  disposalDate: string;
  reason: string;
  disposalMethod: string;
  amountRecovered: number;
  approvedBy: string;
  remarks?: string;
}

export interface UpdateDisposalRequest {
  id: string;
  assetId: string;
  disposalDate: string;
  reason: string;
  disposalMethod: string;
  amountRecovered: number;
  approvedBy: string;
  remarks?: string;
}
