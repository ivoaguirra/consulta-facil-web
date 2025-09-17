-- Verificar e corrigir constraints de status
-- Primeiro, vamos ver quais valores são permitidos para o status
SELECT table_name, constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%status%';

-- Corrigir dados de exemplo com status válidos
DROP FUNCTION IF EXISTS create_demo_profiles();

CREATE OR REPLACE FUNCTION create_demo_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir dados de agendamentos de exemplo com status válidos
  INSERT INTO public.agendamentos (
    id,
    paciente_id, 
    medico_id, 
    clinica_id, 
    tipo_consulta, 
    data_agendamento, 
    duracao_minutos, 
    valor, 
    status, 
    observacoes
  ) VALUES 
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440010', -- ID de paciente demo
    '550e8400-e29b-41d4-a716-446655440020', -- ID de médico demo
    '550e8400-e29b-41d4-a716-446655440001', -- Clínica São Paulo
    'Consulta Cardiológica',
    '2024-01-15 14:00:00',
    60,
    250.00,
    'agendado',
    'Primeira consulta - paciente com histórico familiar de problemas cardíacos'
  ),
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440011', -- ID de paciente demo 2
    '550e8400-e29b-41d4-a716-446655440021', -- ID de médico demo 2
    '550e8400-e29b-41d4-a716-446655440002', -- Clínica Saúde Total
    'Consulta Dermatológica',
    '2024-01-20 10:30:00',
    45,
    180.00,
    'confirmado',
    'Avaliação de lesões de pele'
  ),
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440010', -- Mesmo paciente, outro médico
    '550e8400-e29b-41d4-a716-446655440022', -- ID de médico demo 3
    '550e8400-e29b-41d4-a716-446655440001', -- Clínica São Paulo
    'Consulta Clínico Geral',
    '2024-01-25 16:00:00',
    30,
    150.00,
    'concluido',
    'Consulta de rotina - exames normais'
  );
  
END;
$$;

-- Executar a função para criar os dados demo
SELECT create_demo_profiles();