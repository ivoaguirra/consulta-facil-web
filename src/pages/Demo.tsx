import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Calendar, FileText, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Demo: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Usuários',
      description: 'Sistema completo de autenticação com diferentes perfis: pacientes, médicos e clínicas.',
      status: 'Implementado'
    },
    {
      icon: Calendar,
      title: 'Agendamentos',
      description: 'Agendamento de consultas com integração em tempo real e notificações.',
      status: 'Implementado'
    },
    {
      icon: FileText,
      title: 'Prontuários Digitais',
      description: 'Sistema de prontuários eletrônicos com histórico médico completo.',
      status: 'Em Desenvolvimento'
    },
    {
      icon: Shield,
      title: 'Segurança RLS',
      description: 'Row Level Security implementado para proteção de dados sensíveis.',
      status: 'Implementado'
    },
    {
      icon: Zap,
      title: 'Tempo Real',
      description: 'Atualizações em tempo real via Supabase Realtime.',
      status: 'Configurado'
    }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Implementado':
        return 'default';
      case 'Configurado':
        return 'secondary';
      case 'Em Desenvolvimento':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TeleMed</h1>
                <p className="text-sm text-muted-foreground">Plataforma de Telemedicina</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              O Futuro da <span className="text-primary">Telemedicina</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Plataforma completa para gestão de consultas, prontuários digitais e 
              comunicação entre médicos e pacientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Funcionalidades da Plataforma
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistema completo desenvolvido com React, TypeScript e Supabase
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <Badge variant={getStatusVariant(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Test Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">🎯 Como Testar o Sistema</CardTitle>
                <CardDescription>
                  Siga estes passos para explorar todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Criar Conta</h4>
                      <p className="text-muted-foreground text-sm">
                        Clique em "Cadastrar" e crie uma conta escolhendo entre os perfis: 
                        Paciente, Médico ou Clínica.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Verificar Email</h4>
                      <p className="text-muted-foreground text-sm">
                        Confirme sua conta através do link enviado por email. 
                        Isso ativa totalmente sua conta no sistema.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Explorar Dashboard</h4>
                      <p className="text-muted-foreground text-sm">
                        Faça login e explore o dashboard personalizado de acordo com seu perfil. 
                        Teste funcionalidades como agendamentos e gestão de dados.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-center">
                    <Button asChild size="lg">
                      <Link to="/cadastro">Começar Teste</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            TeleMed - Plataforma de Telemedicina desenvolvida com React + Supabase
          </p>
        </div>
      </footer>
    </div>
  );
};