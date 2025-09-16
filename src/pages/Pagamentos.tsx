import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Receipt,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PagamentoItem {
  id: string;
  consultaId: string;
  pacienteNome: string;
  medicoNome: string;
  especialidade: string;
  dataConsulta: string;
  valor: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'estornado';
  metodoPagamento?: string;
  dataPagamento?: string;
  numeroFatura: string;
}

const mockPagamentos: PagamentoItem[] = [
  {
    id: '1',
    consultaId: 'cons_1',
    pacienteNome: 'Maria Santos',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataConsulta: '2024-03-15T14:30:00',
    valor: 180.00,
    status: 'pendente',
    numeroFatura: 'FAT-2024-001',
  },
  {
    id: '2',
    consultaId: 'cons_2',
    pacienteNome: 'Pedro Costa',
    medicoNome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    dataConsulta: '2024-03-14T10:00:00',
    valor: 120.00,
    status: 'pago',
    metodoPagamento: 'Cartão de Crédito',
    dataPagamento: '2024-03-14T09:45:00',
    numeroFatura: 'FAT-2024-002',
  },
];

export const Pagamentos: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pagamentos, setPagamentos] = useState<PagamentoItem[]>(mockPagamentos);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<PagamentoItem | null>(null);

  if (!user) return null;

  const handlePagar = (pagamento: PagamentoItem) => {
    setPagamentoSelecionado(pagamento);
    setShowCheckout(true);
  };

  const processarPagamento = () => {
    if (!pagamentoSelecionado) return;

    setPagamentos(prev => 
      prev.map(p => 
        p.id === pagamentoSelecionado.id 
          ? {
              ...p,
              status: 'pago' as const,
              metodoPagamento: 'Cartão de Crédito',
              dataPagamento: new Date().toISOString(),
            }
          : p
      )
    );

    setShowCheckout(false);
    setPagamentoSelecionado(null);

    toast({
      title: 'Pagamento realizado!',
      description: 'Sua consulta foi confirmada.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-warning">Pendente</Badge>;
      case 'pago':
        return <Badge variant="outline" className="text-success">Pago</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'estornado':
        return <Badge variant="outline" className="text-muted-foreground">Estornado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'pago':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'estornado':
        return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  // Calcular estatísticas
  const totalPago = pagamentos
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.valor, 0);
  
  const totalPendente = pagamentos
    .filter(p => p.status === 'pendente')
    .reduce((sum, p) => sum + p.valor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pagamentos</h1>
        <p className="text-muted-foreground">
          {user.role === 'paciente' && 'Gerencie os pagamentos das suas consultas'}
          {user.role === 'medico' && 'Acompanhe recebimentos das consultas'}
          {user.role === 'clinica' && 'Controle financeiro da clínica'}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalPago)}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(totalPendente)}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagamentos.length}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagamentos.length > 0 ? Math.round((pagamentos.filter(p => p.status === 'pago').length / pagamentos.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pagamentos bem-sucedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pagamentos */}
      <div className="space-y-4">
        {pagamentos.map((pagamento) => {
          const { date, time } = formatDateTime(pagamento.dataConsulta);
          
          return (
            <Card key={pagamento.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(pagamento.status)}
                        <span className="font-medium">{pagamento.numeroFatura}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{date} - {time}</span>
                      </div>
                      {getStatusBadge(pagamento.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          {user.role === 'paciente' ? 'Médico' : 'Paciente'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.role === 'paciente' ? pagamento.medicoNome : pagamento.pacienteNome}
                        </p>
                        <p className="text-xs text-muted-foreground">{pagamento.especialidade}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Valor</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(pagamento.valor)}
                        </p>
                      </div>

                      {pagamento.metodoPagamento && (
                        <div>
                          <p className="text-sm font-medium">Método de Pagamento</p>
                          <p className="text-sm text-muted-foreground">{pagamento.metodoPagamento}</p>
                          {pagamento.dataPagamento && (
                            <p className="text-xs text-muted-foreground">
                              Pago em {formatDateTime(pagamento.dataPagamento).date}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2 ml-4">
                    {pagamento.status === 'pendente' && user.role === 'paciente' && (
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={() => handlePagar(pagamento)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar
                      </Button>
                    )}

                    {pagamento.status === 'pago' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Recibo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {pagamentos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground">
                {user.role === 'paciente' && 'Suas faturas de consultas aparecerão aqui.'}
                {user.role === 'medico' && 'Recebimentos de consultas aparecerão aqui.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Checkout */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento da Consulta</DialogTitle>
          </DialogHeader>
          {pagamentoSelecionado && (
            <div className="space-y-6">
              {/* Resumo do pagamento */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Consulta:</span>
                  <span className="text-sm font-medium">{pagamentoSelecionado.medicoNome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Especialidade:</span>
                  <span className="text-sm font-medium">{pagamentoSelecionado.especialidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Data:</span>
                  <span className="text-sm font-medium">
                    {formatDateTime(pagamentoSelecionado.dataConsulta).date}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(pagamentoSelecionado.valor)}
                  </span>
                </div>
              </div>

              {/* Formulário de pagamento simulado */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    defaultValue="4111 1111 1111 1111"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Validade</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      defaultValue="12/25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="000"
                      defaultValue="123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    placeholder="Nome completo"
                    defaultValue={user.nome}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCheckout(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-success hover:bg-success/90"
                  onClick={processarPagamento}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar {formatCurrency(pagamentoSelecionado.valor)}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Este é um ambiente de demonstração. Nenhum pagamento real será processado.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};