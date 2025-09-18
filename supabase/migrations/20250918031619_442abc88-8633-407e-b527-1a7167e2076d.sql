-- Criar tabela de consultas para registrar o histórico completo
CREATE TABLE public.consultas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agendamento_id uuid REFERENCES public.agendamentos(id),
  paciente_id uuid NOT NULL,
  medico_id uuid NOT NULL,
  clinica_id uuid,
  data_inicio timestamp with time zone NOT NULL DEFAULT now(),
  data_fim timestamp with time zone,
  duracao_minutos integer,
  status text NOT NULL DEFAULT 'agendada',
  tipo_consulta text NOT NULL,
  valor numeric,
  observacoes_medico text,
  observacoes_paciente text,
  problemas_tecnicos text,
  qualidade_chamada integer CHECK (qualidade_chamada >= 1 AND qualidade_chamada <= 5),
  gravacao_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultas
CREATE POLICY "Usuários podem ver suas próprias consultas"
ON public.consultas
FOR SELECT
USING (auth.uid() = paciente_id OR auth.uid() = medico_id);

CREATE POLICY "Usuários podem atualizar suas próprias consultas"
ON public.consultas
FOR UPDATE
USING (auth.uid() = paciente_id OR auth.uid() = medico_id);

CREATE POLICY "Usuários podem criar consultas"
ON public.consultas
FOR INSERT
WITH CHECK (auth.uid() = paciente_id OR auth.uid() = medico_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_consultas_updated_at
BEFORE UPDATE ON public.consultas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_consultas_paciente_id ON public.consultas(paciente_id);
CREATE INDEX idx_consultas_medico_id ON public.consultas(medico_id);
CREATE INDEX idx_consultas_data_inicio ON public.consultas(data_inicio);
CREATE INDEX idx_consultas_status ON public.consultas(status);