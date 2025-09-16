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
  Clock, 
  User, 
  Calendar,
  Pill,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medicamento {
  id: string;
  nome: string;
  concentracao: string;
  forma: string;
  quantidade: string;
  posologia: string;
  duracao: string;
  observacoes?: string;
}

interface Receita {
  id: string;
  pacienteNome: string;
  pacienteCpf: string;
  medicoNome: string;
  medicoCrm: string;
  especialidade: string;
  dataEmissao: string;
  medicamentos: Medicamento[];
  observacoesGerais?: string;
  status: 'rascunho' | 'emitida' | 'enviada';
  consultaId?: string;
}

interface ReceituarioDigitalProps {
  consultaId?: string;
  pacienteNome?: string;
  pacienteCpf?: string;
  medicoNome?: string;
  medicoCrm?: string;
  especialidade?: string;
  onSave?: (receita: Receita) => void;
  onSend?: (receita: Receita) => void;
}

const formasFarmaceuticas = [
  'Comprimido',
  'Cápsula',
  'Solução oral',
  'Suspensão oral',
  'Gotas',
  'Xarope',
  'Pomada',
  'Creme',
  'Gel',
  'Injeção',
  'Supositório',
  'Adesivo transdérmico'
];

export const ReceituarioDigital: React.FC<ReceituarioDigitalProps> = ({
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
  const [receita, setReceita] = useState<Receita>({
    id: '',
    pacienteNome,
    pacienteCpf,
    medicoNome,
    medicoCrm,
    especialidade,
    dataEmissao: new Date().toISOString(),
    medicamentos: [],
    status: 'rascunho',
    consultaId
  });

  const [novoMedicamento, setNovoMedicamento] = useState<Partial<Medicamento>>({
    nome: '',
    concentracao: '',
    forma: '',
    quantidade: '',
    posologia: '',
    duracao: '',
    observacoes: ''
  });

  const [dialogAberto, setDialogAberto] = useState(false);

  const adicionarMedicamento = () => {
    if (!novoMedicamento.nome || !novoMedicamento.posologia) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome do medicamento e posologia são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    const medicamento: Medicamento = {
      id: Date.now().toString(),
      nome: novoMedicamento.nome!,
      concentracao: novoMedicamento.concentracao || '',
      forma: novoMedicamento.forma || '',
      quantidade: novoMedicamento.quantidade || '',
      posologia: novoMedicamento.posologia!,
      duracao: novoMedicamento.duracao || '',
      observacoes: novoMedicamento.observacoes || ''
    };

    setReceita(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, medicamento]
    }));

    setNovoMedicamento({
      nome: '',
      concentracao: '',
      forma: '',
      quantidade: '',
      posologia: '',
      duracao: '',
      observacoes: ''
    });

    setDialogAberto(false);
    
    toast({
      title: 'Medicamento adicionado',
      description: 'O medicamento foi incluído na receita.',
    });
  };

  const removerMedicamento = (id: string) => {
    setReceita(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter(med => med.id !== id)
    }));
    
    toast({
      title: 'Medicamento removido',
      description: 'O medicamento foi removido da receita.',
    });
  };

  const salvarReceita = () => {
    if (receita.medicamentos.length === 0) {
      toast({
        title: 'Receita vazia',
        description: 'Adicione pelo menos um medicamento à receita.',
        variant: 'destructive'
      });
      return;
    }

    const receitaAtualizada = {
      ...receita,
      id: receita.id || Date.now().toString(),
      status: 'emitida' as const
    };

    setReceita(receitaAtualizada);
    onSave?.(receitaAtualizada);
    
    toast({
      title: 'Receita salva!',
      description: 'A receita foi salva com sucesso.',
    });
  };

  const enviarReceita = () => {
    if (receita.status !== 'emitida') {
      salvarReceita();
    }

    const receitaAtualizada = {
      ...receita,
      status: 'enviada' as const
    };

    setReceita(receitaAtualizada);
    onSend?.(receitaAtualizada);
    
    toast({
      title: 'Receita enviada!',
      description: 'A receita foi enviada para o paciente.',
    });
  };

  const integrarMemed = () => {
    // Placeholder para integração com Memed
    toast({
      title: 'Integrando com Memed',
      description: 'Esta funcionalidade será implementada com a API da Memed.',
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

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Receituário Digital</span>
              </CardTitle>
              <CardDescription>
                Emisão de receitas médicas digitais
              </CardDescription>
            </div>
            {getStatusBadge(receita.status)}
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
                  <Label>Nome do Paciente</Label>
                  <Input 
                    value={receita.pacienteNome}
                    onChange={(e) => setReceita(prev => ({ ...prev, pacienteNome: e.target.value }))}
                    placeholder="Nome completo do paciente"
                  />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input 
                    value={receita.pacienteCpf}
                    onChange={(e) => setReceita(prev => ({ ...prev, pacienteCpf: e.target.value }))}
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
                    value={receita.medicoNome}
                    onChange={(e) => setReceita(prev => ({ ...prev, medicoNome: e.target.value }))}
                    placeholder="Nome do médico"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>CRM</Label>
                    <Input 
                      value={receita.medicoCrm}
                      onChange={(e) => setReceita(prev => ({ ...prev, medicoCrm: e.target.value }))}
                      placeholder="CRM/UF"
                    />
                  </div>
                  <div>
                    <Label>Especialidade</Label>
                    <Input 
                      value={receita.especialidade}
                      onChange={(e) => setReceita(prev => ({ ...prev, especialidade: e.target.value }))}
                      placeholder="Especialidade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de Medicamentos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center space-x-2">
                <Pill className="w-4 h-4" />
                <span>Medicamentos Prescritos</span>
              </h4>
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Medicamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Medicamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Medicamento *</Label>
                        <Input 
                          value={novoMedicamento.nome}
                          onChange={(e) => setNovoMedicamento(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Paracetamol"
                        />
                      </div>
                      <div>
                        <Label>Concentração</Label>
                        <Input 
                          value={novoMedicamento.concentracao}
                          onChange={(e) => setNovoMedicamento(prev => ({ ...prev, concentracao: e.target.value }))}
                          placeholder="Ex: 500mg"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Forma Farmacêutica</Label>
                        <Select 
                          value={novoMedicamento.forma}
                          onValueChange={(value) => setNovoMedicamento(prev => ({ ...prev, forma: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar forma" />
                          </SelectTrigger>
                          <SelectContent>
                            {formasFarmaceuticas.map(forma => (
                              <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantidade</Label>
                        <Input 
                          value={novoMedicamento.quantidade}
                          onChange={(e) => setNovoMedicamento(prev => ({ ...prev, quantidade: e.target.value }))}
                          placeholder="Ex: 30 comprimidos"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Posologia *</Label>
                      <Input 
                        value={novoMedicamento.posologia}
                        onChange={(e) => setNovoMedicamento(prev => ({ ...prev, posologia: e.target.value }))}
                        placeholder="Ex: 1 comprimido de 8 em 8 horas"
                      />
                    </div>

                    <div>
                      <Label>Duração do Tratamento</Label>
                      <Input 
                        value={novoMedicamento.duracao}
                        onChange={(e) => setNovoMedicamento(prev => ({ ...prev, duracao: e.target.value }))}
                        placeholder="Ex: 7 dias"
                      />
                    </div>

                    <div>
                      <Label>Observações</Label>
                      <Textarea 
                        value={novoMedicamento.observacoes}
                        onChange={(e) => setNovoMedicamento(prev => ({ ...prev, observacoes: e.target.value }))}
                        placeholder="Observações sobre o medicamento"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setDialogAberto(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={adicionarMedicamento}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {receita.medicamentos.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Nenhum medicamento foi adicionado à receita ainda.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {receita.medicamentos.map((medicamento, index) => (
                  <Card key={medicamento.id} className="bg-card-elevated">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary">{index + 1}.</span>
                            <h5 className="font-medium">
                              {medicamento.nome}
                              {medicamento.concentracao && ` ${medicamento.concentracao}`}
                              {medicamento.forma && ` - ${medicamento.forma}`}
                            </h5>
                          </div>
                          <p className="text-sm font-medium">{medicamento.posologia}</p>
                          {medicamento.quantidade && (
                            <p className="text-sm text-muted-foreground">
                              Quantidade: {medicamento.quantidade}
                            </p>
                          )}
                          {medicamento.duracao && (
                            <p className="text-sm text-muted-foreground">
                              Duração: {medicamento.duracao}
                            </p>
                          )}
                          {medicamento.observacoes && (
                            <p className="text-sm text-muted-foreground italic">
                              {medicamento.observacoes}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removerMedicamento(medicamento.id)}
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

          {/* Observações Gerais */}
          <div>
            <Label>Observações Gerais</Label>
            <Textarea 
              value={receita.observacoesGerais}
              onChange={(e) => setReceita(prev => ({ ...prev, observacoesGerais: e.target.value }))}
              placeholder="Orientações gerais ao paciente"
              rows={4}
            />
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={salvarReceita} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar Receita
            </Button>
            
            <Button onClick={enviarReceita} className="bg-success hover:bg-success/90">
              <Send className="w-4 h-4 mr-2" />
              Enviar para Paciente
            </Button>

            <Button onClick={integrarMemed} variant="outline">
              <Pill className="w-4 h-4 mr-2" />
              Validar com Memed
            </Button>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>

            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>

          {/* Info sobre data/hora */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Data de Emissão: {new Date(receita.dataEmissao).toLocaleDateString('pt-BR')}</span>
            <Clock className="w-4 h-4 ml-4" />
            <span>{new Date(receita.dataEmissao).toLocaleTimeString('pt-BR')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};