import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  User, 
  FlaskConical,
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SolicitacaoExame } from '@/types/medical';

interface SolicitacaoExamesProps {
  consultaId?: string;
  pacienteNome?: string;
  pacienteCpf?: string;
  medicoNome?: string;
  medicoCrm?: string;
  especialidade?: string;
  onSave?: (solicitacao: SolicitacaoExame) => void;
  onSend?: (solicitacao: SolicitacaoExame) => void;
}

const tiposExame = [
  'laboratorial',
  'imagem',
  'funcional'
];

const niveisUrgencia = [
  { value: 'rotina', label: 'Rotina', color: 'default' },
  { value: 'urgente', label: 'Urgente', color: 'warning' },
  { value: 'emergencia', label: 'Emergência', color: 'destructive' }
];

const examesComuns = {
  laboratorial: [
    'Hemograma Completo',
    'Glicemia em Jejum',
    'Colesterol Total e Frações',
    'Triglicerídeos',
    'Ureia e Creatinina',
    'TGO/TGP',
    'TSH',
    'Exame de Urina Tipo I',
    'VHS',
    'PCR'
  ],
  imagem: [
    'Raio-X de Tórax',
    'Ultrassonografia Abdominal',
    'Tomografia Computadorizada',
    'Ressonância Magnética',
    'Ecocardiograma',
    'Ultrassonografia Doppler',
    'Mamografia',
    'Densitometria Óssea'
  ],
  funcional: [
    'Eletrocardiograma',
    'Teste Ergométrico',
    'Espirometria',
    'Eletroencefalograma',
    'Holter 24h',
    'MAPA',
    'Endoscopia Digestiva Alta',
    'Colonoscopia'
  ]
};

