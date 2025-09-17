import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Maximize, 
  Settings,
  Circle
} from 'lucide-react';

interface CameraPreviewProps {
  stream: MediaStream | null;
  isRecording?: boolean;
  className?: string;
  showControls?: boolean;
  onFullscreen?: () => void;
  onSettings?: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  stream,
  isRecording = false,
  className = "",
  showControls = true,
  onFullscreen,
  onSettings
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
    onFullscreen?.();
  };

  const getVideoStats = () => {
    if (!stream) return null;
    
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return null;
    
    const settings = videoTrack.getSettings();
    return {
      width: settings.width,
      height: settings.height,
      frameRate: settings.frameRate,
      deviceId: settings.deviceId
    };
  };

  const stats = getVideoStats();

  return (
    <Card className={`${className} relative overflow-hidden`}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="bg-muted aspect-video flex items-center justify-center overflow-hidden">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Sem sinal de vídeo</p>
              </div>
            )}
          </div>

          {/* Overlay com controles */}
          {showControls && stream && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
              {/* Controles superiores */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {isRecording && (
                    <Badge variant="destructive" className="bg-red-600">
                      <Circle className="w-2 h-2 mr-1 fill-current animate-pulse" />
                      Gravando
                    </Badge>
                  )}
                  {stats && (
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {stats.width}x{stats.height} @ {Math.round(stats.frameRate || 30)}fps
                    </Badge>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {onSettings && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 text-white hover:bg-black/70"
                      onClick={onSettings}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Indicadores de qualidade */}
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas para processamento de imagem (oculto) */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width={1280}
          height={720}
        />
      </CardContent>
    </Card>
  );
};