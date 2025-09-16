import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Settings,
  Calendar,
  TrendingUp,
  Activity,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ValidadorCRM } from '@/components/validacao/ValidadorCRM';

interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
  consultasTotal: number;
  proximaConsulta?: string;
  dataAdmissao: string;
}

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  dataUltimaConsulta?: string;
  totalConsultas: number;
  medicoPreferencial?: string;
}

interface DadosClinica {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelTecnico: string;
  crmResponsavel: string;
}

const mockMedicos: Medico[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    crm: '123456/SP',
    especialidade: 'Cardiologia',
    telefone: '(11) 99999-9999',
    email: 'joao@clinica.com',
    status: 'ativo',
    consultasTotal: 145,
    proximaConsulta: '2024-03-15T14:30:00',
    dataAdmissao: '2022-01-15'
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    crm: '98765/SP',
    especialidade: 'Pediatria',
    telefone: '(11) 88888-8888',
    email: 'maria@clinica.com',
    status: 'ativo',
    consultasTotal: 203,
    proximaConsulta: '2024-03-15T16:00:00',
    dataAdmissao: '2021-06-10'
  }
];

const mockPacientes: Paciente[] = [
  {
    id: '1',
    nome: 'Ana Costa',
    cpf: '123.456.789-00',
    telefone: '(11) 77777-7777',
    email: 'ana@email.com',
    dataUltimaConsulta: '2024-03-10T10:00:00',
    totalConsultas: 8,
    medicoPreferencial: 'Dr. João Silva'
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    cpf: '987.654.321-00',
    telefone: '(11) 66666-6666',
    email: 'pedro@email.com',
    dataUltimaConsulta: '2024-03-12T14:30:00',
    totalConsultas: 5,
    medicoPreferencial: 'Dra. Maria Santos'
  }
];