export const SolicitacaoExames: React.FC<SolicitacaoExamesProps> = ({
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
  const [solicitacao, setSolicitacao] = useState<SolicitacaoExame>({
    id: '',
    pacienteId: '',
    pacienteNome,
    pacienteCpf,
    medicoId: '',
    medicoNome,
    medicoCrm,
    especialidade,
    dataEmissao: new Date().toISOString().split('T')[0],
    exames: [],
    status: 'rascunho',
    consultaId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [novoExame, setNovoExame] = useState({
    nome: '',
    tipo: 'laboratorial' as 'laboratorial' | 'imagem' | 'funcional',
    justificativa: '',
    urgencia: 'rotina' as 'rotina' | 'urgente' | 'emergencia',
    preparo: ''
  });

  const [dialogAberto, setDialogAberto] = useState(false);

  const adicionarExame = () => {
    if (!novoExame.nome || !novoExame.justificativa) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome do exame e justificativa são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const exame = {
      id: Date.now().toString(),
      ...novoExame
    };

    setSolicitacao(prev => ({
      ...prev,
      exames: [...prev.exames, exame]
    }));

    setNovoExame({
      nome: '',
      tipo: 'laboratorial',
      justificativa: '',
      urgencia: 'rotina',
      preparo: ''
    });

    setDialogAberto(false);
    
    toast({
      title: 'Exame adicionado',
      description: 'O exame foi incluído na solicitação.',
    });
  };

  const removerExame = (id: string) => {
    setSolicitacao(prev => ({
      ...prev,
      exames: prev.exames.filter(exame => exame.id !== id)
    }));
    
    toast({
      title: 'Exame removido',
      description: 'O exame foi removido da solicitação.',
    });
  };

  const salvarSolicitacao = () => {
    if (solicitacao.exames.length === 0) {
      toast({
        title: 'Solicitação vazia',
        description: 'Adicione pelo menos um exame à solicitação.',
        variant: 'destructive'
      });
      return;
    }

    const solicitacaoAtualizada = {
      ...solicitacao,
      id: solicitacao.id || Date.now().toString(),
      status: 'emitida' as const,
      updatedAt: new Date().toISOString()
    };

    setSolicitacao(solicitacaoAtualizada);
    onSave?.(solicitacaoAtualizada);
    
    toast({
      title: 'Solicitação salva!',
      description: 'A solicitação de exames foi salva com sucesso.',
    });
  };

  const enviarSolicitacao = () => {
    if (solicitacao.status !== 'emitida') {
      salvarSolicitacao();
    }

    const solicitacaoAtualizada = {
      ...solicitacao,
      status: 'enviada' as const,
      updatedAt: new Date().toISOString()
    };

    setSolicitacao(solicitacaoAtualizada);
    onSend?.(solicitacaoAtualizada);
    
    toast({
      title: 'Solicitação enviada!',
      description: 'A solicitação foi enviada para o paciente.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'emitida':
        return <Badge variant="outline" className="text-warning">Emitida</Badge>;
      case 'enviada':
        return <Badge variant="outline" className="text-success">Enviada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgenciaBadge = (urgencia: string) => {
    const nivel = niveisUrgencia.find(n => n.value === urgencia);
    return (
      <Badge 
        variant={nivel?.color === 'destructive' ? 'destructive' : 'outline'}
        className={nivel?.color === 'warning' ? 'text-warning' : ''}
      >
        {nivel?.label || urgencia}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'laboratorial':
        return <FlaskConical className="w-4 h-4" />;
      case 'imagem':
        return <Eye className="w-4 h-4" />;
      case 'funcional':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5" />
                <span>Solicitação de Exames</span>
              </CardTitle>
              <CardDescription>
                Solicitação de exames laboratoriais e de imagem
              </CardDescription>
            </div>
            {getStatusBadge(solicitacao.status)}
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
                    value={solicitacao.pacienteNome}
                    onChange={(e) => setSolicitacao(prev => ({ ...prev, pacienteNome: e.target.value }))}
                    placeholder="Nome completo do paciente"
                  />
                </div>
                <div>
                  <Label>CPF *</Label>
                  <Input 
                    value={solicitacao.pacienteCpf}
                    onChange={(e) => setSolicitacao(prev => ({ ...prev, pacienteCpf: e.target.value }))}
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
                    value={solicitacao.medicoNome}
                    onChange={(e) => setSolicitacao(prev => ({ ...prev, medicoNome: e.target.value }))}
                    placeholder="Nome do médico"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>CRM</Label>
                    <Input 
                      value={solicitacao.medicoCrm}
                      onChange={(e) => setSolicitacao(prev => ({ ...prev, medicoCrm: e.target.value }))}
                      placeholder="CRM/UF"
                    />
                  </div>
                  <div>
                    <Label>Especialidade</Label>
                    <Input 
                      value={solicitacao.especialidade}
                      onChange={(e) => setSolicitacao(prev => ({ ...prev, especialidade: e.target.value }))}
                      placeholder="Especialidade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de Exames */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center space-x-2">
                <FlaskConical className="w-4 h-4" />
                <span>Exames Solicitados</span>
              </h4>
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Exame
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Exame</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Exame *</Label>
                        <Select 
                          value={novoExame.tipo}
                          onValueChange={(value: any) => setNovoExame(prev => ({ ...prev, tipo: value, nome: '' }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laboratorial">Laboratorial</SelectItem>
                            <SelectItem value="imagem">Imagem</SelectItem>
                            <SelectItem value="funcional">Funcional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nome do Exame *</Label>
                        <Select 
                          value={novoExame.nome}
                          onValueChange={(value) => setNovoExame(prev => ({ ...prev, nome: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar exame" />
                          </SelectTrigger>
                          <SelectContent>
                            {examesComuns[novoExame.tipo].map(exame => (
                              <SelectItem key={exame} value={exame}>{exame}</SelectItem>
                            ))}
                            <SelectItem value="outro">Outro (digite abaixo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {novoExame.nome === 'outro' && (
                      <div>
                        <Label>Nome Personalizado do Exame *</Label>
                        <Input 
                          value=""
                          onChange={(e) => setNovoExame(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Digite o nome do exame"
                        />
                      </div>
                    )}

                    <div>
                      <Label>Nível de Urgência</Label>
                      <Select 
                        value={novoExame.urgencia}
                        onValueChange={(value: any) => setNovoExame(prev => ({ ...prev, urgencia: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar urgência" />
                        </SelectTrigger>
                        <SelectContent>
                          {niveisUrgencia.map(nivel => (
                            <SelectItem key={nivel.value} value={nivel.value}>{nivel.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Justificativa Clínica *</Label>
                      <Textarea 
                        value={novoExame.justificativa}
                        onChange={(e) => setNovoExame(prev => ({ ...prev, justificativa: e.target.value }))}
                        placeholder="Justificativa médica para o exame"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Preparo Necessário</Label>
                      <Textarea 
                        value={novoExame.preparo}
                        onChange={(e) => setNovoExame(prev => ({ ...prev, preparo: e.target.value }))}
                        placeholder="Instruções de preparo para o paciente"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setDialogAberto(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={adicionarExame}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {solicitacao.exames.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum exame foi adicionado à solicitação ainda.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {solicitacao.exames.map((exame, index) => (
                  <Card key={exame.id} className="bg-card-elevated">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary">{index + 1}.</span>
                            {getTipoIcon(exame.tipo)}
                            <h5 className="font-medium">{exame.nome}</h5>
                            {getUrgenciaBadge(exame.urgencia)}
                          </div>
                          <p className="text-sm"><strong>Tipo:</strong> {exame.tipo}</p>
                          <p className="text-sm"><strong>Justificativa:</strong> {exame.justificativa}</p>
                          {exame.preparo && (
                            <p className="text-sm"><strong>Preparo:</strong> {exame.preparo}</p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removerExame(exame.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Laboratório Preferencial</Label>
              <Input 
                value={solicitacao.laboratorioPreferencial || ''}
                onChange={(e) => setSolicitacao(prev => ({ ...prev, laboratorioPreferencial: e.target.value }))}
                placeholder="Nome do laboratório (opcional)"
              />
            </div>
            <div>
              <Label>Data de Emissão</Label>
              <Input 
                type="date"
                value={solicitacao.dataEmissao}
                onChange={(e) => setSolicitacao(prev => ({ ...prev, dataEmissao: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Observações Gerais</Label>
            <Textarea 
              value={solicitacao.observacoes || ''}
              onChange={(e) => setSolicitacao(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais sobre os exames"
              rows={3}
            />
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={salvarSolicitacao} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar Solicitação
            </Button>
            
            <Button onClick={enviarSolicitacao} className="bg-success hover:bg-success/90">
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