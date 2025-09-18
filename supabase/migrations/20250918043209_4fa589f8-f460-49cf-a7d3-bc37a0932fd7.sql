-- Drop the problematic view and recreate without security definer
DROP VIEW IF EXISTS public.medicos_publicos;

-- Create a regular view (not security definer) for public doctor information
CREATE VIEW public.medicos_publicos AS
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

-- Create RLS policy for the view itself to be publicly accessible
ALTER VIEW public.medicos_publicos SET (security_barrier = false);

-- Grant public access to the view
GRANT SELECT ON public.medicos_publicos TO anon, authenticated;