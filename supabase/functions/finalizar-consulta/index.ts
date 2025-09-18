import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FinalizarConsultaRequest {
  consultaId: string;
  duracaoMinutos: number;
  observacoesMedico?: string;
  observacoesPaciente?: string;
  problemasTecnicos?: string;
  qualidadeChamada?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      consultaId,
      duracaoMinutos,
      observacoesMedico,
      observacoesPaciente,
      problemasTecnicos,
      qualidadeChamada
    }: FinalizarConsultaRequest = await req.json();

    console.log('Finalizando consulta:', { consultaId, duracaoMinutos, userId: user.id });

    // Verificar se a consulta existe e se o usuário tem permissão
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

    // Atualizar a consulta com os dados de finalização
    const updateData: any = {
      data_fim: new Date().toISOString(),
      duracao_minutos: duracaoMinutos,
      status: 'concluida'
    };

    // Adicionar observações se fornecidas
    if (observacoesMedico) updateData.observacoes_medico = observacoesMedico;
    if (observacoesPaciente) updateData.observacoes_paciente = observacoesPaciente;
    if (problemasTecnicos) updateData.problemas_tecnicos = problemasTecnicos;
    if (qualidadeChamada) updateData.qualidade_chamada = qualidadeChamada;

    const { data: consultaAtualizada, error: updateError } = await supabaseClient
      .from('consultas')
      .update(updateData)
      .eq('id', consultaId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar consulta:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao finalizar consulta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Atualizar agendamento relacionado se existir
    if (consulta.agendamento_id) {
      const { error: agendamentoError } = await supabaseClient
        .from('agendamentos')
        .update({ status: 'concluido' })
        .eq('id', consulta.agendamento_id);

      if (agendamentoError) {
        console.error('Erro ao atualizar agendamento:', agendamentoError);
        // Não retornar erro, pois a consulta já foi finalizada com sucesso
      }
    }

    console.log('Consulta finalizada com sucesso:', consultaAtualizada);

    return new Response(
      JSON.stringify({
        success: true,
        consulta: consultaAtualizada,
        message: 'Consulta finalizada com sucesso'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Erro na função finalizar-consulta:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});