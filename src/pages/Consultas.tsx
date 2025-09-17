import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Settings,
  Pill
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TesteDispositivos } from '@/components/consulta/TesteDispositivos';
import { ReceituarioDigital } from '@/components/receituario/ReceituarioDigital';
import { useNavigate } from 'react-router-dom';

interface ConsultaItem {
  id: string;
  pacienteNome: string;
  medicoNome: string;
  especialidade: string;
  dataHora: string;
  status: 'agendada' | 'em_andamento' | 'concluida';
  linkVideoconferencia: string;
  duracao?: number;
}

const mockConsultas: ConsultaItem[] = [
  {
    id: '1',
    pacienteNome: 'Maria Santos',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataHora: '2024-03-15T14:30:00',
    status: 'agendada',
    linkVideoconferencia: 'https://meet.jit.si/telemed-consulta-1',
  },
  {
    id: '2',
    pacienteNome: 'Pedro Costa',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataHora: '2024-03-14T10:00:00',
    status: 'concluida',
    linkVideoconferencia: 'https://meet.jit.si/telemed-consulta-2',
    duracao: 35,
  },
];

export const Consultas: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<ConsultaItem[]>(mockConsultas);
  const [consultaAtiva, setConsultaAtiva] = useState<ConsultaItem | null>(null);
  const [dispositivosTestados, setDispositivosTestados] = useState(false);
  const [mostrarReceituario, setMostrarReceituario] = useState(false);

  if (!user) return null;

  const handleIniciarConsulta = (consulta: ConsultaItem) => {
    setConsultas(prev => 
      prev.map(c => 
        c.id === consulta.id 
          ? { ...c, status: 'em_andamento' as const } 
          : c
      )
    );
    setConsultaAtiva(consulta);
    toast({
      title: 'Consulta iniciada!',
      description: 'A videoconferência foi estabelecida.',
    });
  };

  const handleFinalizarConsulta = () => {
    if (!consultaAtiva) return;
    
    setConsultas(prev => 
      prev.map(c => 
        c.id === consultaAtiva.id 
          ? { ...c, status: 'concluida' as const, duracao: 30 } 
          : c
      )
    );
    setConsultaAtiva(null);
    toast({
      title: 'Consulta finalizada!',
      description: 'Não esqueça de preencher o prontuário.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendada':
        return <Badge variant="outline" className="text-primary">Agendada</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="text-warning">Em Andamento</Badge>;
      case 'concluida':
        return <Badge variant="outline" className="text-success">Concluída</Badge>;
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

  const isConsultaDisponivel = (dataHora: string) => {
    const consultaDate = new Date(dataHora);
    const agora = new Date();
    const diferencaMinutos = (consultaDate.getTime() - agora.getTime()) / (1000 * 60);
    return diferencaMinutos <= 15 && diferencaMinutos >= -60; // 15 min antes até 1h depois
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Consultas</h1>
        <p className="text-muted-foreground">
          {user.role === 'paciente' && 'Participe das suas consultas por videoconferência'}
          {user.role === 'medico' && 'Realize atendimentos virtuais com ferramentas avançadas'}
        </p>
      </div>

      {/* Consulta Ativa */}
      {consultaAtiva && (
        <Card className="border-warning bg-warning/5 animate-pulse-success">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-warning animate-bounce-subtle" />
              <span>Consulta em Andamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {user.role === 'paciente' ? consultaAtiva.medicoNome : consultaAtiva.pacienteNome}
                </p>
                <p className="text-sm text-muted-foreground">{consultaAtiva.especialidade}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <MicOff className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <VideoOff className="w-4 h-4" />
                </Button>
                {user.role === 'medico' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setMostrarReceituario(true)}
                  >
                    <Pill className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={handleFinalizarConsulta}>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Finalizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Consultas */}
      <div className="space-y-4">
        {consultas.map((consulta) => {
          const { date, time } = formatDateTime(consulta.dataHora);
          const podeIniciar = isConsultaDisponivel(consulta.dataHora);
          
          return (
            <Card key={consulta.id} className="animate-fade-in hover:shadow-lg transition-all duration-300">
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
                      {getStatusBadge(consulta.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {user.role === 'paciente' ? consulta.medicoNome : consulta.pacienteNome}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.role === 'paciente' ? consulta.especialidade : 'Paciente'}
                          </p>
                        </div>
                      </div>

                      {consulta.duracao && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{consulta.duracao} minutos</p>
                            <p className="text-sm text-muted-foreground">Duração</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2 ml-4">
                    {consulta.status === 'agendada' && podeIniciar && !consultaAtiva && (
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={() => navigate(`/video/${consulta.id}`)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Iniciar Videochamada
                      </Button>
                    )}

                    {consulta.status === 'agendada' && podeIniciar && !consultaAtiva && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Testar Dispositivos
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl h-[90vh]">
                          <DialogHeader>
                            <DialogTitle>Consulta Virtual - TeleMed</DialogTitle>
                          </DialogHeader>
                          <div className="flex-1">
                            <Tabs defaultValue="dispositivos" className="h-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="dispositivos" className="flex items-center space-x-2">
                                  <Settings className="w-4 h-4" />
                                  <span>Teste de Dispositivos</span>
                                </TabsTrigger>
                                <TabsTrigger value="consulta" disabled={!dispositivosTestados}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Videoconferência
                                </TabsTrigger>
                                <TabsTrigger value="receituario" disabled={user.role !== 'medico'}>
                                  <Pill className="w-4 h-4 mr-2" />
                                  Receituário
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="dispositivos" className="mt-4 h-full">
                                <TesteDispositivos 
                                  onTesteCompleto={setDispositivosTestados}
                                  className="h-full"
                                />
                              </TabsContent>

                              <TabsContent value="consulta" className="mt-4 space-y-4">
                                {/* Interface de Videoconferência */}
                                <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center relative animate-fade-in">
                                  <iframe
                                    src={consulta.linkVideoconferencia}
                                    width="100%"
                                    height="100%"
                                    className="rounded-lg"
                                    allow="camera; microphone; fullscreen; speaker; display-capture"
                                    title="Videoconferência TeleMed"
                                  />
                                </div>
                                
                                {/* Controles */}
                                <div className="flex justify-center space-x-4">
                                  <Button 
                                    size="sm" 
                                    className="bg-success hover:bg-success/90"
                                    onClick={() => handleIniciarConsulta(consulta)}
                                  >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Conectar
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Mic className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Video className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Monitor className="w-4 h-4" />
                                  </Button>
                                  {user.role === 'medico' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setMostrarReceituario(true)}
                                    >
                                      <Pill className="w-4 h-4 mr-2" />
                                      Receituário
                                    </Button>
                                  )}
                                </div>

                                {/* Informações da consulta */}
                                <Card className="bg-card-elevated animate-fade-in">
                                  <CardContent className="p-4">
                                    <h4 className="font-medium mb-3">Informações da Consulta</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Paciente: </span>
                                        <span className="font-medium">{consulta.pacienteNome}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Médico: </span>
                                        <span className="font-medium">{consulta.medicoNome}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Especialidade: </span>
                                        <span className="font-medium">{consulta.especialidade}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Horário: </span>
                                        <span className="font-medium">{date} às {time}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="receituario" className="mt-4">
                                <ReceituarioDigital
                                  consultaId={consulta.id}
                                  pacienteNome={consulta.pacienteNome}
                                  medicoNome={consulta.medicoNome}
                                  especialidade={consulta.especialidade}
                                  onSave={(receita) => {
                                    toast({
                                      title: 'Receita salva',
                                      description: 'A receita foi salva com sucesso.'
                                    });
                                  }}
                                  onSend={(receita) => {
                                    toast({
                                      title: 'Receita enviada',
                                      description: 'A receita foi enviada para o paciente.'
                                    });
                                  }}
                                />
                              </TabsContent>
                            </Tabs>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {consulta.status === 'em_andamento' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-warning hover:text-warning"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Retomar
                      </Button>
                    )}

                    {consulta.status === 'concluida' && user.role === 'medico' && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Prontuário
                      </Button>
                    )}

                    {!podeIniciar && consulta.status === 'agendada' && (
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Aguardar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {consultas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma consulta encontrada</h3>
              <p className="text-muted-foreground">
                {user.role === 'paciente' && 'Suas consultas agendadas aparecerão aqui.'}
                {user.role === 'medico' && 'Suas consultas com pacientes aparecerão aqui.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};