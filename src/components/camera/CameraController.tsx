import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Square, 
  Circle, 
  SwitchCamera, 
  Download,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '@/hooks/use-toast';

interface CameraControllerProps {
  className?: string;
  showDeviceSelector?: boolean;
  showRecording?: boolean;
  onPhotoCapture?: (blob: Blob) => void;
  onVideoRecord?: (blob: Blob) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  className = "",
  showDeviceSelector = true,
  showRecording = true,
  onPhotoCapture,
  onVideoRecord
}) => {
  const { toast } = useToast();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  const {
    isActive,
    isRecording,
    stream,
    error,
    devices,
    selectedDeviceId,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    startRecording,
    stopRecording,
    switchCamera,
  } = useCamera({
    video: {
      width: 1280,
      height: 720,
      frameRate: 30
    },
    audio: true
  });

  const handleStartCamera = async () => {
    try {
      await startCamera();
      toast({
        title: "Câmera iniciada",
        description: "A câmera foi ativada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na câmera",
        description: "Não foi possível iniciar a câmera",
        variant: "destructive"
      });
    }
  };

  const handleStopCamera = () => {
    stopCamera();
    toast({
      title: "Câmera desativada",
      description: "A câmera foi desligada",
    });
  };

  const handleCapturePhoto = async () => {
    try {
      const blob = await capturePhoto();
      const url = URL.createObjectURL(blob);
      setCapturedPhotos(prev => [...prev, url]);
      
      onPhotoCapture?.(blob);
      
      toast({
        title: "Foto capturada",
        description: "A foto foi salva com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na captura",
        description: "Não foi possível capturar a foto",
        variant: "destructive"
      });
    }
  };

  const handleStartRecording = () => {
    startRecording();
    toast({
      title: "Gravação iniciada",
      description: "A gravação do vídeo foi iniciada",
    });
  };

  const handleStopRecording = async () => {
    try {
      const blob = await stopRecording();
      onVideoRecord?.(blob);
      
      toast({
        title: "Gravação finalizada",
        description: "O vídeo foi salvo com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na gravação",
        description: "Não foi possível finalizar a gravação",
        variant: "destructive"
      });
    }
  };

  const handleSwitchCamera = async (deviceId: string) => {
    try {
      await switchCamera(deviceId);
      toast({
        title: "Câmera alterada",
        description: "A câmera foi trocada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao trocar câmera",
        description: "Não foi possível alterar a câmera",
        variant: "destructive"
      });
    }
  };

  const downloadPhoto = (photoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `foto-medica-${Date.now()}-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={`${className} animate-fade-in`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Controle de Câmera</span>
          {isActive && (
            <Badge variant="outline" className="text-success">
              <Circle className="w-2 h-2 mr-1 fill-current" />
              Ativa
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Área de vídeo */}
        <div className="relative">
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden">
            {isActive ? (
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
                <p className="text-muted-foreground">Câmera desativada</p>
              </div>
            )}
            
            {/* Indicador de gravação */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full">
                <Circle className="w-2 h-2 fill-current animate-pulse" />
                <span className="text-sm font-medium">REC</span>
              </div>
            )}
          </div>
        </div>

        {/* Controles da câmera */}
        <div className="flex flex-wrap gap-2">
          {!isActive ? (
            <Button onClick={handleStartCamera} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Ativar Câmera
            </Button>
          ) : (
            <>
              <Button onClick={handleStopCamera} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Desativar
              </Button>
              
              <Button onClick={handleCapturePhoto} variant="secondary">
                <Camera className="w-4 h-4 mr-2" />
                Capturar Foto
              </Button>
              
              {showRecording && (
                <>
                  {!isRecording ? (
                    <Button onClick={handleStartRecording} variant="destructive">
                      <Circle className="w-4 h-4 mr-2" />
                      Gravar
                    </Button>
                  ) : (
                    <Button onClick={handleStopRecording} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      Parar Gravação
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Seletor de dispositivos */}
        {showDeviceSelector && devices.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar Câmera:</label>
            <Select value={selectedDeviceId || ""} onValueChange={handleSwitchCamera}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma câmera" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Câmera ${device.deviceId.slice(-4)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Fotos capturadas */}
        {capturedPhotos.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Fotos Capturadas ({capturedPhotos.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {capturedPhotos.map((photoUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photoUrl}
                    alt={`Foto ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => downloadPhoto(photoUrl, index)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações de status */}
        {stream && (
          <Alert className="border-success bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Câmera ativa - Resolução: {stream.getVideoTracks()[0]?.getSettings()?.width}x{stream.getVideoTracks()[0]?.getSettings()?.height}
            </AlertDescription>
          </Alert>
        )}

        {/* Alertas de erro */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};