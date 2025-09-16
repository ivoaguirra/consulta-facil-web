import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText,
  Plus,
  Eye,
  Edit,
  Calendar,
  User,
  Stethoscope,
  Clipboard,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProntuarioItem {
  id: string;
  pacienteNome: string;
  medicoNome: string;
  consultaData: string;
  especialidade: string;
  anamnese: string;
  exameGeral: string;
  hipoteseDiagnostica: string;
  condutaAdotada: string;
  prescricoes: string[];
  observacoes: string;
  createdAt: string;
}

const mockProntuarios: ProntuarioItem[] = [
  {
    id: '1',
    pacienteNome: 'Maria Santos',
    medicoNome: 'Dr. João Silva',
    consultaData: '2024-03-14T10:00:00',
    especialidade: 'Cardiologia',
    anamnese: 'Paciente relata dor no peito há 3 dias, com irradiação para braço esquerdo. Nega dispneia, mas refere palpitações eventuais.',
    exameGeral: 'PA: 140/90 mmHg, FC: 85 bpm, FR: 16 irpm. Ausculta cardíaca com B1 e B2 normofonéticas, sem sopros.',
    hipoteseDiagnostica: 'Síndrome coronariana aguda a esclarecer',
    condutaAdotada: 'Solicitado ECG e dosagem de troponinas. Orientado repouso e retorno em 48h.',
    prescricoes: ['AAS 100mg 1x/dia', 'Atorvastatina 20mg 1x/dia'],
    observacoes: 'Paciente orientada sobre sinais de alarme. Retorno agendado.',
    createdAt: '2024-03-14T10:30:00',
  },
  {
    id: '2',
    pacienteNome: 'Pedro Costa',
    medicoNome: 'Dr. João Silva',
    consultaData: '2024-03-13T14:30:00',
    especialidade: 'Cardiologia',
    anamnese: 'Retorno para avaliação de exames. Paciente assintomático.',
    exameGeral: 'PA: 120/80 mmHg, FC: 72 bpm. Exame físico normal.',
    hipoteseDiagnostica: 'Hipertensão arterial controlada',
    condutaAdotada: 'Manter medicação atual. Retorno em 3 meses.',
    prescricoes: ['Losartana 50mg 1x/dia', 'Hidroclorotiazida 25mg 1x/dia'],
    observacoes: 'Paciente aderente ao tratamento.',
    createdAt: '2024-03-13T15:00:00',
  },
];

