import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Stethoscope, 
  Plus, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Edit,
  Eye,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  especialidades: string[];
  telefone: string;
  email: string;
  endereco: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  valorConsulta: number;
  horariosDisponiveis: string[];
  avaliacao: number;
  bio: string;
  formacao: string;
  experiencia: number;
  ativo: boolean;
  online: boolean;
  presencial: boolean;
}

const especialidadesDisponiveis = [
  'Cardiologia',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Ginecologia',
  'Neurologia',
  'Oftalmologia',
  'Ortopedia',
  'Otorrinolaringologia',
  'Pediatria',
  'Psiquiatria',
  'Urologia',
  'Clínica Geral'
];

const mockMedicos: Medico[] = [
  {
    id: '1',
    nome: 'Dr. João Silva',
    crm: 'CRM/SP 123456',
    especialidade: 'Cardiologia',
    especialidades: ['Cardiologia', 'Clínica Geral'],
    telefone: '(11) 99999-9999',
    email: 'joao.silva@clinica.com',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    valorConsulta: 250,
    horariosDisponiveis: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
    avaliacao: 4.8,
    bio: 'Especialista em cardiologia com mais de 15 anos de experiência em diagnóstico e tratamento de doenças cardiovasculares.',
    formacao: 'Medicina - USP, Residência em Cardiologia - InCor',
    experiencia: 15,
    ativo: true,
    online: true,
    presencial: true
  },
  {
    id: '2',
    nome: 'Dra. Maria Santos',
    crm: 'CRM/SP 234567',
    especialidade: 'Pediatria',
    especialidades: ['Pediatria'],
    telefone: '(11) 88888-8888',
    email: 'maria.santos@clinica.com',
    endereco: {
      rua: 'Av. Paulista',
      numero: '1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100'
    },
    valorConsulta: 200,
    horariosDisponiveis: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
    avaliacao: 4.9,
    bio: 'Pediatra com foco em desenvolvimento infantil e medicina preventiva.',
    formacao: 'Medicina - UNIFESP, Residência em Pediatria - Hospital São Paulo',
    experiencia: 12,
    ativo: true,
    online: true,
    presencial: true
  },
  {
    id: '3',
    nome: 'Dr. Pedro Costa',
    crm: 'CRM/RJ 345678',
    especialidade: 'Dermatologia',
    especialidades: ['Dermatologia', 'Dermatologia Estética'],
    telefone: '(21) 77777-7777',
    email: 'pedro.costa@clinica.com',
    endereco: {
      rua: 'Rua Ipanema',
      numero: '500',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22421-030'
    },
    valorConsulta: 300,
    horariosDisponiveis: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'],
    avaliacao: 4.7,
    bio: 'Dermatologista especializado em tratamentos estéticos e dermatologia clínica.',
    formacao: 'Medicina - UFRJ, Residência em Dermatologia - UERJ',
    experiencia: 10,
    ativo: true,
    online: false,
    presencial: true
  },
  {
    id: '4',
    nome: 'Dra. Ana Oliveira',
    crm: 'CRM/MG 456789',
    especialidade: 'Ginecologia',
    especialidades: ['Ginecologia', 'Obstetrícia'],
    telefone: '(31) 66666-6666',
    email: 'ana.oliveira@clinica.com',
    endereco: {
      rua: 'Rua da Bahia',
      numero: '300',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30160-011'
    },
    valorConsulta: 280,
    horariosDisponiveis: ['08:00', '09:00', '14:00', '15:00', '16:00'],
    avaliacao: 4.8,
    bio: 'Ginecologista e obstetra com experiência em saúde da mulher e parto humanizado.',
    formacao: 'Medicina - UFMG, Residência em Ginecologia e Obstetrícia - HC-UFMG',
    experiencia: 14,
    ativo: true,
    online: true,
    presencial: true
  },
  {
    id: '5',
    nome: 'Dr. Carlos Mendes',
    crm: 'CRM/RS 567890',
    especialidade: 'Ortopedia',
    especialidades: ['Ortopedia', 'Traumatologia'],
    telefone: '(51) 55555-5555',
    email: 'carlos.mendes@clinica.com',
    endereco: {
      rua: 'Av. Ipiranga',
      numero: '999',
      cidade: 'Porto Alegre',
      estado: 'RS',
      cep: '90110-000'
    },
    valorConsulta: 320,
    horariosDisponiveis: ['07:00', '08:00', '13:00', '14:00', '15:00'],
    avaliacao: 4.6,
    bio: 'Ortopedista especializado em cirurgia de coluna e traumatologia esportiva.',
    formacao: 'Medicina - UFRGS, Residência em Ortopedia - HCPA',
    experiencia: 18,
    ativo: true,
    online: false,
    presencial: true
  }
];

