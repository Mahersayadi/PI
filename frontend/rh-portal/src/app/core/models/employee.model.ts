export interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount: number;
}

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: number;
  departmentName?: string;
  hireDate: string;
  baseSalary?: number;
  hasSalaryRecord?: boolean;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: number;
}

export interface PositionHistory {
  id: number;
  employeeId: number;
  employeeName: string;
  previousPosition: string;
  newPosition: string;
  previousDepartmentName: string;
  newDepartmentName: string;
  changeDate: string;
  reason?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  totalDepartments: number;
  employeesPerDepartment: Record<string, number>;
}

export interface DepartmentStats {
  departmentId: number;
  departmentName: string;
  employeeCount: number;
}