export const Clinicas: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicos, setMedicos] = useState<Medico[]>(mockMedicos);
  const [pacientes, setPacientes] = useState<Paciente[]>(mockPacientes);
  const [novoMedicoDialog, setNovoMedicoDialog] = useState(false);
  const [dadosClinica, setDadosClinica] = useState<DadosClinica>({
    nome: 'Clínica TeleMed',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 3333-3333',
    email: 'contato@clinicatelemed.com.br',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    responsavelTecnico: 'Dr. João Silva',
    crmResponsavel: '123456/SP'
  });

  if (!user || user.role !== 'clinica') {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground">Esta área é exclusiva para administradores de clínicas.</p>
      </div>
    );
  }

  const estatisticas = {
    totalMedicos: medicos.length,
    medicosAtivos: medicos.filter(m => m.status === 'ativo').length,
    totalPacientes: pacientes.length,
    consultasHoje: 12,
    consultasSemana: 48,
    consultasMes: 187
  };

  const adicionarMedico = (dadosCRM: any) => {
    if (!dadosCRM) return;
    
    const novoMedico: Medico = {
      id: Date.now().toString(),
      nome: dadosCRM.nome,
      crm: `${dadosCRM.numero}/${dadosCRM.uf}`,
      especialidade: dadosCRM.especialidades[0] || 'Não informado',
      telefone: dadosCRM.telefone || '',
      email: dadosCRM.email || '',
      status: 'ativo',
      consultasTotal: 0,
      dataAdmissao: new Date().toISOString()
    };

    setMedicos(prev => [...prev, novoMedico]);
    setNovoMedicoDialog(false);
    
    toast({
      title: 'Médico cadastrado!',
      description: `Dr(a). ${novoMedico.nome} foi adicionado à clínica.`,
    });
  };

  const alterarStatusMedico = (id: string, novoStatus: 'ativo' | 'inativo') => {
    setMedicos(prev => 
      prev.map(medico => 
        medico.id === id ? { ...medico, status: novoStatus } : medico
      )
    );
    
    toast({
      title: 'Status atualizado',
      description: `O status do médico foi alterado para ${novoStatus}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Gestão da Clínica</h1>
        <p className="text-muted-foreground">
          Painel administrativo para gestão de médicos, pacientes e operações da clínica
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.totalMedicos}</p>
                <p className="text-sm text-muted-foreground">Total de Médicos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.medicosAtivos}</p>
                <p className="text-sm text-muted-foreground">Médicos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.totalPacientes}</p>
                <p className="text-sm text-muted-foreground">Pacientes Cadastrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{estatisticas.consultasMes}</p>
                <p className="text-sm text-muted-foreground">Consultas este Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principais */}
      <Tabs defaultValue="medicos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="medicos">Médicos</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        {/* Tab Médicos */}
        <TabsContent value="medicos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Equipe Médica</CardTitle>
                  <CardDescription>Gerencie os médicos da sua clínica</CardDescription>
                </div>
                <Dialog open={novoMedicoDialog} onOpenChange={setNovoMedicoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Médico
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Médico</DialogTitle>
                    </DialogHeader>
                    <ValidadorCRM 
                      onValidacao={adicionarMedico}
                      className="mt-4"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicos.map((medico) => {
                  const proximaConsulta = medico.proximaConsulta ? formatDateTime(medico.proximaConsulta) : null;
                  
                  return (
                    <Card key={medico.id} className="bg-card-elevated">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <Stethoscope className="w-5 h-5 text-primary" />
                              <div>
                                <h4 className="font-medium">{medico.nome}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {medico.especialidade} • CRM: {medico.crm}
                                </p>
                              </div>
                              <Badge variant={medico.status === 'ativo' ? 'default' : 'secondary'}>
                                {medico.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{medico.telefone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{medico.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{medico.consultasTotal} consultas</span>
                              </div>
                            </div>

                            {proximaConsulta && (
                              <div className="flex items-center space-x-2 mt-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Próxima consulta: {proximaConsulta.date} às {proximaConsulta.time}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => alterarStatusMedico(
                                medico.id, 
                                medico.status === 'ativo' ? 'inativo' : 'ativo'
                              )}
                            >
                              {medico.status === 'ativo' ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Pacientes */}
        <TabsContent value="pacientes">
          <Card>
            <CardHeader>
              <CardTitle>Pacientes da Clínica</CardTitle>
              <CardDescription>Visualize e gerencie os pacientes cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pacientes.map((paciente) => {
                  const ultimaConsulta = paciente.dataUltimaConsulta ? formatDateTime(paciente.dataUltimaConsulta) : null;
                  
                  return (
                    <Card key={paciente.id} className="bg-card-elevated">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <Users className="w-5 h-5 text-secondary" />
                              <div>
                                <h4 className="font-medium">{paciente.nome}</h4>
                                <p className="text-sm text-muted-foreground">CPF: {paciente.cpf}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{paciente.telefone}</span>
                              </div>
                              {paciente.email && (
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{paciente.email}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{paciente.totalConsultas} consultas</span>
                              </div>
                            </div>

                            {paciente.medicoPreferencial && (
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Médico preferencial: {paciente.medicoPreferencial}
                                </span>
                              </div>
                            )}

                            {ultimaConsulta && (
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Última consulta: {ultimaConsulta.date} às {ultimaConsulta.time}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Configurações */}
        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Clínica</CardTitle>
              <CardDescription>Dados institucionais e configurações gerais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Dados da Clínica</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Nome da Clínica</Label>
                      <Input 
                        value={dadosClinica.nome}
                        onChange={(e) => setDadosClinica(prev => ({ ...prev, nome: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>CNPJ</Label>
                      <Input 
                        value={dadosClinica.cnpj}
                        onChange={(e) => setDadosClinica(prev => ({ ...prev, cnpj: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Telefone</Label>
                        <Input 
                          value={dadosClinica.telefone}
                          onChange={(e) => setDadosClinica(prev => ({ ...prev, telefone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>CEP</Label>
                        <Input 
                          value={dadosClinica.cep}
                          onChange={(e) => setDadosClinica(prev => ({ ...prev, cep: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Responsável Técnico</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Nome do Responsável</Label>
                      <Input 
                        value={dadosClinica.responsavelTecnico}
                        onChange={(e) => setDadosClinica(prev => ({ ...prev, responsavelTecnico: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>CRM do Responsável</Label>
                      <Input 
                        value={dadosClinica.crmResponsavel}
                        onChange={(e) => setDadosClinica(prev => ({ ...prev, crmResponsavel: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Endereço</Label>
                    <Input 
                      value={dadosClinica.endereco}
                      onChange={(e) => setDadosClinica(prev => ({ ...prev, endereco: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <Input 
                      value={dadosClinica.cidade}
                      onChange={(e) => setDadosClinica(prev => ({ ...prev, cidade: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Input 
                      value={dadosClinica.estado}
                      onChange={(e) => setDadosClinica(prev => ({ ...prev, estado: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input 
                      type="email"
                      value={dadosClinica.email}
                      onChange={(e) => setDadosClinica(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: 'Configurações salvas!',
                    description: 'As configurações da clínica foram atualizadas.',
                  });
                }}>
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};