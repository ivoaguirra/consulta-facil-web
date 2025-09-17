-- Inserir dados básicos para demonstração
-- Vamos usar apenas os status válidos que já funcionam na aplicação

INSERT INTO public.agendamentos (
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
  '550e8400-e29b-41d4-a716-446655440011', -- ID de paciente demo 2
  '550e8400-e29b-41d4-a716-446655440021', -- ID de médico demo 2
  '550e8400-e29b-41d4-a716-446655440002', -- Clínica Saúde Total
  'Consulta Dermatológica',
  '2024-01-20 10:30:00',
  45,
  180.00,
  'confirmado',
  'Avaliação de lesões de pele'
);