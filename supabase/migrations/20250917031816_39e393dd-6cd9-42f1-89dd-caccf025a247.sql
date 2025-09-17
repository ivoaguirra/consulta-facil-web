-- Inserir dados de exemplo para teste (usuários fictícios)
-- Nota: Estes são apenas para demonstração, em produção os usuários se cadastrarão normalmente

-- Inserir clínicas de exemplo
INSERT INTO public.clinicas (nome, cnpj, email, telefone, endereco) VALUES
('Clínica São Paulo', '12.345.678/0001-90', 'contato@clinicasp.com.br', '(11) 3333-4444', '{"cep": "01310-100", "logradouro": "Av. Paulista", "numero": "1000", "cidade": "São Paulo", "estado": "SP"}'),
('Centro Médico Rio', '98.765.432/0001-10', 'atendimento@centromedico.com.br', '(21) 2222-3333', '{"cep": "22071-900", "logradouro": "Av. Copacabana", "numero": "500", "cidade": "Rio de Janeiro", "estado": "RJ"}');

-- Inserir alguns agendamentos de exemplo para demonstrar a funcionalidade
-- Nota: Estes serão vinculados a usuários reais quando eles se cadastrarem
INSERT INTO public.agendamentos (paciente_id, medico_id, clinica_id, data_agendamento, tipo_consulta, status, observacoes, valor) VALUES
-- Estes UUIDs são fictícios e serão substituídos quando usuários reais se cadastrarem
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', (SELECT id FROM public.clinicas LIMIT 1), NOW() + INTERVAL '1 day', 'Consulta inicial', 'agendado', 'Primeira consulta - avaliar sintomas', 150.00),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', (SELECT id FROM public.clinicas LIMIT 1), NOW() + INTERVAL '2 days', 'Retorno', 'confirmado', 'Retorno para acompanhamento', 100.00);