import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff, 
  CheckCircle, 
  XCircle, 
  Settings,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface DispositivosStatus {
  camera: 'testing' | 'success' | 'error' | 'not-tested';
  microfone: 'testing' | 'success' | 'error' | 'not-tested';
  audio: 'testing' | 'success' | 'error' | 'not-tested';
}

interface TesteDispositivosProps {
  onTesteCompleto: (todosOk: boolean) => void;
  className?: string;
}

export const TesteDispositivos: React.FC<TesteDispositivosProps> = ({ 
  onTesteCompleto, 
  className = "" 
}) => {
  const [status, setStatus] = useState<DispositivosStatus>({
    camera: 'not-tested',
    microfone: 'not-tested',
    audio: 'not-tested'
  });
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [testeIniciado, setTesteIniciado] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  const testarDispositivos = async () => {
    setTesteIniciado(true);
    setStatus({
      camera: 'testing',
      microfone: 'testing',
      audio: 'testing'
    });

    try {
      // Solicitar permissões
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);

      // Testar câmera
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStatus(prev => ({ ...prev, camera: 'success' }));
      }

      // Testar microfone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      // Detectar áudio
      let audioDetectado = false;
      const detectarAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        if (volume > 10 && !audioDetectado) {
          audioDetectado = true;
          setStatus(prev => ({ 
            ...prev, 
            microfone: 'success',
            audio: 'success'
          }));
        }
        
        if (!audioDetectado) {
          requestAnimationFrame(detectarAudio);
        }
      };
      
      detectarAudio();
      
      // Timeout para microfone se não detectar áudio
      setTimeout(() => {
        if (!audioDetectado) {
          setStatus(prev => ({ 
            ...prev, 
            microfone: 'error',
            audio: 'error'
          }));
        }
      }, 5000);

    } catch (error) {
      console.error('Erro ao acessar dispositivos:', error);
      setStatus({
        camera: 'error',
        microfone: 'error',
        audio: 'error'
      });
    }
  };

  const reiniciarTeste = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setStatus({
      camera: 'not-tested',
      microfone: 'not-tested',
      audio: 'not-tested'
    });
    setTesteIniciado(false);
  };

  const getStatusIcon = (deviceStatus: string) => {
    switch (deviceStatus) {
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin text-warning" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Settings className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (deviceStatus: string) => {
    switch (deviceStatus) {
      case 'testing':
        return <Badge variant="outline" className="text-warning">Testando...</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-success">Funcionando</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Não testado</Badge>;
    }
  };

  const todosDispositivos = Object.values(status);
  const todosTestados = todosDispositivos.every(s => s !== 'not-tested' && s !== 'testing');
  const todosOk = todosDispositivos.every(s => s === 'success');

  useEffect(() => {
    if (todosTestados) {
      onTesteCompleto(todosOk);
    }
  }, [todosTestados, todosOk, onTesteCompleto]);

  return (
    <Card className={`${className} animate-fade-in`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Teste de Dispositivos</span>
        </CardTitle>
        <CardDescription>
          Verifique se sua câmera e microfone estão funcionando corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Área de vídeo */}
        <div className="relative">
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  {testeIniciado ? 'Aguardando permissão...' : 'Teste de câmera'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status dos dispositivos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-card-elevated rounded-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Câmera</p>
                <p className="text-sm text-muted-foreground">Verificando video feed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.camera)}
              {getStatusBadge(status.camera)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-card-elevated rounded-lg">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Microfone</p>
                <p className="text-sm text-muted-foreground">Fale para testar o áudio</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.microfone)}
              {getStatusBadge(status.microfone)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-card-elevated rounded-lg">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Qualidade do Áudio</p>
                <p className="text-sm text-muted-foreground">Verificando entrada de som</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.audio)}
              {getStatusBadge(status.audio)}
            </div>
          </div>
        </div>

        {/* Alertas */}
        {Object.values(status).some(s => s === 'error') && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Alguns dispositivos não funcionaram corretamente. Verifique as permissões do navegador 
              e se os dispositivos estão conectados.
            </AlertDescription>
          </Alert>
        )}

        {todosOk && (
          <Alert className="border-success bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Todos os dispositivos estão funcionando perfeitamente! 
              Você está pronto para iniciar a consulta.
            </AlertDescription>
          </Alert>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          {!testeIniciado ? (
            <Button onClick={testarDispositivos} className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Iniciar Teste
            </Button>
          ) : (
            <Button onClick={reiniciarTeste} variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Testar Novamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};