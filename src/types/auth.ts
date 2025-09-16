// Tipos para autenticação e perfis de usuário

export type UserRole = 'clinica' | 'medico' | 'paciente';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  telefone?: string;
  cpf?: string;
  crm?: string; // Para médicos
  especialidade?: string; // Para médicos
  clinicaId?: string; // Para médicos vinculados a clínicas
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  dataNascimento?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clinica {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  responsavel: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}