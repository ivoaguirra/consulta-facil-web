import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video,
  AlertTriangle,
  ArrowLeft,
  Settings,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJitsiMeet } from '@/hooks/useJitsiMeet';
import { JitsiMeetComponent } from '@/components/videochamada/JitsiMeetComponent';
import { TesteDispositivos } from '@/components/consulta/TesteDispositivos';
import { ModalConclusaoConsulta, DadosConclusao } from '@/components/videochamada/ModalConclusaoConsulta';
import { supabase } from '@/integrations/supabase/client';

export const Videochamada: React.FC = () => {
  const { consultaId } = useParams<{ consultaId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    sala, 
    isLoading, 
    error, 
    isConnected,
    gerarSalaJitsi, 
    conectarSala, 
    desconectarSala,
    limparErro 
  } = useJitsiMeet();

  const [etapaAtual, setEtapaAtual] = useState<'dispositivos' | 'videochamada'>('dispositivos');
  const [dispositivosTestados, setDispositivosTestados] = useState(false);
  const [duracaoConsulta, setDuracaoConsulta] = useState(0);
  const [mostrarModalConclusao, setMostrarModalConclusao] = useState(false);
  const [consultaAtual, setConsultaAtual] = useState<any>(null);
  const [finalizandoConsulta, setFinalizandoConsulta] = useState(false);
  

  useEffect(() => {
    if (!consultaId) {
      toast({
        title: 'Erro',
        description: 'ID da consulta não encontrado.',
        variant: 'destructive',
      });
      navigate('/consultas');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    // Gerar sala Jitsi quando componente carrega
    gerarSalaJitsi(consultaId);
  }, [consultaId, user, navigate, gerarSalaJitsi, toast]);

  // Timer da consulta
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setDuracaoConsulta(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected]);

  const handleIniciarVideochamada = () => {
    if (!sala) {
      toast({
        title: 'Erro',
        description: 'Sala de videoconferência não foi gerada.',
        variant: 'destructive',
      });
      return;
    }

    if (!dispositivosTestados) {
      toast({
        title: 'Atenção',
        description: 'Recomendamos testar seus dispositivos antes de entrar na consulta.',
        variant: 'destructive',
      });
      return;
    }

    setEtapaAtual('videochamada');
    conectarSala(sala);
  };

  const handleSairVideochamada = () => {
    setMostrarModalConclusao(true);
  };

  const handleConfirmarConclusao = async (dados: DadosConclusao) => {
    setFinalizandoConsulta(true);
    
    try {
      // Chamar edge function para finalizar consulta
      const { data, error } = await supabase.functions.invoke('concluir-consulta', {
        body: {
          consultaId,
          duracaoMinutos: Math.floor(duracaoConsulta / 60),
          ...dados
        }
      });

      if (error) {
        console.error('Erro ao finalizar consulta:', error);
        toast({
          title: "Erro ao finalizar consulta",
          description: error.message || "Tente novamente",
          variant: "destructive"
        });
        return;
      }

      // Desconectar da sala Jitsi
      desconectarSala();
      
      toast({
        title: "Consulta finalizada com sucesso",
        description: `Duração: ${formatarDuracao(duracaoConsulta)}`,
      });
      
      navigate('/consultas');
      
    } catch (error: any) {
      console.error('Erro ao finalizar consulta:', error);
      toast({
        title: "Erro ao finalizar consulta",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setFinalizandoConsulta(false);
      setMostrarModalConclusao(false);
    }
  };

  const handleVoltarConsultas = () => {
    if (isConnected) {
      desconectarSala();
    }
    navigate('/consultas');
  };

  const formatarDuracao = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleVoltarConsultas}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Videochamada</h1>
              <p className="text-muted-foreground">
                Consulta ID: {consultaId}
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {formatarDuracao(duracaoConsulta)}
              </Badge>
            </div>
          )}
        </div>

        {/* Erros */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button size="sm" variant="outline" onClick={limparErro}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Preparando sala de videoconferência...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo principal */}
        {!isLoading && !error && sala && (
          <>
            {etapaAtual === 'dispositivos' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Teste de Dispositivos</span>
                  </CardTitle>
                  <CardDescription>
                    Verifique se sua câmera e microfone estão funcionando corretamente antes de entrar na consulta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TesteDispositivos 
                    onTesteCompleto={setDispositivosTestados}
                  />
                  
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleVoltarConsultas}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleIniciarVideochamada}
                      disabled={!dispositivosTestados}
                      className="bg-success hover:bg-success/90"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Entrar na Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {etapaAtual === 'videochamada' && (
              <div className="space-y-4">
                {/* Informações da sala */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Users className="w-3 h-3 mr-1" />
                          Sala: {sala.nomeSala}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Usuário: {(user as any).user_metadata?.nome || user.email}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleSairVideochamada}
                      >
                        Sair da Consulta
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Componente Jitsi Meet */}
                <JitsiMeetComponent
                  sala={sala}
                  onDesconectar={handleSairVideochamada}
                  onErro={(erro) => {
                    toast({
                      title: 'Erro na videoconferência',
                      description: erro,
                      variant: 'destructive',
                    });
                  }}
                  className="min-h-[500px]"
                />
              </div>
            )}
          </>
        )}

        {/* Modal de conclusão da consulta */}
        <ModalConclusaoConsulta
          isOpen={mostrarModalConclusao}
          onClose={() => setMostrarModalConclusao(false)}
          onConfirm={handleConfirmarConclusao}
          duracaoConsulta={duracaoConsulta}
          isLoading={finalizandoConsulta}
        />
      </div>
    </div>
  );
};