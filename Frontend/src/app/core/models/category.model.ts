export interface AssetCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description?: string;
  depreciationRate: number;
  usefulLifeYears: number;
  isActive: boolean;
}

export interface CreateAssetCategoryRequest {
  categoryCode: string;
  categoryName: string;
  description?: string;
  depreciationRate: number;
  usefulLifeYears: number;
}

export interface UpdateAssetCategoryRequest {
  id: string;
  categoryCode: string;
  categoryName: string;
  description?: string;
  depreciationRate: number;
  usefulLifeYears: number;
  isActive: boolean;
}
