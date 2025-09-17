import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CameraController } from '@/components/camera/CameraController';
import { CameraPreview } from '@/components/camera/CameraPreview';
import { TesteDispositivos } from '@/components/consulta/TesteDispositivos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Video,
  TestTube,
  Download,
  Settings,
  CheckCircle,
  FileImage,
  FileVideo
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TesteCamera() {
  const { toast } = useToast();
  const [capturedFiles, setCapturedFiles] = useState<{
    photos: { blob: Blob; url: string; timestamp: Date }[];
    videos: { blob: Blob; url: string; timestamp: Date }[];
  }>({
    photos: [],
    videos: []
  });
  const [testeCompleto, setTesteCompleto] = useState(false);

  const handlePhotoCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const timestamp = new Date();
    
    setCapturedFiles(prev => ({
      ...prev,
      photos: [...prev.photos, { blob, url, timestamp }]
    }));

    toast({
      title: "Foto capturada com sucesso",
      description: `Arquivo salvo em ${timestamp.toLocaleTimeString()}`,
    });
  };

  const handleVideoRecord = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const timestamp = new Date();
    
    setCapturedFiles(prev => ({
      ...prev,
      videos: [...prev.videos, { blob, url, timestamp }]
    }));

    toast({
      title: "Vídeo gravado com sucesso",
      description: `Arquivo salvo em ${timestamp.toLocaleTimeString()}`,
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleTesteCompleto = (todosOk: boolean) => {
    setTesteCompleto(todosOk);
    if (todosOk) {
      toast({
        title: "Dispositivos testados com sucesso",
        description: "Todos os dispositivos estão funcionando corretamente",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Teste de Câmera e APIs</h1>
          <p className="text-muted-foreground mt-1">
            Teste e valide as funcionalidades de câmera para ambientes médicos
          </p>
        </div>

        <Tabs defaultValue="controller" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="controller" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Controle de Câmera</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <TestTube className="w-4 h-4" />
              <span>Teste de Dispositivos</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileImage className="w-4 h-4" />
              <span>Arquivos Capturados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="controller" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CameraController
                onPhotoCapture={handlePhotoCapture}
                onVideoRecord={handleVideoRecord}
                showDeviceSelector={true}
                showRecording={true}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Preview da Câmera</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground">
                    <p>O preview aparecerá aqui quando a câmera for ativada</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex items-center space-x-4 p-6">
                  <FileImage className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{capturedFiles.photos.length}</p>
                    <p className="text-sm text-muted-foreground">Fotos Capturadas</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center space-x-4 p-6">
                  <FileVideo className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{capturedFiles.videos.length}</p>
                    <p className="text-sm text-muted-foreground">Vídeos Gravados</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center space-x-4 p-6">
                  <Settings className="w-8 h-8 text-primary" />
                  <div>
                    <Badge variant={testeCompleto ? "default" : "secondary"}>
                      {testeCompleto ? "Dispositivos OK" : "Aguardando Teste"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Status dos Dispositivos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <TesteDispositivos onTesteCompleto={handleTesteCompleto} />
            
            {testeCompleto && (
              <Alert className="border-success bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Teste de dispositivos concluído com sucesso! Você pode prosseguir para testar as funcionalidades de câmera.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fotos capturadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileImage className="w-5 h-5" />
                    <span>Fotos Capturadas ({capturedFiles.photos.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {capturedFiles.photos.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <FileImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma foto capturada ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {capturedFiles.photos.map((photo, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <img
                            src={photo.url}
                            alt={`Foto ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <p className="font-medium">Foto {index + 1}</p>
                            <p className="text-sm text-muted-foreground">
                              {photo.timestamp.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(photo.blob.size)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(photo.blob, `foto-medica-${Date.now()}-${index + 1}.jpg`)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vídeos gravados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileVideo className="w-5 h-5" />
                    <span>Vídeos Gravados ({capturedFiles.videos.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {capturedFiles.videos.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <FileVideo className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum vídeo gravado ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {capturedFiles.videos.map((video, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <video
                            src={video.url}
                            className="w-16 h-16 object-cover rounded border"
                            controls
                            muted
                          />
                          <div className="flex-1">
                            <p className="font-medium">Vídeo {index + 1}</p>
                            <p className="text-sm text-muted-foreground">
                              {video.timestamp.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(video.blob.size)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(video.blob, `video-medico-${Date.now()}-${index + 1}.webm`)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}