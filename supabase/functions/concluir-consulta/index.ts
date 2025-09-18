import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConcluirConsultaRequest {
  consultaId: string;
  duracaoMinutos: number;
  observacoesMedico?: string;
  observacoesPaciente?: string;
  problemasTecnicos?: string;
  qualidadeChamada?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { consultaId, duracaoMinutos, observacoesMedico, observacoesPaciente, problemasTecnicos, qualidadeChamada }: ConcluirConsultaRequest = await req.json();

    console.log('Concluindo consulta:', { consultaId, userId: user.id, duracaoMinutos });

    // Verificar se o usuário tem permissão para esta consulta
    const { data: consulta, error: consultaError } = await supabaseClient
      .from('consultas')
      .select('*')
      .eq('id', consultaId)
      .or(`paciente_id.eq.${user.id},medico_id.eq.${user.id}`)
      .single();

    if (consultaError || !consulta) {
      console.error('Consulta não encontrada ou sem permissão:', consultaError);
      return new Response(
        JSON.stringify({ error: 'Consulta não encontrada ou sem permissão' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Atualizar consulta para status concluída
    const { data: updatedConsulta, error: updateError } = await supabaseClient
      .from('consultas')
      .update({
        status: 'concluida',
        data_fim: new Date().toISOString(),
        duracao_minutos: duracaoMinutos,
        observacoes_medico: observacoesMedico,
        observacoes_paciente: observacoesPaciente,
        problemas_tecnicos: problemasTecnicos,
        qualidade_chamada: qualidadeChamada,
        updated_at: new Date().toISOString()
      })
      .eq('id', consultaId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar consulta:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao concluir consulta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Consulta concluída com sucesso:', updatedConsulta);

    return new Response(
      JSON.stringify({ 
        success: true, 
        consulta: updatedConsulta,
        message: 'Consulta concluída com sucesso'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in concluir-consulta function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);