-- FASE 1: Criar tabela user_roles e sistema de roles separado
-- 1.1 Criar enum app_role
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'clinica', 'medico', 'paciente');
    END IF;
END $$;

-- 1.2 Criar tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 1.3 Habilitar RLS em user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 1.4 Políticas RLS para user_roles
CREATE POLICY "Usuários podem ver seus próprios roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 1.5 Criar função has_role (security definer) para evitar recursão em RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 1.6 Criar função para obter role primário do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'clinica' THEN 2
      WHEN 'medico' THEN 3
      WHEN 'paciente' THEN 4
    END
  LIMIT 1
$$;

-- 1.7 Migrar dados existentes de profiles.role para user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- FASE 2: Corrigir políticas RLS de profiles
-- 2.1 Remover política problemática que expõe todos os médicos publicamente
DROP POLICY IF EXISTS "Usuários podem ver perfis de médicos ativos" ON public.profiles;

-- 2.2 Criar política: Usuários podem ver médicos de suas consultas/agendamentos
CREATE POLICY "Usuários podem ver médicos de suas consultas"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Ver médicos com quem tem consulta
  EXISTS (
    SELECT 1 FROM public.consultas
    WHERE (consultas.medico_id = profiles.id AND consultas.paciente_id = auth.uid())
       OR (consultas.paciente_id = profiles.id AND consultas.medico_id = auth.uid())
  )
  OR
  -- Ver médicos com quem tem agendamento
  EXISTS (
    SELECT 1 FROM public.agendamentos
    WHERE (agendamentos.medico_id = profiles.id AND agendamentos.paciente_id = auth.uid())
       OR (agendamentos.paciente_id = profiles.id AND agendamentos.medico_id = auth.uid())
  )
);

-- 2.3 Criar política: Médicos podem ver outros médicos ativos
CREATE POLICY "Médicos podem ver outros médicos"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'medico') 
  AND public.has_role(profiles.id, 'medico')
  AND profiles.ativo = true
);

-- FASE 3: Adicionar políticas DELETE
-- 3.1 Bloquear DELETE em consultas
CREATE POLICY "Bloquear DELETE em consultas"
ON public.consultas
FOR DELETE
TO authenticated
USING (false);

-- 3.2 Bloquear DELETE em profiles
CREATE POLICY "Bloquear DELETE em profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (false);

-- 3.3 Permitir DELETE apenas em agendamentos futuros
CREATE POLICY "Usuários podem deletar agendamentos futuros"
ON public.agendamentos
FOR DELETE
TO authenticated
USING (
  (auth.uid() = paciente_id OR auth.uid() = medico_id)
  AND data_agendamento > NOW()
);

-- FASE 4: Atualizar trigger para inserir em user_roles automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Determinar role do usuário
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'paciente'::app_role);
  
  -- Inserir no profiles (mantendo coluna role para compatibilidade)
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    user_role::text::user_role
  );
  
  -- Inserir em user_roles (nova tabela de roles)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;