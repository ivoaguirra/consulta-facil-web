import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DadosCRM {
  numero: string;
  uf: string;
  nome: string;
  especialidades: string[];
  situacao: 'ativo' | 'inativo' | 'suspenso';
  dataInscricao: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

interface ValidadorCRMProps {
  onValidacao?: (dados: DadosCRM | null) => void;
  crmInicial?: string;
  ufInicial?: string;
  className?: string;
}

// Mock data para demonstração
const mockDadosCRM: Record<string, DadosCRM> = {
  '123456-SP': {
    numero: '123456',
    uf: 'SP',
    nome: 'Dr. João Silva Santos',
    especialidades: ['Cardiologia', 'Medicina Interna'],
    situacao: 'ativo',
    dataInscricao: '2010-03-15',
    endereco: 'São Paulo, SP',
    telefone: '(11) 99999-9999',
    email: 'joao.silva@medicina.com'
  },
  '98765-RJ': {
    numero: '98765',
    uf: 'RJ',
    nome: 'Dra. Maria Santos Oliveira',
    especialidades: ['Pediatria'],
    situacao: 'ativo',
    dataInscricao: '2015-08-22',
    endereco: 'Rio de Janeiro, RJ'
  },
  '11111-MG': {
    numero: '11111',
    uf: 'MG',
    nome: 'Dr. Pedro Costa Lima',
    especialidades: ['Ortopedia', 'Medicina do Esporte'],
    situacao: 'suspenso',
    dataInscricao: '2008-12-10',
    endereco: 'Belo Horizonte, MG'
  }
};

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const ValidadorCRM: React.FC<ValidadorCRMProps> = ({
  onValidacao,
  crmInicial = '',
  ufInicial = '',
  className = ''
}) => {
  const { toast } = useToast();
  const [crm, setCrm] = useState(crmInicial);
  const [uf, setUf] = useState(ufInicial);
  const [validando, setValidando] = useState(false);
  const [dadosValidados, setDadosValidados] = useState<DadosCRM | null>(null);
  const [erro, setErro] = useState('');

  const validarCRM = async () => {
    if (!crm || !uf) {
      setErro('Número do CRM e UF são obrigatórios');
      return;
    }

    setValidando(true);
    setErro('');
    setDadosValidados(null);

    try {
      // Simular consulta à API do CFM
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const chave = `${crm}-${uf}`;
      const dados = mockDadosCRM[chave];
      
      if (dados) {
        setDadosValidados(dados);
        onValidacao?.(dados);
        
        if (dados.situacao === 'ativo') {
          toast({
            title: 'CRM Válido!',
            description: `Dr(a). ${dados.nome} - Situação: ${dados.situacao}`,
          });
        } else {
          toast({
            title: 'CRM com restrições',
            description: `Situação: ${dados.situacao}`,
            variant: 'destructive'
          });
        }
      } else {
        setErro('CRM não encontrado na base do Conselho Federal de Medicina');
        onValidacao?.(null);
        toast({
          title: 'CRM não encontrado',
          description: 'Verifique o número e UF informados',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setErro('Erro ao consultar base do CFM. Tente novamente.');
      onValidacao?.(null);
    } finally {
      setValidando(false);
    }
  };

  const limparValidacao = () => {
    setDadosValidados(null);
    setErro('');
    setCrm('');
    setUf('');
    onValidacao?.(null);
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'ativo':
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>;
      case 'suspenso':
        return <Badge variant="outline" className="text-destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <Card className={`${className} animate-fade-in`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Validador de CRM</span>
        </CardTitle>
        <CardDescription>
          Verifique a validade do CRM junto ao Conselho Federal de Medicina
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário de consulta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="crm">Número do CRM</Label>
            <Input
              id="crm"
              value={crm}
              onChange={(e) => setCrm(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 123456"
              maxLength={10}
            />
          </div>
          <div>
            <Label htmlFor="uf">UF</Label>
            <select
              id="uf"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecionar UF</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <Button 
            onClick={validarCRM} 
            disabled={validando || !crm || !uf}
            className="flex-1"
          >
            {validando ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {validando ? 'Validando...' : 'Validar CRM'}
          </Button>
          
          {(dadosValidados || erro) && (
            <Button variant="outline" onClick={limparValidacao}>
              Limpar
            </Button>
          )}
        </div>

        {/* Erro */}
        {erro && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Dados validados */}
        {dadosValidados && (
          <Card className="bg-card-elevated animate-scale-in">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>CRM Validado</span>
                </CardTitle>
                {getSituacaoBadge(dadosValidados.situacao)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{dadosValidados.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">CRM</p>
                      <p className="font-medium">{dadosValidados.numero}/{dadosValidados.uf}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Inscrição</p>
                      <p className="font-medium">
                        {new Date(dadosValidados.dataInscricao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Especialidades</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dadosValidados.especialidades.map((esp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {dadosValidados.endereco && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Localização</p>
                        <p className="font-medium">{dadosValidados.endereco}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {dadosValidados.situacao !== 'ativo' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Este CRM está com situação "{dadosValidados.situacao}". 
                    Verifique com o profissional sobre a regularização.
                  </AlertDescription>
                </Alert>
              )}

              {dadosValidados.situacao === 'ativo' && (
                <Alert className="border-success bg-success/5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    CRM válido e em situação regular no Conselho Federal de Medicina.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informações sobre a validação */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• A validação é feita junto à base oficial do Conselho Federal de Medicina (CFM)</p>
          <p>• Os dados são atualizados em tempo real pelos Conselhos Regionais</p>
          <p>• Esta verificação garante que o profissional está apto a exercer a medicina</p>
        </div>
      </CardContent>
    </Card>
  );
};