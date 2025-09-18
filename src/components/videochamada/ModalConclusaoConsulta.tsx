import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ModalConclusaoConsultaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dados: DadosConclusao) => void;
  duracaoConsulta: number;
  isLoading?: boolean;
}

export interface DadosConclusao {
  observacoesMedico?: string;
  observacoesPaciente?: string;
  problemasTecnicos?: string;
  qualidadeChamada?: number;
}

export function ModalConclusaoConsulta({
  isOpen,
  onClose,
  onConfirm,
  duracaoConsulta,
  isLoading = false
}: ModalConclusaoConsultaProps) {
  const { user } = useAuth();
  const [observacoesMedico, setObservacoesMedico] = useState('');
  const [observacoesPaciente, setObservacoesPaciente] = useState('');
  const [problemasTecnicos, setProblemasTecnicos] = useState('');
  const [qualidadeChamada, setQualidadeChamada] = useState<number>(5);

  const isMedico = user?.role === 'medico';
  
  const formatarDuracao = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const handleConfirmar = () => {
    const dados: DadosConclusao = {
      qualidadeChamada
    };

    if (observacoesMedico.trim()) dados.observacoesMedico = observacoesMedico.trim();
    if (observacoesPaciente.trim()) dados.observacoesPaciente = observacoesPaciente.trim();
    if (problemasTecnicos.trim()) dados.problemasTecnicos = problemasTecnicos.trim();

    onConfirm(dados);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Finalizar Consulta
          </DialogTitle>
          <DialogDescription>
            Adicione observações sobre a consulta antes de finalizar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo da consulta */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duração
                </span>
                <span className="font-medium">{formatarDuracao(duracaoConsulta)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Observações do médico */}
          {isMedico && (
            <div className="space-y-2">
              <Label htmlFor="observacoes-medico">Observações do Médico</Label>
              <Textarea
                id="observacoes-medico"
                placeholder="Diagnóstico, medicações, orientações para o paciente..."
                value={observacoesMedico}
                onChange={(e) => setObservacoesMedico(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Observações do paciente */}
          <div className="space-y-2">
            <Label htmlFor="observacoes-paciente">
              {isMedico ? 'Observações Adicionais' : 'Suas Observações'}
            </Label>
            <Textarea
              id="observacoes-paciente"
              placeholder={isMedico 
                ? "Observações adicionais sobre a consulta..." 
                : "Como foi sua experiência? Alguma dúvida ou comentário?"
              }
              value={observacoesPaciente}
              onChange={(e) => setObservacoesPaciente(e.target.value)}
              rows={2}
            />
          </div>

          {/* Problemas técnicos */}
          <div className="space-y-2">
            <Label htmlFor="problemas-tecnicos">Problemas Técnicos (opcional)</Label>
            <Textarea
              id="problemas-tecnicos"
              placeholder="Relatar problemas de áudio, vídeo ou conexão..."
              value={problemasTecnicos}
              onChange={(e) => setProblemasTecnicos(e.target.value)}
              rows={2}
            />
          </div>

          {/* Avaliação da qualidade */}
          <div className="space-y-2">
            <Label>Qualidade da Chamada</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  type="button"
                  onClick={() => setQualidadeChamada(estrela)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Star
                    className={`h-5 w-5 ${
                      estrela <= qualidadeChamada
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {qualidadeChamada === 1 && "Muito ruim"}
                {qualidadeChamada === 2 && "Ruim"}
                {qualidadeChamada === 3 && "Regular"}
                {qualidadeChamada === 4 && "Boa"}
                {qualidadeChamada === 5 && "Excelente"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={isLoading}>
            {isLoading ? 'Finalizando...' : 'Finalizar Consulta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}