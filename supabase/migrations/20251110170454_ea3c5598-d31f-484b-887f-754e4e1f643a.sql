-- Inserir consulta de teste para o usuário ivo.aguirra@gmail.com
INSERT INTO consultas (
  paciente_id, 
  medico_id, 
  data_inicio, 
  status, 
  tipo_consulta, 
  duracao_minutos, 
  valor
) VALUES (
  '0946f492-75e1-47d1-8d46-5ee44cc4d311',  -- ID do usuário ivo.aguirra@gmail.com (será paciente)
  '0946f492-75e1-47d1-8d46-5ee44cc4d311',  -- Mesmo ID (teste simples - usuário será médico e paciente)
  NOW() + INTERVAL '5 minutes',            -- Consulta daqui a 5 minutos
  'agendada',
  'primeira_consulta',
  30,
  150.00
) ON CONFLICT DO NOTHING;