import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  User,
  Scissors,
  Plus,
  Check,
  X,
  Eye,
  AlertTriangle,
  Heart,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcedimentoItem {
  id: string;
  pacienteNome: string;
  medicoNome: string;
  especialidade: string;
  procedimento: string;
  categoria: 'cirurgia' | 'exame_especializado' | 'terapia' | 'estetico';
  dataHora: string;
  duracao: number; // em minutos
  preparo?: string;
  observacoes: string;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  custoEstimado?: number;
  sala?: string;
}

const mockProcedimentos: ProcedimentoItem[] = [
  {
    id: '1',
    pacienteNome: 'Maria Santos',
    medicoNome: 'Dr. Carlos Mendes',
    especialidade: 'Ortopedia',
    procedimento: 'Artroscopia de joelho',
    categoria: 'cirurgia',
    dataHora: '2024-03-20T08:00:00',
    duracao: 120,
    preparo: 'Jejum de 12 horas. Suspenção de anticoagulantes 3 dias antes.',
    observacoes: 'Paciente com histórico de alergia a anestésicos locais',
    status: 'confirmado',
    prioridade: 'media',
    custoEstimado: 3500,
    sala: 'Centro Cirúrgico 2'
  },
  {
    id: '2',
    pacienteNome: 'João Silva',
    medicoNome: 'Dra. Ana Costa',
    especialidade: 'Dermatologia',
    procedimento: 'Remoção de lesão cutânea',
    categoria: 'cirurgia',
    dataHora: '2024-03-18T14:30:00',
    duracao: 45,
    observacoes: 'Lesão suspeita em região dorsal',
    status: 'agendado',
    prioridade: 'alta',
    custoEstimado: 800,
    sala: 'Sala de Procedimentos 1'
  },
  {
    id: '3',
    pacienteNome: 'Pedro Costa',
    medicoNome: 'Dr. Ricardo Santos',
    especialidade: 'Oftalmologia',
    procedimento: 'Cirurgia de catarata',
    categoria: 'cirurgia',
    dataHora: '2024-03-25T09:00:00',
    duracao: 30,
    preparo: 'Colírios pré-operatórios conforme prescrição',
    observacoes: 'Catarata bilateral - primeiro olho',
    status: 'agendado',
    prioridade: 'media',
    custoEstimado: 2500
  }
];

const categoriasProcedimento = [
  { value: 'cirurgia', label: 'Cirurgia', icon: Scissors },
  { value: 'exame_especializado', label: 'Exame Especializado', icon: Activity },
  { value: 'terapia', label: 'Terapia', icon: Heart },
  { value: 'estetico', label: 'Estético', icon: User }
];

