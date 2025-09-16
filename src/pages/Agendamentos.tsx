import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Check,
  X,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interfaces para agendamentos
interface AgendamentoItem {
  id: string;
  pacienteNome: string;
  medicoNome: string;
  especialidade: string;
  dataHora: string;
  motivo: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  tipo: 'primeira_consulta' | 'retorno' | 'urgencia';
}

// Mock data para agendamentos
const mockAgendamentos: AgendamentoItem[] = [
  {
    id: '1',
    pacienteNome: 'Maria Santos',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataHora: '2024-03-15T14:30:00',
    motivo: 'Dor no peito e falta de ar',
    status: 'pendente',
    tipo: 'primeira_consulta',
  },
  {
    id: '2',
    pacienteNome: 'Pedro Costa',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataHora: '2024-03-16T10:00:00',
    motivo: 'Retorno para avaliação de exames',
    status: 'aprovada',
    tipo: 'retorno',
  },
];

const mockMedicos = [
  { id: '1', nome: 'Dr. João Silva', especialidade: 'Cardiologia' },
  { id: '2', nome: 'Dra. Maria Santos', especialidade: 'Pediatria' },
  { id: '3', nome: 'Dr. Pedro Costa', especialidade: 'Dermatologia' },
  { id: '4', nome: 'Dra. Ana Oliveira', especialidade: 'Ginecologia' },
  { id: '5', nome: 'Dr. Carlos Mendes', especialidade: 'Ortopedia' },
  { id: '6', nome: 'Dra. Paula Lima', especialidade: 'Neurologia' },
  { id: '7', nome: 'Dr. Ricardo Santos', especialidade: 'Oftalmologia' },
  { id: '8', nome: 'Dra. Fernanda Costa', especialidade: 'Endocrinologia' },
];

export const Agendamentos: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>(mockAgendamentos);
  
  const [formData, setFormData] = useState({
    medicoId: '',
    dataHora: '',
    motivo: '',
    tipo: 'primeira_consulta' as const,
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const medico = mockMedicos.find(m => m.id === formData.medicoId);
    if (!medico) return;

    const novoAgendamento = {
      id: Date.now().toString(),
      pacienteNome: user.nome,
      medicoNome: medico.nome,
      especialidade: medico.especialidade,
      dataHora: formData.dataHora,
      motivo: formData.motivo,
      status: 'pendente' as const,
      tipo: formData.tipo,
    };

    setAgendamentos(prev => [...prev, novoAgendamento]);
    setShowForm(false);
    setFormData({
      medicoId: '',
      dataHora: '',
      motivo: '',
      tipo: 'primeira_consulta',
    });

    toast({
      title: 'Agendamento solicitado!',
      description: 'Aguarde a confirmação do médico.',
    });
  };

  const handleAprovar = (id: string) => {
    setAgendamentos(prev => 
      prev.map(ag => 
        ag.id === id ? { ...ag, status: 'aprovada' as const } : ag
      )
    );
    toast({
      title: 'Agendamento aprovado!',
      description: 'O paciente foi notificado.',
    });
  };

  const handleRejeitar = (id: string) => {
    setAgendamentos(prev => 
      prev.map(ag => 
        ag.id === id ? { ...ag, status: 'rejeitada' as const } : ag
      )
    );
    toast({
      title: 'Agendamento rejeitado',
      description: 'O paciente foi notificado.',
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-warning">Pendente</Badge>;
      case 'aprovada':
        return <Badge variant="outline" className="text-success">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            {user.role === 'paciente' && 'Solicite consultas e acompanhe o status'}
            {user.role === 'medico' && 'Gerencie solicitações de consultas'}
            {user.role === 'clinica' && 'Visualize todos os agendamentos'}
          </p>
        </div>
        
        {user.role === 'paciente' && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        )}
      </div>

      {/* Formulário de novo agendamento */}
      {showForm && user.role === 'paciente' && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Agendamento</CardTitle>
            <CardDescription>
              Preencha os dados para solicitar uma consulta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medico">Médico</Label>
                  <Select 
                    value={formData.medicoId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, medicoId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMedicos.map(medico => (
                        <SelectItem key={medico.id} value={medico.id}>
                          {medico.nome} - {medico.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Consulta</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primeira_consulta">Primeira Consulta</SelectItem>
                      <SelectItem value="retorno">Retorno</SelectItem>
                      <SelectItem value="urgencia">Urgência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataHora">Data e Hora</Label>
                <Input
                  id="dataHora"
                  type="datetime-local"
                  value={formData.dataHora}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataHora: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo da Consulta</Label>
                <Textarea
                  id="motivo"
                  placeholder="Descreva brevemente o motivo da consulta..."
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Solicitar Agendamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {agendamentos.map((agendamento) => {
          const { date, time } = formatDateTime(agendamento.dataHora);
          
          return (
            <Card key={agendamento.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{time}</span>
                      </div>
                      {getStatusBadge(agendamento.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{agendamento.pacienteNome}</p>
                          <p className="text-sm text-muted-foreground">Paciente</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{agendamento.medicoNome}</p>
                          <p className="text-sm text-muted-foreground">{agendamento.especialidade}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Motivo:</p>
                      <p className="text-sm text-muted-foreground">{agendamento.motivo}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2 ml-4">
                    {user.role === 'medico' && agendamento.status === 'pendente' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-success hover:text-success"
                          onClick={() => handleAprovar(agendamento.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRejeitar(agendamento.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {agendamentos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground">
                {user.role === 'paciente' && 'Solicite sua primeira consulta clicando no botão acima.'}
                {user.role === 'medico' && 'Quando houver solicitações, elas aparecerão aqui.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};