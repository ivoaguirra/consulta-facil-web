import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ConsultaRequest {
  consultaId: string;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const consultaId = url.pathname.split('/').pop();

      if (!consultaId) {
        return new Response(
          JSON.stringify({ error: 'ID da consulta é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Gerar hash único para a sala baseado no ID da consulta
      const encoder = new TextEncoder();
      const data = encoder.encode(consultaId);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Usar apenas os primeiros 16 caracteres para manter o nome da sala limpo
      const salaHash = hashHex.substring(0, 16);
      const nomeSala = `telemed-${salaHash}`;
      
      // URL da sala Jitsi Meet
      const urlSala = `https://meet.jit.si/${nomeSala}`;
      
      // Configurações da sala
      const configSala = {
        roomName: nomeSala,
        subject: `Consulta TeleMed - ${consultaId}`,
        userInfo: {
          displayName: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
        },
        configOverwrite: {
          startAudioOnly: false,
          enableWelcomePage: false,
          prejoinPageEnabled: true,
          disableThirdPartyRequests: true,
          defaultLanguage: 'pt',
          enableClosePage: false,
          toolbarButtons: [
            'microphone',
            'camera',
            'desktop',
            'fullscreen',
            'hangup',
            'chat',
            'raisehand',
            'settings'
          ]
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#1a1a1a',
          TOOLBAR_TIMEOUT: 4000,
          INITIAL_TOOLBAR_TIMEOUT: 20000,
          TOOLBAR_ALWAYS_VISIBLE: false,
          DISABLE_VIDEO_BACKGROUND: false,
          LANG_DETECTION: true,
          INVITATION_POWERED_BY: false,
        }
      };

      return new Response(
        JSON.stringify({
          consultaId,
          nomeSala,
          urlSala,
          config: configSala,
          createdAt: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na função gerar-sala-jitsi:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})