-- Inserir médicos de exemplo para testar
INSERT INTO public.profiles (id, email, nome, role, especialidade, crm, ativo) 
VALUES 
  (gen_random_uuid(), 'dr.joao@example.com', 'Dr. João Silva', 'medico', 'Clínico Geral', 'CRM/SP 123456', true),
  (gen_random_uuid(), 'dra.maria@example.com', 'Dra. Maria Santos', 'medico', 'Cardiologia', 'CRM/SP 789123', true),
  (gen_random_uuid(), 'dr.carlos@example.com', 'Dr. Carlos Oliveira', 'medico', 'Pediatria', 'CRM/SP 456789', true)
ON CONFLICT (id) DO NOTHING;