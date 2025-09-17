-- Criar enums para tipos de usuário
CREATE TYPE user_role AS ENUM ('paciente', 'medico', 'clinica');

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  role user_role NOT NULL,
  telefone TEXT,
  cpf TEXT,
  crm TEXT, -- Para médicos
  especialidade TEXT, -- Para médicos
  clinica_id UUID, -- Para médicos vinculados a clínicas
  endereco JSONB,
  data_nascimento DATE,
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Tabela de clínicas
CREATE TABLE public.clinicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  endereco JSONB,
  responsavel_id UUID REFERENCES auth.users(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela clinicas
ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clínicas
CREATE POLICY "Clínicas podem ver seus próprios dados"
  ON public.clinicas
  FOR SELECT
  USING (responsavel_id = auth.uid());

CREATE POLICY "Clínicas podem atualizar seus próprios dados"
  ON public.clinicas
  FOR UPDATE
  USING (responsavel_id = auth.uid());

CREATE POLICY "Clínicas podem inserir seus próprios dados"
  ON public.clinicas
  FOR INSERT
  WITH CHECK (responsavel_id = auth.uid());

-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES auth.users(id),
  medico_id UUID NOT NULL REFERENCES auth.users(id),
  clinica_id UUID REFERENCES public.clinicas(id),
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_minutos INTEGER DEFAULT 30,
  tipo_consulta TEXT NOT NULL,
  status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
  observacoes TEXT,
  valor DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela agendamentos
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para agendamentos
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON public.agendamentos
  FOR SELECT
  USING (auth.uid() = paciente_id OR auth.uid() = medico_id);

CREATE POLICY "Pacientes podem criar agendamentos"
  ON public.agendamentos
  FOR INSERT
  WITH CHECK (auth.uid() = paciente_id);

CREATE POLICY "Médicos e pacientes podem atualizar agendamentos"
  ON public.agendamentos
  FOR UPDATE
  USING (auth.uid() = paciente_id OR auth.uid() = medico_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinicas_updated_at
    BEFORE UPDATE ON public.clinicas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
    BEFORE UPDATE ON public.agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'paciente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();