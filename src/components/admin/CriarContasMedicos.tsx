import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MedicoData {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
}

export function CriarContasMedicos() {
  const [medicos, setMedicos] = useState<MedicoData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarMedicos();
  }, []);

  const carregarMedicos = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, especialidade, crm')
        .eq('role', 'medico');

      if (error) throw error;
      setMedicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
    }
  };

  const criarContaMedico = async (medico: MedicoData) => {
    setLoading(true);
    try {
      // Note: In a real app, email should be part of the doctor data
      const email = `${medico.nome.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`;
      const { data, error } = await supabase.functions.invoke('criar-conta-medico', {
        body: {
          email: email,
          password: 'medico123',
          profileId: medico.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Conta criada com sucesso!',
        description: `Login criado para ${medico.nome} / senha: medico123`,
      });

    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Criar Contas de Login para Médicos</CardTitle>
          <CardDescription>
            Crie contas de login para os médicos cadastrados para testar a funcionalidade de consultas online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicos.map((medico) => (
            <div key={medico.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{medico.nome}</h4>
                <p className="text-sm text-muted-foreground">{medico.especialidade}</p>
                <p className="text-sm text-muted-foreground">{medico.crm}</p>
              </div>
              <Button
                onClick={() => criarContaMedico(medico)}
                disabled={loading}
              >
                Criar Login
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais de Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Dr. João Silva:</strong></p>
            <p>Email: ivo@adnews.com.br</p>
            <p>Senha: medico123</p>
            
            <p className="mt-4"><strong>Dra. Maria Santos:</strong></p>
            <p>Email: vanessa.donnianni@gmail.com</p>
            <p>Senha: medico123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}