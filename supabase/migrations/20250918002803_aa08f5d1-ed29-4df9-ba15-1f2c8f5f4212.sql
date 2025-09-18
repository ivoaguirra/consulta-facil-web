-- Atualizar políticas RLS para permitir que pacientes vejam médicos
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;

-- Política para usuários verem seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Nova política para permitir que todos vejam perfis de médicos (para agendamento)
CREATE POLICY "Perfis de médicos são visíveis publicamente" 
ON public.profiles 
FOR SELECT 
USING (role = 'medico' AND ativo = true);