export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  designation: string;
  joiningDate: string;
  managerId?: string | null;
  status: number;
}
