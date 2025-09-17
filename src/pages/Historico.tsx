import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Video,
  MapPin,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoItem {
  id: string;
  tipo: 'consulta' | 'documento' | 'exame' | 'procedimento';
  titulo: string;
  data: string;
  status: 'concluido' | 'pendente' | 'cancelado';
  medico?: string;
  paciente?: string;
  descricao?: string;
  modalidade?: 'presencial' | 'online';
  local?: string;
}

const mockHistorico: HistoricoItem[] = [
  {
    id: '1',
    tipo: 'consulta',
    titulo: 'Consulta Cardiológica',
    data: '2024-01-15T14:30:00',
    status: 'concluido',
    medico: 'Dr. João Silva',
    paciente: 'Maria Santos',
    modalidade: 'presencial',
    local: 'Consultório 205',
    descricao: 'Consulta de rotina para acompanhamento cardiovascular'
  },
  {
    id: '2',
    tipo: 'documento',
    titulo: 'Receituário Digital',
    data: '2024-01-15T15:15:00',
    status: 'concluido',
    medico: 'Dr. João Silva',
    paciente: 'Maria Santos',
    descricao: 'Prescrição de medicamentos para hipertensão'
  },
  {
    id: '3',
    tipo: 'consulta',
    titulo: 'Telemedicina - Dermatologia',
    data: '2024-01-10T10:00:00',
    status: 'concluido',
    medico: 'Dra. Ana Costa',
    paciente: 'João Pedro',
    modalidade: 'online',
    descricao: 'Avaliação de lesão cutânea'
  },
  {
    id: '4',
    tipo: 'exame',
    titulo: 'Solicitação de Hemograma',
    data: '2024-01-08T09:30:00',
    status: 'pendente',
    medico: 'Dr. Carlos Mendes',
    paciente: 'Ana Silva',
    descricao: 'Exames laboratoriais para check-up'
  },
  {
    id: '5',
    tipo: 'documento',
    titulo: 'Atestado Médico',
    data: '2024-01-05T16:45:00',
    status: 'concluido',
    medico: 'Dra. Patricia Lima',
    paciente: 'Roberto Costa',
    descricao: 'Atestado para afastamento - 3 dias'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'concluido':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelado':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'consulta':
      return <Stethoscope className="w-4 h-4" />;
    case 'documento':
      return <FileText className="w-4 h-4" />;
    case 'exame':
      return <Search className="w-4 h-4" />;
    case 'procedimento':
      return <Calendar className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const Historico: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const filteredHistorico = mockHistorico.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.medico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.paciente?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
    const matchesStatus = filterStatus === 'todos' || item.status === filterStatus;

    return matchesSearch && matchesTipo && matchesStatus;
  });

  const groupedHistorico = filteredHistorico.reduce((acc, item) => {
    const monthKey = format(new Date(item.data), 'MMMM yyyy', { locale: ptBR });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(item);
    return acc;
  }, {} as Record<string, HistoricoItem[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground mt-1">
            Visualize o histórico completo de {user?.role === 'medico' ? 'atendimentos e documentos' : 'consultas e documentos médicos'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, descrição, médico ou paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="consulta">Consultas</SelectItem>
                <SelectItem value="documento">Documentos</SelectItem>
                <SelectItem value="exame">Exames</SelectItem>
                <SelectItem value="procedimento">Procedimentos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {Object.entries(groupedHistorico).map(([month, items]) => (
            <div key={month} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground capitalize border-b pb-2">
                {month}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getTipoIcon(item.tipo)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-foreground">{item.titulo}</h4>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              {item.modalidade && (
                                <Badge variant="secondary" className="gap-1">
                                  {item.modalidade === 'online' ? (
                                    <Video className="w-3 h-3" />
                                  ) : (
                                    <MapPin className="w-3 h-3" />
                                  )}
                                  {item.modalidade}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </div>
                              {user?.role !== 'medico' && item.medico && (
                                <div>Médico: {item.medico}</div>
                              )}
                              {user?.role === 'medico' && item.paciente && (
                                <div>Paciente: {item.paciente}</div>
                              )}
                              {item.local && (
                                <div>Local: {item.local}</div>
                              )}
                              {item.descricao && (
                                <div className="mt-2">{item.descricao}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {item.tipo === 'documento' && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="resumo">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockHistorico.filter(item => item.tipo === 'consulta').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Documentos Emitidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockHistorico.filter(item => item.tipo === 'documento').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Exames Solicitados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockHistorico.filter(item => item.tipo === 'exame').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Itens Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockHistorico.filter(item => item.status === 'pendente').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Historico;