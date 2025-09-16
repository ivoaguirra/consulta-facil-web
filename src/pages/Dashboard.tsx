import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Users,
  Video,
  Clock,
  TrendingUp,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'paciente':
        return <DashboardPaciente />;
      case 'medico':
        return <DashboardMedico />;
      case 'clinica':
        return <DashboardClinica />;
      default:
        return <div>Dashboard não encontrado</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {user.nome}
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'paciente' && 'Gerencie suas consultas e acompanhe sua saúde'}
          {user.role === 'medico' && 'Atenda seus pacientes e gerencie consultas'}
          {user.role === 'clinica' && 'Administre sua clínica e equipe médica'}
        </p>
      </div>

      {renderDashboardByRole()}
    </div>
  );
};

const DashboardPaciente: React.FC = () => {
  return (
    <>
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15/03</div>
            <p className="text-xs text-muted-foreground">
              Dr. João Silva - 14:30
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Este Mês</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prontuários</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Registros médicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Bom</div>
            <p className="text-xs text-muted-foreground">
              Último check-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seções principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Suas consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Dr. João Silva</h4>
                <p className="text-sm text-muted-foreground">Cardiologia</p>
                <p className="text-sm text-muted-foreground">15/03/2024 - 14:30</p>
              </div>
              <Button size="sm" asChild>
                <Link to="/consultas">
                  <Video className="w-4 h-4 mr-2" />
                  Entrar
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/agendamentos">
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar Nova Consulta
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lembretes de Saúde</CardTitle>
            <CardDescription>Cuidados importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm">Exame de rotina</p>
                  <p className="text-xs text-muted-foreground">Agendar check-up anual</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">Medicação</p>
                  <p className="text-xs text-muted-foreground">Tomar remédio às 18h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const DashboardMedico: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              2 pendentes, 6 confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Satisfação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <Progress value={96} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14:30</div>
            <p className="text-xs text-muted-foreground">
              Maria Santos - Retorno
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agenda do Dia</CardTitle>
            <CardDescription>Consultas de hoje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { hora: '14:30', paciente: 'Maria Santos', tipo: 'Retorno' },
              { hora: '15:00', paciente: 'João Silva', tipo: 'Primeira consulta' },
              { hora: '15:30', paciente: 'Ana Costa', tipo: 'Retorno' },
            ].map((consulta, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{consulta.hora}</p>
                  <p className="text-sm text-muted-foreground">{consulta.paciente}</p>
                  <p className="text-xs text-muted-foreground">{consulta.tipo}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Semana</CardTitle>
            <CardDescription>Resumo de atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Consultas realizadas</span>
                  <span>32/40</span>
                </div>
                <Progress value={80} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Prontuários preenchidos</span>
                  <span>30/32</span>
                </div>
                <Progress value={94} className="mt-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Tempo médio por consulta</span>
                  <span>28 min</span>
                </div>
                <Progress value={70} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const DashboardClinica: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos Ativos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Especialidades diversas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Cadastrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,156</div>
            <p className="text-xs text-muted-foreground">
              +23 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.2k</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Médicos Online</CardTitle>
            <CardDescription>Status da equipe médica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { nome: 'Dr. João Silva', especialidade: 'Cardiologia', status: 'Online' },
              { nome: 'Dra. Maria Santos', especialidade: 'Pediatria', status: 'Em consulta' },
              { nome: 'Dr. Pedro Costa', especialidade: 'Dermatologia', status: 'Offline' },
            ].map((medico, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{medico.nome}</p>
                  <p className="text-sm text-muted-foreground">{medico.especialidade}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  medico.status === 'Online' ? 'bg-success/10 text-success' :
                  medico.status === 'Em consulta' ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {medico.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Rápidos</CardTitle>
            <CardDescription>Acesso a relatórios importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Relatório de Consultas
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatório Financeiro
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Relatório de Pacientes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Stethoscope className="w-4 h-4 mr-2" />
              Relatório Médico
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};