import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ConclusaoConsultaProps {
  consultaId: string;
  duracaoConsulta: number; // em segundos
  onConcluir: (dados: {
    observacoesMedico?: string;
    observacoesPaciente?: string;
    problemasTecnicos?: string;
    qualidadeChamada: number;
  }) => void;
  onCancelar: () => void;
}

export function ConclusaoConsulta({ 
  consultaId, 
  duracaoConsulta, 
  onConcluir, 
  onCancelar 
}: ConclusaoConsultaProps) {
  const { user } = useAuth();
  const [observacoesMedico, setObservacoesMedico] = useState('');
  const [observacoesPaciente, setObservacoesPaciente] = useState('');
  const [problemasTecnicos, setProblemasTecnicos] = useState('');
  const [qualidadeChamada, setQualidadeChamada] = useState('5');
  const [loading, setLoading] = useState(false);

  const formatarDuracao = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const handleConcluir = async () => {
    setLoading(true);
    try {
      await onConcluir({
        observacoesMedico: observacoesMedico.trim() || undefined,
        observacoesPaciente: observacoesPaciente.trim() || undefined,
        problemasTecnicos: problemasTecnicos.trim() || undefined,
        qualidadeChamada: parseInt(qualidadeChamada)
      });
    } finally {
      setLoading(false);
    }
  };

  // Determinar se é médico baseado no contexto de auth
  const isMedico = user?.email?.includes('medico') || false; // Simplificado para demo

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle>Finalizar Consulta</CardTitle>
          </div>
          <CardDescription>
            Adicione suas observações sobre a consulta realizada
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Resumo da consulta */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Duração da consulta:</span>
              <span>{formatarDuracao(duracaoConsulta)}</span>
            </div>
          </div>

          {/* Observações do médico */}
          {isMedico && (
            <div className="space-y-2">
              <Label htmlFor="observacoes-medico">Observações do Médico</Label>
              <Textarea
                id="observacoes-medico"
                placeholder="Anamnese, diagnóstico, tratamento recomendado, próximos passos..."
                value={observacoesMedico}
                onChange={(e) => setObservacoesMedico(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Observações do paciente */}
          <div className="space-y-2">
            <Label htmlFor="observacoes-paciente">
              {isMedico ? 'Observações do Paciente' : 'Suas Observações'}
            </Label>
            <Textarea
              id="observacoes-paciente"
              placeholder="Como se sentiu durante a consulta, dúvidas, comentários..."
              value={observacoesPaciente}
              onChange={(e) => setObservacoesPaciente(e.target.value)}
              rows={3}
            />
          </div>

          {/* Problemas técnicos */}
          <div className="space-y-2">
            <Label htmlFor="problemas-tecnicos">Problemas Técnicos (se houver)</Label>
            <Textarea
              id="problemas-tecnicos"
              placeholder="Descreva qualquer problema de conexão, áudio ou vídeo..."
              value={problemasTecnicos}
              onChange={(e) => setProblemasTecnicos(e.target.value)}
              rows={2}
            />
          </div>

          {/* Avaliação da qualidade */}
          <div className="space-y-3">
            <Label>Qualidade da Chamada</Label>
            <RadioGroup value={qualidadeChamada} onValueChange={setQualidadeChamada}>
              <div className="flex flex-col space-y-2">
                {[
                  { value: '5', label: 'Excelente', icon: '⭐⭐⭐⭐⭐' },
                  { value: '4', label: 'Boa', icon: '⭐⭐⭐⭐' },
                  { value: '3', label: 'Regular', icon: '⭐⭐⭐' },
                  { value: '2', label: 'Ruim', icon: '⭐⭐' },
                  { value: '1', label: 'Muito Ruim', icon: '⭐' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`quality-${option.value}`} />
                    <Label htmlFor={`quality-${option.value}`} className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancelar}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConcluir}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Finalizando...' : 'Finalizar Consulta'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}