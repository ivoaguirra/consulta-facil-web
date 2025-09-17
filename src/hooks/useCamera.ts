import { useState, useRef, useCallback, useEffect } from 'react';

export interface CameraOptions {
  video?: {
    width?: number;
    height?: number;
    facingMode?: 'user' | 'environment';
    frameRate?: number;
  };
  audio?: boolean;
}

export interface CameraState {
  isActive: boolean;
  isRecording: boolean;
  stream: MediaStream | null;
  error: string | null;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
}

export const useCamera = (options: CameraOptions = {}) => {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isRecording: false,
    stream: null,
    error: null,
    devices: [],
    selectedDeviceId: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Buscar dispositivos disponíveis
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setState(prev => ({ ...prev, devices: videoDevices }));
      return videoDevices;
    } catch (error) {
      setState(prev => ({ ...prev, error: `Erro ao buscar dispositivos: ${error}` }));
      return [];
    }
  }, []);

  // Iniciar câmera
  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));

      const constraints: MediaStreamConstraints = {
        video: {
          width: options.video?.width || 1280,
          height: options.video?.height || 720,
          frameRate: options.video?.frameRate || 30,
          facingMode: options.video?.facingMode || 'user',
          ...(deviceId && { deviceId: { exact: deviceId } })
        },
        audio: options.audio || false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setState(prev => ({ 
        ...prev, 
        stream, 
        isActive: true,
        selectedDeviceId: deviceId || null
      }));

      return stream;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, error: `Erro ao iniciar câmera: ${errorMessage}` }));
      throw error;
    }
  }, [options]);

  // Parar câmera
  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState(prev => ({ 
      ...prev, 
      stream: null, 
      isActive: false, 
      isRecording: false 
    }));
  }, [state.stream]);

  // Capturar foto
  const capturePhoto = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !state.stream) {
        reject(new Error('Câmera não está ativa'));
        return;
      }

      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Erro ao criar contexto do canvas'));
        return;
      }

      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Erro ao capturar foto'));
        }
      }, 'image/jpeg', 0.9);
    });
  }, [state.stream]);

  // Iniciar gravação
  const startRecording = useCallback(() => {
    if (!state.stream) {
      setState(prev => ({ ...prev, error: 'Câmera não está ativa' }));
      return;
    }

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(state.stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      setState(prev => ({ ...prev, error: `Erro ao iniciar gravação: ${error}` }));
    }
  }, [state.stream]);

  // Parar gravação
  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('Gravação não está ativa'));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    });
  }, []);

  // Trocar câmera
  const switchCamera = useCallback(async (deviceId: string) => {
    if (state.isActive) {
      stopCamera();
      await new Promise(resolve => setTimeout(resolve, 100));
      await startCamera(deviceId);
    } else {
      await startCamera(deviceId);
    }
  }, [state.isActive, stopCamera, startCamera]);

  // Efeito para buscar dispositivos quando o componente monta
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  // Cleanup quando o componente desmonta
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state.stream]);

  return {
    ...state,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    startRecording,
    stopRecording,
    switchCamera,
    getDevices,
  };
};