export default function Medicos() {
  const { toast } = useToast();
  const [medicos, setMedicos] = useState<Medico[]>(mockMedicos);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('todas');
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroOnline, setFiltroOnline] = useState('todos');
  const [busca, setBusca] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const medicosFiltrados = medicos.filter(medico => {
    const matchBusca = medico.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      medico.especialidade.toLowerCase().includes(busca.toLowerCase());
    const matchEspecialidade = !filtroEspecialidade || filtroEspecialidade === 'todas' || medico.especialidades.includes(filtroEspecialidade);
    const matchCidade = !filtroCidade || medico.endereco.cidade.toLowerCase().includes(filtroCidade.toLowerCase());
    const matchOnline = !filtroOnline || filtroOnline === 'todos' || 
                       (filtroOnline === 'online' && medico.online) ||
                       (filtroOnline === 'presencial' && medico.presencial);

    return matchBusca && matchEspecialidade && matchCidade && matchOnline && medico.ativo;
  });

  const abrirPerfilMedico = (medico: Medico) => {
    setMedicoSelecionado(medico);
    setDialogAberto(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Médicos</h1>
          <p className="text-muted-foreground">
            Encontre e agende consultas com os melhores profissionais
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Buscar Médicos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Buscar por nome ou especialidade</Label>
                <Input
                  placeholder="Digite nome do médico..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Especialidade</Label>
                <Select value={filtroEspecialidade} onValueChange={setFiltroEspecialidade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as especialidades</SelectItem>
                    {especialidadesDisponiveis.map(esp => (
                      <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cidade</Label>
                <Input
                  placeholder="Digite a cidade..."
                  value={filtroCidade}
                  onChange={(e) => setFiltroCidade(e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de atendimento</Label>
                <Select value={filtroOnline} onValueChange={setFiltroOnline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Médicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicosFiltrados.map((medico) => (
            <Card key={medico.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{medico.nome}</h3>
                      <p className="text-sm text-muted-foreground">{medico.crm}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{medico.avaliacao}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {medico.especialidades.map(esp => (
                        <Badge key={esp} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{medico.endereco.cidade}, {medico.endereco.estado}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>R$ {medico.valorConsulta}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{medico.experiencia} anos de experiência</span>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    {medico.online && (
                      <Badge variant="outline" className="text-xs">Online</Badge>
                    )}
                    {medico.presencial && (
                      <Badge variant="outline" className="text-xs">Presencial</Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => abrirPerfilMedico(medico)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {medicosFiltrados.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum médico encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para encontrar mais profissionais.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dialog do Perfil do Médico */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Perfil do Médico</DialogTitle>
            </DialogHeader>
            {medicoSelecionado && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{medicoSelecionado.nome}</h3>
                    <p className="text-muted-foreground">{medicoSelecionado.crm}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{medicoSelecionado.avaliacao}</span>
                      <span className="text-sm text-muted-foreground">• {medicoSelecionado.experiencia} anos</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Especialidades</h4>
                      <div className="flex flex-wrap gap-1">
                        {medicoSelecionado.especialidades.map(esp => (
                          <Badge key={esp} variant="outline">{esp}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Contato</h4>
                      <p className="text-sm text-muted-foreground">{medicoSelecionado.telefone}</p>
                      <p className="text-sm text-muted-foreground">{medicoSelecionado.email}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Endereço</h4>
                      <p className="text-sm text-muted-foreground">
                        {medicoSelecionado.endereco.rua}, {medicoSelecionado.endereco.numero}<br />
                        {medicoSelecionado.endereco.cidade}, {medicoSelecionado.endereco.estado}<br />
                        CEP: {medicoSelecionado.endereco.cep}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Valor da Consulta</h4>
                      <p className="text-lg font-semibold text-primary">R$ {medicoSelecionado.valorConsulta}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tipos de Atendimento</h4>
                      <div className="flex space-x-2">
                        {medicoSelecionado.online && (
                          <Badge variant="outline">Online</Badge>
                        )}
                        {medicoSelecionado.presencial && (
                          <Badge variant="outline">Presencial</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Horários Disponíveis</h4>
                      <div className="grid grid-cols-3 gap-1">
                        {medicoSelecionado.horariosDisponiveis.map(horario => (
                          <Badge key={horario} variant="outline" className="text-xs justify-center">
                            {horario}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sobre</h4>
                  <p className="text-sm text-muted-foreground">{medicoSelecionado.bio}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Formação</h4>
                  <p className="text-sm text-muted-foreground">{medicoSelecionado.formacao}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogAberto(false)}>
                    Fechar
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}