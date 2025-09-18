import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
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
  Eye,
  Loader2,
  Video,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interface para agendamentos do Supabase
interface AgendamentoItem {
  id: string;
  paciente_id: string;
  medico_id: string;
  clinica_id?: string;
  data_agendamento: string;
  duracao_minutos: number;
  tipo_consulta: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  observacoes?: string;
  valor?: number;
  created_at: string;
  updated_at: string;
}

export const Agendamentos: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
  const [medicos, setMedicos] = useState<{id: string, nome: string, especialidade?: string}[]>([]);

  // Estado para novo agendamento
  const [novoAgendamento, setNovoAgendamento] = useState({
    medico_id: '',
    medico_nome: searchParams.get('nome') || '',
    data_agendamento: '',
    tipo_consulta: '',
    observacoes: '',
    duracao_minutos: 30,
    modalidade: 'presencial', // presencial ou online
  });

  // Buscar agendamentos do usuário e carregar médicos
  useEffect(() => {
    if (user) {
      buscarAgendamentos();
      carregarMedicos();
    }
  }, [user]);

  // Abrir automaticamente o formulário se vier da página de médicos  
  useEffect(() => {
    const medicoParam = searchParams.get('medico');
    const nomeParam = searchParams.get('nome');
    
    console.log('URL params:', { medicoParam, nomeParam });
    console.log('Médicos disponíveis:', medicos);
    
    if (medicoParam && user?.role === 'paciente') {
      setShowNovoAgendamento(true);
      
      // Se temos médicos carregados e um nome na URL, buscar o médico correto
      if (medicos.length > 0 && nomeParam) {
        const nomeDecodificado = decodeURIComponent(nomeParam);
        const medico = medicos.find(m => m.nome === nomeDecodificado);
        console.log('Médico encontrado:', medico);
        
        if (medico) {
          setNovoAgendamento(prev => ({ 
            ...prev, 
            medico_id: medico.id,
            medico_nome: medico.nome 
          }));
        } else {
          // Se não encontrou exato, buscar similar
          const medicoSimilar = medicos.find(m => 
            m.nome.toLowerCase().includes(nomeDecodificado.toLowerCase()) ||
            nomeDecodificado.toLowerCase().includes(m.nome.toLowerCase())
          );
          if (medicoSimilar) {
            setNovoAgendamento(prev => ({ 
              ...prev, 
              medico_id: medicoSimilar.id,
              medico_nome: medicoSimilar.nome 
            }));
          }
        }
      }
    }
  }, [searchParams, user, medicos]);

  const buscarAgendamentos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('agendamentos')
        .select('*');

      // Filtrar por role do usuário
      if (user?.role === 'paciente') {
        query = query.eq('paciente_id', user.id);
      } else if (user?.role === 'medico') {
        query = query.eq('medico_id', user.id);
      }

      const { data, error } = await query.order('data_agendamento', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar agendamentos',
          variant: 'destructive',
        });
      } else {
        setAgendamentos((data as AgendamentoItem[]) || []);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarMedicos = async () => {
    try {
      console.log('Carregando médicos...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, especialidade')
        .eq('role', 'medico')
        .eq('ativo', true);

      console.log('Resultado da consulta médicos:', { data, error });

      if (error) {
        console.error('Erro ao carregar médicos:', error);
      } else {
        console.log('Médicos carregados:', data);
        setMedicos(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const criarAgendamento = async () => {
    console.log('Dados do agendamento:', novoAgendamento);
    console.log('User ID:', user?.id);
    
    if (!user || !novoAgendamento.medico_id || !novoAgendamento.data_agendamento || !novoAgendamento.tipo_consulta) {
      console.log('Validação falhou:', {
        user: !!user,
        medico_id: novoAgendamento.medico_id,
        data_agendamento: novoAgendamento.data_agendamento,
        tipo_consulta: novoAgendamento.tipo_consulta
      });
      
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const observacoesCompletas = `${novoAgendamento.observacoes}${novoAgendamento.modalidade === 'online' ? '\n[CONSULTA ONLINE]' : ''}`;
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([
          {
            paciente_id: user.id,
            medico_id: novoAgendamento.medico_id,
            data_agendamento: new Date(novoAgendamento.data_agendamento).toISOString(),
            tipo_consulta: novoAgendamento.tipo_consulta,
            observacoes: observacoesCompletas,
            duracao_minutos: novoAgendamento.duracao_minutos,
            status: 'agendado',
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao criar agendamento',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sucesso',
          description: `Agendamento criado com sucesso! ${novoAgendamento.modalidade === 'online' ? 'Teleconsulta' : 'Consulta presencial'}`,
        });
        setShowNovoAgendamento(false);
        setNovoAgendamento({
          medico_id: '',
          medico_nome: '',
          data_agendamento: '',
          tipo_consulta: '',
          observacoes: '',
          duracao_minutos: 30,
          modalidade: 'presencial',
        });
        buscarAgendamentos();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const atualizarStatusAgendamento = async (id: string, novoStatus: AgendamentoItem['status']) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar status do agendamento',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sucesso',
          description: 'Status atualizado com sucesso!',
        });
        buscarAgendamentos();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const getStatusBadge = (status: AgendamentoItem['status']) => {
    const variants = {
      'agendado': 'outline',
      'confirmado': 'default',
      'em_andamento': 'secondary',
      'concluido': 'success',
      'cancelado': 'destructive',
    };

    const labels = {
      'agendado': 'Agendado',
      'confirmado': 'Confirmado',
      'em_andamento': 'Em Andamento',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado',
    };

    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">
            {user.role === 'paciente' && 'Gerencie suas consultas médicas'}
            {user.role === 'medico' && 'Gerencie sua agenda de consultas'}
            {user.role === 'clinica' && 'Visualize todos os agendamentos da clínica'}
          </p>
        </div>
        
        {user.role === 'paciente' && (
          <Button onClick={() => setShowNovoAgendamento(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        )}
      </div>

      {/* Formulário de novo agendamento */}
      {showNovoAgendamento && user.role === 'paciente' && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
            <CardDescription>Agende uma nova consulta médica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medico">Médico *</Label>
                {novoAgendamento.medico_nome ? (
                  <div className="p-2 bg-muted rounded-md">
                    <span className="font-medium">{novoAgendamento.medico_nome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-1"
                      onClick={() => setNovoAgendamento(prev => ({ ...prev, medico_id: '', medico_nome: '' }))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Select 
                    value={novoAgendamento.medico_id} 
                    onValueChange={(value) => {
                      const medico = medicos.find(m => m.id === value);
                      setNovoAgendamento(prev => ({ 
                        ...prev, 
                        medico_id: value,
                        medico_nome: medico?.nome || ''
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map(medico => (
                        <SelectItem key={medico.id} value={medico.id}>
                          {medico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data e Hora *</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  value={novoAgendamento.data_agendamento}
                  onChange={(e) => setNovoAgendamento(prev => ({ ...prev, data_agendamento: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Consulta *</Label>
                <Select 
                  value={novoAgendamento.tipo_consulta} 
                  onValueChange={(value) => setNovoAgendamento(prev => ({ ...prev, tipo_consulta: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primeira_consulta">Primeira Consulta</SelectItem>
                    <SelectItem value="retorno">Retorno</SelectItem>
                    <SelectItem value="urgencia">Urgência</SelectItem>
                    <SelectItem value="exame">Exame</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (minutos)</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="15"
                  max="120"
                  step="15"
                  value={novoAgendamento.duracao_minutos}
                  onChange={(e) => setNovoAgendamento(prev => ({ ...prev, duracao_minutos: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            {/* Modalidade da consulta */}
            <div className="space-y-2">
              <Label>Modalidade da Consulta *</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
                    novoAgendamento.modalidade === 'presencial' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:bg-accent'
                  }`}
                  onClick={() => setNovoAgendamento(prev => ({ ...prev, modalidade: 'presencial' }))}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Presencial</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
                    novoAgendamento.modalidade === 'online' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:bg-accent'
                  }`}
                  onClick={() => setNovoAgendamento(prev => ({ ...prev, modalidade: 'online' }))}
                >
                  <Video className="w-4 h-4" />
                  <span className="font-medium">Teleconsulta</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Descreva o motivo da consulta..."
                value={novoAgendamento.observacoes}
                onChange={(e) => setNovoAgendamento(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={criarAgendamento}>
                <Check className="w-4 h-4 mr-2" />
                Agendar
              </Button>
              <Button variant="outline" onClick={() => setShowNovoAgendamento(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>
            {user.role === 'paciente' && 'Minhas Consultas'}
            {user.role === 'medico' && 'Minha Agenda'}
            {user.role === 'clinica' && 'Todos os Agendamentos'}
          </CardTitle>
          <CardDescription>
            {agendamentos.length} agendamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando...</span>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground">
                {user.role === 'paciente' && 'Agende sua primeira consulta clicando em "Novo Agendamento"'}
                {user.role === 'medico' && 'Você não possui consultas agendadas no momento'}
                {user.role === 'clinica' && 'Não há agendamentos registrados na clínica'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((agendamento) => {
                const { date, time } = formatDateTime(agendamento.data_agendamento);
                
                return (
                  <div key={agendamento.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{date}</span>
                          <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                          <span>{time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {agendamento.tipo_consulta}
                          </span>
                          {agendamento.observacoes?.includes('[CONSULTA ONLINE]') && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Video className="w-3 h-3" />
                              <span className="text-xs font-medium">Online</span>
                            </div>
                          )}
                        </div>

                        {agendamento.observacoes && (
                          <p className="text-sm text-muted-foreground">
                            {agendamento.observacoes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(agendamento.status)}
                      </div>
                    </div>

                    {/* Ações para médicos */}
                    {user.role === 'medico' && agendamento.status === 'agendado' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => atualizarStatusAgendamento(agendamento.id, 'confirmado')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirmar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => atualizarStatusAgendamento(agendamento.id, 'cancelado')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    )}

                    {/* Ações para pacientes */}
                    {user.role === 'paciente' && (agendamento.status === 'agendado' || agendamento.status === 'confirmado') && (
                      <div className="flex gap-2 pt-2 border-t">
                        {agendamento.observacoes?.includes('[CONSULTA ONLINE]') && agendamento.status === 'confirmado' && (
                          <Button 
                            size="sm"
                            onClick={() => window.open(`/videochamada/${agendamento.id}`, '_blank')}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Entrar na Consulta
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        {agendamento.status === 'agendado' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => atualizarStatusAgendamento(agendamento.id, 'cancelado')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Ações para médicos */}
                    {user.role === 'medico' && agendamento.observacoes?.includes('[CONSULTA ONLINE]') && agendamento.status === 'confirmado' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          size="sm"
                          onClick={() => window.open(`/videochamada/${agendamento.id}`, '_blank')}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Iniciar Consulta Online
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};