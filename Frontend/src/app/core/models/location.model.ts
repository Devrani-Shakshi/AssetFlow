export interface Location {
  id: string;
  locationCode: string;
  locationName: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
  isActive: boolean;
}

export interface CreateLocationRequest {
  locationCode: string;
  locationName: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
}

export interface UpdateLocationRequest {
  id: string;
  locationCode: string;
  locationName: string;
  building?: string;
  floor?: string;
  room?: string;
  description?: string;
  isActive: boolean;
}
