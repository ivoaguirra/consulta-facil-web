import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConsultaData {
  id: string;
  medico_id: string;
  paciente_id: string;
  status: string;
}

async function generateRoomHash(consultaId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(consultaId + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização obrigatório' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      // Extract consultaId from URL
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const consultaId = pathParts[pathParts.length - 1];

      if (!consultaId || consultaId === 'index.ts') {
        return new Response(
          JSON.stringify({ error: 'ID da consulta é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Gerando sala para consulta:', consultaId, 'usuário:', user.id);

      // Verify if user has access to this consultation
      const { data: consulta, error: consultaError } = await supabase
        .from('agendamentos')
        .select('id, medico_id, paciente_id, status')
        .eq('id', consultaId)
        .single();

      if (consultaError || !consulta) {
        console.error('Consulta não encontrada:', consultaError);
        return new Response(
          JSON.stringify({ error: 'Consulta não encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user is either the doctor or patient for this consultation
      if (consulta.medico_id !== user.id && consulta.paciente_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Acesso negado para esta consulta' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate unique room name
      const roomHash = await generateRoomHash(consultaId);
      const nomeSala = `consulta-${roomHash}`;
      const urlSala = `https://meet.jit.si/${nomeSala}`;

      // Get user profile for display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single();

      const displayName = profile?.nome || user.email?.split('@')[0] || 'Usuário';

      const configSala = {
        roomName: nomeSala,
        width: '100%',
        height: '100%',
        parentNode: null,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          disableInviteFunctions: false,
          doNotStoreRoom: true,
          enableNoisyMicDetection: true,
        },
        interfaceConfigOverwrite: {
          BRAND_WATERMARK_LINK: '',
          SHOW_BRAND_WATERMARK: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#474747',
          TOOLBAR_TIMEOUT: 4000,
          INITIAL_TOOLBAR_TIMEOUT: 20000,
          TOOLBAR_ALWAYS_VISIBLE: false,
          DEFAULT_LANGUAGE: 'pt-BR',
        },
        userInfo: {
          displayName: displayName,
        }
      };

      const response = {
        consultaId,
        nomeSala,
        urlSala,
        config: configSala,
        createdAt: new Date().toISOString(),
        userId: user.id,
        userName: displayName
      };

      console.log('Sala gerada com sucesso:', nomeSala);

      return new Response(
        JSON.stringify(response),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro interno:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});