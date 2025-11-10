import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor, 
  PhoneOff,
  Settings,
  Maximize,
  Minimize,
  Users
} from 'lucide-react';
import { SalaJitsi } from '@/hooks/useJitsiMeet';
import { ENV } from '@/lib/env';

interface JitsiMeetComponentProps {
  sala: SalaJitsi;
  onDesconectar?: () => void;
  onErro?: (error: string) => void;
  className?: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({
  sala,
  onDesconectar,
  onErro,
  className = ""
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Carregar script do Jitsi Meet se ainda não estiver carregado
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initializeJitsi();
        return;
      }

      const script = document.createElement('script');
      script.src = ENV.JITSI_EXTERNAL_API_URL;
      script.async = true;
      script.onload = initializeJitsi;
      script.onerror = () => {
        setIsLoading(false);
        onErro?.('Erro ao carregar Jitsi Meet');
      };
      document.head.appendChild(script);
    };

    const initializeJitsi = () => {
      if (!jitsiContainerRef.current) return;

      try {
        const options = {
          roomName: sala.nomeSala,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            ...sala.config.configOverwrite,
            // iOS compatibility
            disableDeepLinking: true,
            disableAudioLevels: false,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
          },
          interfaceConfigOverwrite: {
            ...sala.config.interfaceConfigOverwrite,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            DEFAULT_BACKGROUND: '#1a1a1a',
          },
          userInfo: sala.config.userInfo,
        };

        apiRef.current = new window.JitsiMeetExternalAPI(ENV.JITSI_DOMAIN, options);

        // Eventos da API
        apiRef.current.addEventListeners({
          readyToClose: () => {
            onDesconectar?.();
          },
          participantJoined: () => {
            updateParticipantCount();
          },
          participantLeft: () => {
            updateParticipantCount();
          },
          videoConferenceJoined: () => {
            setIsLoading(false);
            updateParticipantCount();
          },
          videoConferenceLeft: () => {
            onDesconectar?.();
          },
          audioMuteStatusChanged: (event: any) => {
            setIsAudioMuted(event.muted);
          },
          videoMuteStatusChanged: (event: any) => {
            setIsVideoMuted(event.muted);
          },
        });

      } catch (error) {
        console.error('Erro ao inicializar Jitsi:', error);
        setIsLoading(false);
        onErro?.('Erro ao conectar à videoconferência');
      }
    };

    const updateParticipantCount = () => {
      if (apiRef.current) {
        const count = apiRef.current.getNumberOfParticipants();
        setParticipantCount(count);
      }
    };

    loadJitsiScript();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [sala, onDesconectar, onErro]);

  const toggleAudio = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo');
    }
  };

  const toggleScreenShare = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleShareScreen');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      jitsiContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const hangUp = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }
    onDesconectar?.();
  };

  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Conectando à videoconferência...</p>
            <p className="text-sm text-muted-foreground">Sala: {sala.nomeSala}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} relative overflow-hidden`}>
      <CardContent className="p-0">
        {/* Header com informações */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-600 text-white">
              <Video className="w-3 h-3 mr-1" />
              Ao Vivo
            </Badge>
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              <Users className="w-3 h-3 mr-1" />
              {participantCount} participante{participantCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Container do Jitsi Meet */}
        <div 
          ref={jitsiContainerRef} 
          className="w-full h-96 bg-gray-900"
          style={{ minHeight: '400px' }}
        >
          {/* iOS workaround - elemento de vídeo para playsInline */}
          <video 
            autoPlay 
            playsInline 
            muted 
            style={{ display: 'none' }}
            aria-hidden="true"
          />
        </div>

        {/* Controles personalizados */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant={isAudioMuted ? "destructive" : "secondary"}
              className="bg-black/50 hover:bg-black/70 border border-white/20"
              onClick={toggleAudio}
            >
              {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant={isVideoMuted ? "destructive" : "secondary"}
              className="bg-black/50 hover:bg-black/70 border border-white/20"
              onClick={toggleVideo}
            >
              {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/50 hover:bg-black/70 border border-white/20"
              onClick={toggleScreenShare}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={hangUp}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};