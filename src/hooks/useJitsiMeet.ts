import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SalaJitsi {
  consultaId: string;
  nomeSala: string;
  urlSala: string;
  config: any;
  createdAt: string;
}

export interface JitsiMeetState {
  sala: SalaJitsi | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export const useJitsiMeet = () => {
  const [state, setState] = useState<JitsiMeetState>({
    sala: null,
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const gerarSalaJitsi = useCallback(async (consultaId: string): Promise<SalaJitsi | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(
        `https://qbsdpfachnqovopfqinj.supabase.co/functions/v1/gerar-sala-jitsi/${consultaId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar sala de videoconferência');
      }

      const sala = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        sala, 
        isLoading: false,
        error: null 
      }));

      return sala;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false,
        sala: null 
      }));
      console.error('Erro ao gerar sala Jitsi:', error);
      return null;
    }
  }, []);

  const conectarSala = useCallback((sala: SalaJitsi) => {
    setState(prev => ({ ...prev, isConnected: true, sala }));
  }, []);

  const desconectarSala = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isConnected: false,
      sala: null 
    }));
  }, []);

  const limparErro = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    gerarSalaJitsi,
    conectarSala,
    desconectarSala,
    limparErro,
  };
};