const prioridades = [
  { value: 'baixa', label: 'Baixa', color: 'bg-blue-100 text-blue-800' },
  { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' }
];

export const Procedimentos: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [procedimentos, setProcedimentos] = useState<ProcedimentoItem[]>(mockProcedimentos);
  const [activeTab, setActiveTab] = useState('lista');
  
  const [formData, setFormData] = useState({
    pacienteNome: '',
    procedimento: '',
    categoria: 'cirurgia' as ProcedimentoItem['categoria'],
    dataHora: '',
    duracao: 60,
    preparo: '',
    observacoes: '',
    prioridade: 'media' as ProcedimentoItem['prioridade'],
    custoEstimado: 0,
    sala: ''
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoProcedimento: ProcedimentoItem = {
      id: Date.now().toString(),
      ...formData,
      medicoNome: user.nome,
      especialidade: user.especialidade || 'Medicina Geral',
      status: 'agendado',
    };

    setProcedimentos(prev => [...prev, novoProcedimento]);
    setShowForm(false);
    
    // Reset form
    setFormData({
      pacienteNome: '',
      procedimento: '',
      categoria: 'cirurgia',
      dataHora: '',
      duracao: 60,
      preparo: '',
      observacoes: '',
      prioridade: 'media',
      custoEstimado: 0,
      sala: ''
    });

    toast({
      title: 'Procedimento agendado!',
      description: 'O procedimento foi adicionado à agenda.',
    });
  };

  const handleStatusChange = (id: string, newStatus: ProcedimentoItem['status']) => {
    setProcedimentos(prev => 
      prev.map(proc => 
        proc.id === id ? { ...proc, status: newStatus } : proc
      )
    );
    
    const statusMessages = {
      confirmado: 'Procedimento confirmado!',
      realizado: 'Procedimento marcado como realizado',
      cancelado: 'Procedimento cancelado'
    };

    toast({
      title: statusMessages[newStatus as keyof typeof statusMessages],
      description: 'Status atualizado com sucesso.',
      variant: newStatus === 'cancelado' ? 'destructive' : 'default'
    });
  };

  const getStatusBadge = (status: ProcedimentoItem['status']) => {
    const variants = {
      agendado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      realizado: 'bg-purple-100 text-purple-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: ProcedimentoItem['prioridade']) => {
    const config = prioridades.find(p => p.value === prioridade);
    return <Badge className={config?.color}>{config?.label}</Badge>;
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const procedimentosPorCategoria = procedimentos.reduce((acc, proc) => {
    if (!acc[proc.categoria]) acc[proc.categoria] = [];
    acc[proc.categoria].push(proc);
    return acc;
  }, {} as Record<string, ProcedimentoItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Procedimentos</h1>
          <p className="text-muted-foreground">
            Gerencie cirurgias, exames especializados e outros procedimentos
          </p>
        </div>
        
        {user.role === 'medico' && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agendar Procedimento
          </Button>
        )}
      </div>

      {/* Formulário de novo procedimento */}
      {showForm && user.role === 'medico' && (
        <Card>
          <CardHeader>
            <CardTitle>Agendar Procedimento</CardTitle>
            <CardDescription>
              Preencha os dados para agendar um novo procedimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pacienteNome">Nome do Paciente</Label>
                  <Input
                    id="pacienteNome"
                    value={formData.pacienteNome}
                    onChange={(e) => setFormData(prev => ({ ...prev, pacienteNome: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasProcedimento.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedimento">Procedimento</Label>
                <Input
                  id="procedimento"
                  placeholder="Ex: Artroscopia de joelho, Cirurgia de catarata..."
                  value={formData.procedimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, procedimento: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duracao}
                    onChange={(e) => setFormData(prev => ({ ...prev, duracao: parseInt(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select 
                    value={formData.prioridade} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prioridades.map(pri => (
                        <SelectItem key={pri.value} value={pri.value}>
                          {pri.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custoEstimado">Custo Estimado (R$)</Label>
                  <Input
                    id="custoEstimado"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.custoEstimado}
                    onChange={(e) => setFormData(prev => ({ ...prev, custoEstimado: parseFloat(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sala">Sala/Local</Label>
                  <Input
                    id="sala"
                    placeholder="Ex: Centro Cirúrgico 2, Sala de Procedimentos 1"
                    value={formData.sala}
                    onChange={(e) => setFormData(prev => ({ ...prev, sala: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preparo">Preparo Necessário</Label>
                <Textarea
                  id="preparo"
                  placeholder="Instruções de preparo para o paciente..."
                  value={formData.preparo}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparo: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações importantes sobre o procedimento..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Agendar Procedimento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabs para visualização */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Lista Completa</TabsTrigger>
          <TabsTrigger value="categoria">Por Categoria</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {procedimentos.map((procedimento) => {
            const { date, time } = formatDateTime(procedimento.dataHora);
            const categoryConfig = categoriasProcedimento.find(c => c.value === procedimento.categoria);
            const CategoryIcon = categoryConfig?.icon || Scissors;
            
            return (
              <Card key={procedimento.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-4 flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{procedimento.procedimento}</span>
                        </div>
                        {getStatusBadge(procedimento.status)}
                        {getPrioridadeBadge(procedimento.prioridade)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{date}</p>
                            <p className="text-sm text-muted-foreground">{time}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{procedimento.pacienteNome}</p>
                            <p className="text-sm text-muted-foreground">Paciente</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{formatDuration(procedimento.duracao)}</p>
                            <p className="text-sm text-muted-foreground">Duração</p>
                          </div>
                        </div>
                      </div>

                      {procedimento.sala && (
                        <div className="text-sm">
                          <span className="font-medium">Local: </span>
                          <span className="text-muted-foreground">{procedimento.sala}</span>
                        </div>
                      )}

                      {procedimento.preparo && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">Preparo necessário:</span>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">{procedimento.preparo}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Observações:</p>
                        <p className="text-sm text-muted-foreground">{procedimento.observacoes}</p>
                      </div>

                      {procedimento.custoEstimado && procedimento.custoEstimado > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Custo estimado: </span>
                          <span className="text-muted-foreground">
                            R$ {procedimento.custoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {user.role === 'medico' && procedimento.status === 'agendado' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleStatusChange(procedimento.id, 'confirmado')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {user.role === 'medico' && procedimento.status === 'confirmado' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(procedimento.id, 'realizado')}
                        >
                          Finalizar
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>

                      {procedimento.status !== 'realizado' && procedimento.status !== 'cancelado' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusChange(procedimento.id, 'cancelado')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {procedimentos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum procedimento agendado</h3>
                <p className="text-muted-foreground">
                  {user.role === 'medico' && 'Agende o primeiro procedimento clicando no botão acima.'}
                  {user.role !== 'medico' && 'Quando houver procedimentos agendados, eles aparecerão aqui.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categoria" className="space-y-6">
          {Object.entries(procedimentosPorCategoria).map(([categoria, procs]) => {
            const categoryConfig = categoriasProcedimento.find(c => c.value === categoria);
            const CategoryIcon = categoryConfig?.icon || Scissors;
            
            return (
              <div key={categoria} className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <CategoryIcon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">{categoryConfig?.label}</h3>
                  <Badge variant="secondary">{procs.length}</Badge>
                </div>
                <div className="grid gap-4">
                  {procs.map(proc => {
                    const { date, time } = formatDateTime(proc.dataHora);
                    return (
                      <Card key={proc.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{proc.procedimento}</h4>
                              <p className="text-sm text-muted-foreground">{proc.pacienteNome}</p>
                              <p className="text-sm text-muted-foreground">{date} às {time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(proc.status)}
                              {getPrioridadeBadge(proc.prioridade)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="agenda">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Visualização de Agenda</h3>
                <p className="text-muted-foreground">
                  Implementação futura: calendário interativo com visualização por dia/semana/mês
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};