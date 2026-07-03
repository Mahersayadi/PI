export interface Salaire {
  id?: number;
  employeeId: number;
  salaireBase: number;
  primes: number;
  deductions: number;
  salaireNet: number;
}

export interface FichePaieRequest {
  employeeId: number;
  periodePaie: string;
}

export interface FichePaie {
  id: number;
  employeeId: number;
  periodePaie: string;
  salaireBase: number;
  primes: number;
  deductions: number;
  salaireNet: number;
}
