export enum EmployeeStatus {
  Active = 1,
  Inactive = 2,
  OnLeave = 3,
  Resigned = 4
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  departmentName?: string; // Add departmentName helper if loaded
  designation: string;
  joiningDate: string;
  managerId?: string | null;
  managerName?: string; // Add managerName helper if loaded
  status: EmployeeStatus;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  managerId?: string | null;
}

export interface UpdateEmployeeRequest {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  managerId?: string | null;
  status: EmployeeStatus;
}
