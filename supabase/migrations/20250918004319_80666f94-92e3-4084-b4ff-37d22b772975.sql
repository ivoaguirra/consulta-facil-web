-- Atualizar os médicos existentes com nomes únicos e especialidades
UPDATE public.profiles 
SET nome = 'Dr. João Silva', especialidade = 'Clínico Geral'
WHERE id = 'cf431a25-a0e7-4bd0-8107-bbed38c19a51';

UPDATE public.profiles 
SET nome = 'Dra. Maria Santos', especialidade = 'Cardiologia'  
WHERE id = '54bcb8e1-e1a5-454c-ae45-54cdb803c414';