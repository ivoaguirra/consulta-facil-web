import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState<UserRole>('paciente');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const success = await login(formData.email, formData.password, activeRole);
    
    if (success) {
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo à plataforma TeleMed`,
      });
      navigate('/dashboard');
    } else {
      setError('Email ou senha incorretos');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">TeleMed</h1>
          <p className="text-muted-foreground mt-2">Plataforma de Telemedicina</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Escolha seu perfil e acesse sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="paciente">Paciente</TabsTrigger>
                <TabsTrigger value="medico">Médico</TabsTrigger>
                <TabsTrigger value="clinica">Clínica</TabsTrigger>
              </TabsList>

              <TabsContent value={activeRole} className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link 
                      to="/cadastro" 
                      className="text-primary hover:underline font-medium"
                    >
                      Cadastre-se
                    </Link>
                  </p>
                  <Link 
                    to="/esqueci-senha" 
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informações para demo */}
        <Card className="mt-4 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-center">🎯 Como Testar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-1">1. Criar conta</h4>
                <p className="text-muted-foreground">Use o botão "Cadastre-se" para criar um novo usuário</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">2. Verificar email</h4>
                <p className="text-muted-foreground">Confirme sua conta pelo email enviado</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">3. Fazer login</h4>
                <p className="text-muted-foreground">Use suas credenciais para acessar o sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};