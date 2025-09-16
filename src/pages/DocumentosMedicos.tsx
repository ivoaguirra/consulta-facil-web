import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FlaskConical, 
  Pill, 
  Plus,
  Calendar,
  User,
  Download,
  Eye
} from 'lucide-react';
import { ReceituarioDigital } from '@/components/receituario/ReceituarioDigital';
import { AtestadoDigital } from '@/components/atestado/AtestadoDigital';
import { SolicitacaoExames } from '@/components/exames/SolicitacaoExames';
import { useToast } from '@/hooks/use-toast';

interface DocumentoHistorico {
  id: string;
  tipo: 'receita' | 'atestado' | 'exames';
  pacienteNome: string;
  dataEmissao: string;
  status: 'rascunho' | 'emitido' | 'enviado';
}

export default function DocumentosMedicos() {
  const { toast } = useToast();
  const [abaSelecionada, setAbaSelecionada] = useState('receituario');
  const [documentos] = useState<DocumentoHistorico[]>([
    {
      id: '1',
      tipo: 'receita',
      pacienteNome: 'Maria Silva',
      dataEmissao: '2024-01-15',
      status: 'enviado'
    },
    {
      id: '2',
      tipo: 'atestado',
      pacienteNome: 'João Santos',
      dataEmissao: '2024-01-14',
      status: 'emitido'
    },
    {
      id: '3',
      tipo: 'exames',
      pacienteNome: 'Ana Costa',
      dataEmissao: '2024-01-13',
      status: 'enviado'
    }
  ]);

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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'receita':
        return <Pill className="w-4 h-4" />;
      case 'atestado':
        return <FileText className="w-4 h-4" />;
      case 'exames':
        return <FlaskConical className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTipoNome = (tipo: string) => {
    switch (tipo) {
      case 'receita':
        return 'Receituário';
      case 'atestado':
        return 'Atestado';
      case 'exames':
        return 'Solicitação de Exames';
      default:
        return tipo;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos Médicos</h1>
          <p className="text-muted-foreground">
            Gestão completa de receituários, atestados e solicitações de exames
          </p>
        </div>

        <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="receituario" className="flex items-center space-x-2">
              <Pill className="w-4 h-4" />
              <span>Receituário</span>
            </TabsTrigger>
            <TabsTrigger value="atestado" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Atestado</span>
            </TabsTrigger>
            <TabsTrigger value="exames" className="flex items-center space-x-2">
              <FlaskConical className="w-4 h-4" />
              <span>Exames</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Histórico</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="receituario">
            <ReceituarioDigital 
              onSave={(receita) => {
                console.log('Receita salva:', receita);
              }}
              onSend={(receita) => {
                console.log('Receita enviada:', receita);
              }}
            />
          </TabsContent>

          <TabsContent value="atestado">
            <AtestadoDigital 
              onSave={(atestado) => {
                console.log('Atestado salvo:', atestado);
              }}
              onSend={(atestado) => {
                console.log('Atestado enviado:', atestado);
              }}
            />
          </TabsContent>

          <TabsContent value="exames">
            <SolicitacaoExames 
              onSave={(solicitacao) => {
                console.log('Solicitação salva:', solicitacao);
              }}
              onSend={(solicitacao) => {
                console.log('Solicitação enviada:', solicitacao);
              }}
            />
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Histórico de Documentos</span>
                </CardTitle>
                <CardDescription>
                  Visualize todos os documentos médicos emitidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentos.map((documento) => (
                    <Card key={documento.id} className="bg-card-elevated">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTipoIcon(documento.tipo)}
                            <div>
                              <h4 className="font-medium">{getTipoNome(documento.tipo)}</h4>
                              <p className="text-sm text-muted-foreground">
                                Paciente: {documento.pacienteNome}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Data: {new Date(documento.dataEmissao).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(documento.status)}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {documentos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum documento encontrado</p>
                      <p className="text-sm">Os documentos emitidos aparecerão aqui</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}