export const Prontuarios: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prontuarios, setProntuarios] = useState<ProntuarioItem[]>(mockProntuarios);
  const [prontuarioSelecionado, setProntuarioSelecionado] = useState<ProntuarioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    anamnese: '',
    exameGeral: '',
    hipoteseDiagnostica: '',
    condutaAdotada: '',
    prescricoes: '',
    observacoes: '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoProntuario: ProntuarioItem = {
      id: Date.now().toString(),
      pacienteNome: 'Paciente Exemplo', // Em produção, vir da consulta
      medicoNome: user.nome,
      consultaData: new Date().toISOString(),
      especialidade: user.especialidade || 'Clínica Geral',
      anamnese: formData.anamnese,
      exameGeral: formData.exameGeral,
      hipoteseDiagnostica: formData.hipoteseDiagnostica,
      condutaAdotada: formData.condutaAdotada,
      prescricoes: formData.prescricoes.split('\n').filter(p => p.trim()),
      observacoes: formData.observacoes,
      createdAt: new Date().toISOString(),
    };

    setProntuarios(prev => [novoProntuario, ...prev]);
    setShowForm(false);
    setFormData({
      anamnese: '',
      exameGeral: '',
      hipoteseDiagnostica: '',
      condutaAdotada: '',
      prescricoes: '',
      observacoes: '',
    });

    toast({
      title: 'Prontuário criado!',
      description: 'O prontuário foi salvo com sucesso.',
    });
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prontuários</h1>
          <p className="text-muted-foreground">
            {user.role === 'paciente' && 'Visualize seu histórico médico'}
            {user.role === 'medico' && 'Gerencie prontuários dos seus pacientes'}
            {user.role === 'clinica' && 'Acompanhe todos os prontuários da clínica'}
          </p>
        </div>
        
        {user.role === 'medico' && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Prontuário
          </Button>
        )}
      </div>

      {/* Formulário de novo prontuário */}
      {showForm && user.role === 'medico' && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Prontuário</CardTitle>
            <CardDescription>
              Preencha as informações da consulta realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="anamnese">Anamnese</Label>
                <Textarea
                  id="anamnese"
                  placeholder="História clínica do paciente, queixas principais, história da doença atual..."
                  value={formData.anamnese}
                  onChange={(e) => setFormData(prev => ({ ...prev, anamnese: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exameGeral">Exame Físico Geral</Label>
                <Textarea
                  id="exameGeral"
                  placeholder="Sinais vitais, aspectos gerais, exame por sistemas..."
                  value={formData.exameGeral}
                  onChange={(e) => setFormData(prev => ({ ...prev, exameGeral: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hipoteseDiagnostica">Hipótese Diagnóstica</Label>
                  <Textarea
                    id="hipoteseDiagnostica"
                    placeholder="Diagnóstico principal e diagnósticos diferenciais..."
                    value={formData.hipoteseDiagnostica}
                    onChange={(e) => setFormData(prev => ({ ...prev, hipoteseDiagnostica: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condutaAdotada">Conduta Adotada</Label>
                  <Textarea
                    id="condutaAdotada"
                    placeholder="Tratamento prescrito, orientações, exames solicitados..."
                    value={formData.condutaAdotada}
                    onChange={(e) => setFormData(prev => ({ ...prev, condutaAdotada: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescricoes">Prescrições (uma por linha)</Label>
                <Textarea
                  id="prescricoes"
                  placeholder="Ex: Paracetamol 500mg 8/8h por 3 dias"
                  value={formData.prescricoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescricoes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Gerais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais, orientações especiais..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar Prontuário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de prontuários */}
      <div className="space-y-4">
        {prontuarios.map((prontuario) => (
          <Card key={prontuario.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatDateTime(prontuario.consultaData)}</span>
                    </div>
                    <Badge variant="outline">{prontuario.especialidade}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{prontuario.pacienteNome}</p>
                        <p className="text-sm text-muted-foreground">Paciente</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{prontuario.medicoNome}</p>
                        <p className="text-sm text-muted-foreground">Médico responsável</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Hipótese Diagnóstica:</p>
                    <p className="text-sm text-muted-foreground">{prontuario.hipoteseDiagnostica}</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setProntuarioSelecionado(prontuario)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Prontuário Médico</DialogTitle>
                      </DialogHeader>
                      {prontuarioSelecionado && (
                        <div className="space-y-6">
                          {/* Cabeçalho do prontuário */}
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Paciente: </span>
                                <span>{prontuarioSelecionado.pacienteNome}</span>
                              </div>
                              <div>
                                <span className="font-medium">Médico: </span>
                                <span>{prontuarioSelecionado.medicoNome}</span>
                              </div>
                              <div>
                                <span className="font-medium">Data da Consulta: </span>
                                <span>{formatDateTime(prontuarioSelecionado.consultaData)}</span>
                              </div>
                              <div>
                                <span className="font-medium">Especialidade: </span>
                                <span>{prontuarioSelecionado.especialidade}</span>
                              </div>
                            </div>
                          </div>

                          {/* Seções do prontuário */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Clipboard className="w-4 h-4 mr-2" />
                                Anamnese
                              </h4>
                              <p className="text-sm bg-muted/50 p-3 rounded">
                                {prontuarioSelecionado.anamnese}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 flex items-center">
                                <Stethoscope className="w-4 h-4 mr-2" />
                                Exame Físico Geral
                              </h4>
                              <p className="text-sm bg-muted/50 p-3 rounded">
                                {prontuarioSelecionado.exameGeral}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Hipótese Diagnóstica
                                </h4>
                                <p className="text-sm bg-muted/50 p-3 rounded">
                                  {prontuarioSelecionado.hipoteseDiagnostica}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Conduta Adotada</h4>
                                <p className="text-sm bg-muted/50 p-3 rounded">
                                  {prontuarioSelecionado.condutaAdotada}
                                </p>
                              </div>
                            </div>

                            {prontuarioSelecionado.prescricoes.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Prescrições</h4>
                                <ul className="space-y-1">
                                  {prontuarioSelecionado.prescricoes.map((prescricao, index) => (
                                    <li key={index} className="text-sm bg-muted/50 p-2 rounded flex items-center">
                                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                      {prescricao}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {prontuarioSelecionado.observacoes && (
                              <div>
                                <h4 className="font-medium mb-2">Observações</h4>
                                <p className="text-sm bg-muted/50 p-3 rounded">
                                  {prontuarioSelecionado.observacoes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                            Prontuário criado em {formatDateTime(prontuarioSelecionado.createdAt)}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {user.role === 'medico' && (
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {prontuarios.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum prontuário encontrado</h3>
              <p className="text-muted-foreground">
                {user.role === 'paciente' && 'Seus prontuários médicos aparecerão aqui.'}
                {user.role === 'medico' && 'Crie prontuários para suas consultas.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};