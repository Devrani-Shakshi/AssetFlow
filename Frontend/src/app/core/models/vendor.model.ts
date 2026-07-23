export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  isActive: boolean;
}

export interface CreateVendorRequest {
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
}

export interface UpdateVendorRequest {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  isActive: boolean;
}
