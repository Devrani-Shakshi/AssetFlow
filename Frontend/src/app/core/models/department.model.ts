export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  managerId?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description: string;
  managerId?: string | null;
}

export interface UpdateDepartmentRequest {
  id: string;
  code: string;
  name: string;
  description: string;
  managerId?: string | null;
  isActive: boolean;
}
