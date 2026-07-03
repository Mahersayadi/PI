export type CongeStatut = 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';

export interface CongeRequest {
  employeeId: number;
  typeConge: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
}

export interface CongeValidation {
  statut: CongeStatut;
  commentaireResponsable?: string;
}

export interface CongeResponse {
  id: number;
  employeeId: number;
  employeeNom: string;
  typeConge: string;
  dateDebut: string;
  dateFin: string;
  motif: string;
  statut: CongeStatut;
  commentaireResponsable?: string;
  nombreJours: number;
  createdAt: string;
  updatedAt: string;
}
