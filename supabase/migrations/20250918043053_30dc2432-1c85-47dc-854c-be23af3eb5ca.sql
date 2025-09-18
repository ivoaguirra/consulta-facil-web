-- Create a secure view for public doctor information
CREATE OR REPLACE VIEW public.medicos_publicos AS
SELECT 
  id,
  nome,
  especialidade,
  crm,
  avatar_url,
  ativo,
  clinica_id
FROM public.profiles 
WHERE role = 'medico' AND ativo = true;

-- Update RLS policy to restrict full profile access
DROP POLICY IF EXISTS "Perfis de médicos são visíveis publicamente" ON public.profiles;

-- Create more restrictive policy - only allow users to see their own profiles, plus authenticated users can see basic doctor info
CREATE POLICY "Usuários autenticados podem ver informações básicas de médicos" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  auth.uid() = id 
  OR 
  -- Authenticated users can see limited doctor info (handled via view)
  (role = 'medico' AND ativo = true AND auth.role() = 'authenticated')
);

-- Enable RLS on the view
ALTER VIEW public.medicos_publicos SET (security_barrier = true);

-- Grant access to the public view
GRANT SELECT ON public.medicos_publicos TO anon, authenticated;