// Tipos para funcionalidades médicas

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  clinicaId: string;
  dataHora: string;
  status: 'agendada' | 'confirmada' | 'em_andamento' | 'concluida' | 'cancelada';
  tipo: 'primeira_consulta' | 'retorno' | 'urgencia';
  valor: number;
  pagamentoStatus: 'pendente' | 'pago' | 'cancelado';
  linkVideoconferencia?: string;
  observacoes?: string;
  prescricoes?: string[];
  prontuarioId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prontuario {
  id: string;
  pacienteId: string;
  medicoId: string;
  clinicaId: string;
  consultaId: string;
  anamnese: string;
  exameGeral: string;
  hipoteseDiagnostica: string;
  condutaAdotada: string;
  prescricoes: string[];
  observacoes: string;
  anexos?: {
    nome: string;
    url: string;
    tipo: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Agendamento {
  id: string;
  pacienteId: string;
  medicoId: string;
  clinicaId: string;
  dataHoraSolicitada: string;
  motivoConsulta: string;
  tipoConsulta: 'primeira_consulta' | 'retorno' | 'urgencia';
  status: 'pendente' | 'aprovada' | 'rejeitada';
  observacoesPaciente?: string;
  observacoesMedico?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  convenio?: {
    nome: string;
    numero: string;
  };
  historicoMedico?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Especialidade {
  id: string;
  nome: string;
  descricao: string;
  valorConsulta: number;
}