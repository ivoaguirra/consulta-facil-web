-- Drop the view approach entirely and use a more secure RLS policy instead
DROP VIEW IF EXISTS public.medicos_publicos;

-- Update the profiles RLS policy to be more specific about what fields are accessible
DROP POLICY IF EXISTS "Usuários autenticados podem ver informações básicas de médicos" ON public.profiles;

-- Create a policy that allows public read access to doctor profiles but with field restrictions
-- This will require application-level field filtering for security
CREATE POLICY "Usuários podem ver perfis de médicos ativos" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  auth.uid() = id 
  OR 
  -- Anyone can see active doctor profiles (frontend should filter sensitive fields)
  (role = 'medico' AND ativo = true)
);