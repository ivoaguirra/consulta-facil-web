import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PatientTable } from '@/components/pacientes/PatientTable';
import { PatientForm } from '@/components/pacientes/PatientForm';
import { Paciente } from '@/types/medical';
import { useToast } from '@/hooks/use-toast';

// Dados de exemplo
const samplePatients: Paciente[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-1234',
    dataNascimento: '1985-03-15',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    convenio: {
      nome: 'Unimed',
      numero: '123456789'
    },
    historicoMedico: 'Hipertensão controlada',
    observacoes: 'Paciente colaborativa',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nome: 'João Pedro Oliveira',
    cpf: '987.654.321-00',
    email: 'joao.pedro@email.com',
    telefone: '(11) 88888-5678',
    dataNascimento: '1992-07-22',
    endereco: {
      rua: 'Avenida Paulista',
      numero: '1578',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-200'
    },
    historicoMedico: 'Sem histórico relevante',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    nome: 'Ana Carolina Ferreira',
    cpf: '456.789.123-45',
    email: 'ana.ferreira@email.com',
    telefone: '(11) 77777-9012',
    dataNascimento: '1978-11-08',
    endereco: {
      rua: 'Rua Augusta',
      numero: '890',
      complemento: 'Sala 12',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01305-100'
    },
    convenio: {
      nome: 'Bradesco Saúde',
      numero: '987654321'
    },
    historicoMedico: 'Diabetes tipo 2, alergia à penicilina',
    observacoes: 'Paciente com acompanhamento nutricional',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  }
];

export default function Pacientes() {
  const [patients, setPatients] = useState<Paciente[]>(samplePatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telefone.includes(searchTerm)
  );

  const handleNewPatient = () => {
    setFormMode('create');
    setEditingPatient(undefined);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient: Paciente) => {
    setFormMode('edit');
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleViewPatient = (patient: Paciente) => {
    toast({
      title: "Visualizar Paciente",
      description: `Funcionalidade em desenvolvimento para: ${patient.nome}`,
    });
  };

  const handleDeletePatient = (patient: Paciente) => {
    if (confirm(`Tem certeza que deseja excluir o paciente ${patient.nome}?`)) {
      setPatients(prev => prev.filter(p => p.id !== patient.id));
      toast({
        title: "Paciente excluído",
        description: `${patient.nome} foi removido com sucesso.`,
      });
    }
  };

  const handleSavePatient = (patientData: Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (formMode === 'create') {
      const newPatient: Paciente = {
        ...patientData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => [...prev, newPatient]);
      toast({
        title: "Paciente cadastrado",
        description: `${newPatient.nome} foi cadastrado com sucesso.`,
      });
    } else if (editingPatient) {
      const updatedPatient: Paciente = {
        ...patientData,
        id: editingPatient.id,
        createdAt: editingPatient.createdAt,
        updatedAt: new Date().toISOString()
      };
      setPatients(prev => prev.map(p => p.id === editingPatient.id ? updatedPatient : p));
      toast({
        title: "Paciente atualizado",
        description: `${updatedPatient.nome} foi atualizado com sucesso.`,
      });
    }
  };

  const handleSearch = () => {
    toast({
      title: "Busca realizada",
      description: `Encontrados ${filteredPatients.length} paciente(s).`,
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filtros",
      description: "Funcionalidade de filtros em desenvolvimento.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <Button onClick={handleNewPatient}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar por nome, CPF, email ou telefone..." 
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleFilter}>
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <PatientTable
              patients={filteredPatients}
              onView={handleViewPatient}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          </CardContent>
        </Card>

        <PatientForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSavePatient}
          patient={editingPatient}
          mode={formMode}
        />
      </div>
    </Layout>
  );
}