import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Save, 
  Send, 
  User, 
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Atestado } from '@/types/medical';

interface AtestadoDigitalProps {
  consultaId?: string;
  pacienteNome?: string;
  pacienteCpf?: string;
  medicoNome?: string;
  medicoCrm?: string;
  especialidade?: string;
  onSave?: (atestado: Atestado) => void;
  onSend?: (atestado: Atestado) => void;
}

const tiposAtestado = [
  { value: 'afastamento', label: 'Atestado de Afastamento' },
  { value: 'comparecimento', label: 'Atestado de Comparecimento' },
  { value: 'acompanhante', label: 'Atestado de Acompanhante' }
];

export const AtestadoDigital: React.FC<AtestadoDigitalProps> = ({
  consultaId,
  pacienteNome = '',
  pacienteCpf = '',
  medicoNome = '',
  medicoCrm = '',
  especialidade = '',
  onSave,
  onSend
}) => {
  const { toast } = useToast();
  const [atestado, setAtestado] = useState<Atestado>({
    id: '',
    pacienteId: '',
    pacienteNome,
    pacienteCpf,
    medicoId: '',
    medicoNome,
    medicoCrm,
    especialidade,
    dataEmissao: new Date().toISOString().split('T')[0],
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    diasAfastamento: 1,
    diagnostico: '',
    tipoAtestado: 'afastamento',
    status: 'rascunho',
    consultaId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const calcularDias = (inicio: string, fim: string) => {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    const diferenca = dataFim.getTime() - dataInicio.getTime();
    return Math.max(1, Math.ceil(diferenca / (1000 * 3600 * 24)) + 1);
  };

  const handleDataChange = (campo: 'dataInicio' | 'dataFim', valor: string) => {
    const novoAtestado = { ...atestado, [campo]: valor };
    
    if (novoAtestado.dataInicio && novoAtestado.dataFim) {
      novoAtestado.diasAfastamento = calcularDias(novoAtestado.dataInicio, novoAtestado.dataFim);
    }
    
    setAtestado(novoAtestado);
  };

  const salvarAtestado = () => {
    if (!atestado.diagnostico || !atestado.pacienteNome) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const atestadoAtualizado = {
      ...atestado,
      id: atestado.id || Date.now().toString(),
      status: 'emitido' as const,
      updatedAt: new Date().toISOString()
    };

    setAtestado(atestadoAtualizado);
    onSave?.(atestadoAtualizado);
    
    toast({
      title: 'Atestado salvo!',
      description: 'O atestado foi salvo com sucesso.',
    });
  };

  const enviarAtestado = () => {
    if (atestado.status !== 'emitido') {
      salvarAtestado();
    }

    const atestadoAtualizado = {
      ...atestado,
      status: 'enviado' as const,
      updatedAt: new Date().toISOString()
    };

    setAtestado(atestadoAtualizado);
    onSend?.(atestadoAtualizado);
    
    toast({
      title: 'Atestado enviado!',
      description: 'O atestado foi enviado para o paciente.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'emitido':
        return <Badge variant="outline" className="text-warning">Emitido</Badge>;
      case 'enviado':
        return <Badge variant="outline" className="text-success">Enviado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const gerarTextoAtestado = () => {
    const tipo = tiposAtestado.find(t => t.value === atestado.tipoAtestado)?.label || 'Atestado Médico';
    
    if (atestado.tipoAtestado === 'comparecimento') {
      return `Atesto que o(a) paciente ${atestado.pacienteNome}, portador(a) do CPF ${atestado.pacienteCpf}, compareceu à consulta médica em ${new Date(atestado.dataEmissao).toLocaleDateString('pt-BR')}.`;
    } else if (atestado.tipoAtestado === 'acompanhante') {
      return `Atesto que o(a) Sr.(a) ${atestado.pacienteNome}, portador(a) do CPF ${atestado.pacienteCpf}, necessita acompanhar paciente em tratamento médico no período de ${new Date(atestado.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(atestado.dataFim).toLocaleDateString('pt-BR')}.`;
    } else {
      return `Atesto que o(a) paciente ${atestado.pacienteNome}, portador(a) do CPF ${atestado.pacienteCpf}, deverá permanecer afastado(a) de suas atividades por ${atestado.diasAfastamento} dia(s), no período de ${new Date(atestado.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(atestado.dataFim).toLocaleDateString('pt-BR')}, devido ao diagnóstico: ${atestado.diagnostico}.`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Atestado Digital</span>
              </CardTitle>
              <CardDescription>
                Emissão de atestados médicos digitais
              </CardDescription>
            </div>
            {getStatusBadge(atestado.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados do Paciente e Médico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Dados do Paciente</span>
              </h4>
              <div className="space-y-2">
                <div>
                  <Label>Nome do Paciente *</Label>
                  <Input 
                    value={atestado.pacienteNome}
                    onChange={(e) => setAtestado(prev => ({ ...prev, pacienteNome: e.target.value }))}
                    placeholder="Nome completo do paciente"
                  />
                </div>
                <div>
                  <Label>CPF *</Label>
                  <Input 
                    value={atestado.pacienteCpf}
                    onChange={(e) => setAtestado(prev => ({ ...prev, pacienteCpf: e.target.value }))}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Dados do Médico</span>
              </h4>
              <div className="space-y-2">
                <div>
                  <Label>Nome do Médico</Label>
                  <Input 
                    value={atestado.medicoNome}
                    onChange={(e) => setAtestado(prev => ({ ...prev, medicoNome: e.target.value }))}
                    placeholder="Nome do médico"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>CRM</Label>
                    <Input 
                      value={atestado.medicoCrm}
                      onChange={(e) => setAtestado(prev => ({ ...prev, medicoCrm: e.target.value }))}
                      placeholder="CRM/UF"
                    />
                  </div>
                  <div>
                    <Label>Especialidade</Label>
                    <Input 
                      value={atestado.especialidade}
                      onChange={(e) => setAtestado(prev => ({ ...prev, especialidade: e.target.value }))}
                      placeholder="Especialidade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tipo e Dados do Atestado */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Dados do Atestado</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Atestado *</Label>
                <Select 
                  value={atestado.tipoAtestado}
                  onValueChange={(value: any) => setAtestado(prev => ({ ...prev, tipoAtestado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAtestado.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Data de Emissão</Label>
                <Input 
                  type="date"
                  value={atestado.dataEmissao}
                  onChange={(e) => setAtestado(prev => ({ ...prev, dataEmissao: e.target.value }))}
                />
              </div>
            </div>

            {atestado.tipoAtestado !== 'comparecimento' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Data de Início *</Label>
                  <Input 
                    type="date"
                    value={atestado.dataInicio}
                    onChange={(e) => handleDataChange('dataInicio', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Data de Fim *</Label>
                  <Input 
                    type="date"
                    value={atestado.dataFim}
                    onChange={(e) => handleDataChange('dataFim', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Dias de Afastamento</Label>
                  <Input 
                    type="number"
                    value={atestado.diasAfastamento}
                    onChange={(e) => setAtestado(prev => ({ ...prev, diasAfastamento: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
              </div>
            )}

            {atestado.tipoAtestado === 'afastamento' && (
              <div>
                <Label>CID-10</Label>
                <Input 
                  value={atestado.cid || ''}
                  onChange={(e) => setAtestado(prev => ({ ...prev, cid: e.target.value }))}
                  placeholder="Ex: M25.3"
                />
              </div>
            )}

            <div>
              <Label>Diagnóstico/Justificativa *</Label>
              <Textarea 
                value={atestado.diagnostico}
                onChange={(e) => setAtestado(prev => ({ ...prev, diagnostico: e.target.value }))}
                placeholder="Descreva o diagnóstico ou justificativa para o atestado"
                rows={3}
              />
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea 
                value={atestado.observacoes || ''}
                onChange={(e) => setAtestado(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Preview do Atestado */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview do Atestado</span>
            </h4>
            
            <Card className="bg-card-elevated">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-bold">ATESTADO MÉDICO</h3>
                  
                  <div className="text-sm space-y-2 text-left">
                    <p><strong>Médico:</strong> Dr.(a) {atestado.medicoNome}</p>
                    <p><strong>CRM:</strong> {atestado.medicoCrm} | <strong>Especialidade:</strong> {atestado.especialidade}</p>
                  </div>
                  
                  <div className="border-t border-b py-4 my-4">
                    <p className="text-justify leading-relaxed">
                      {gerarTextoAtestado()}
                    </p>
                  </div>
                  
                  {atestado.cid && (
                    <p className="text-sm"><strong>CID-10:</strong> {atestado.cid}</p>
                  )}
                  
                  {atestado.observacoes && (
                    <p className="text-sm"><strong>Observações:</strong> {atestado.observacoes}</p>
                  )}
                  
                  <div className="text-sm">
                    <p>{new Date(atestado.dataEmissao).toLocaleDateString('pt-BR')}</p>
                    <div className="mt-8 border-t pt-2">
                      <p>_________________________________</p>
                      <p>Dr.(a) {atestado.medicoNome}</p>
                      <p>CRM: {atestado.medicoCrm}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={salvarAtestado} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar Atestado
            </Button>
            
            <Button onClick={enviarAtestado} className="bg-success hover:bg-success/90">
              <Send className="w-4 h-4 mr-2" />
              Enviar para Paciente
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};