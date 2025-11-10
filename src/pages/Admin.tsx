import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserWithRoles {
  id: string;
  email: string;
  nome: string;
  roles: string[];
}

const AVAILABLE_ROLES = [
  { value: 'admin', label: 'Administrador', color: 'bg-red-500' },
  { value: 'clinica', label: 'Clínica', color: 'bg-blue-500' },
  { value: 'medico', label: 'Médico', color: 'bg-green-500' },
  { value: 'paciente', label: 'Paciente', color: 'bg-purple-500' },
];

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (data) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);

      // Buscar todos os profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, nome')
        .order('nome');

      if (profilesError) throw profilesError;

      // Buscar todos os roles
      const { data: allRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combinar dados
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: allRoles
          ?.filter(r => r.user_id === profile.id)
          .map(r => r.role) || [],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const manageRole = async (userId: string, role: string, action: 'add' | 'remove') => {
    try {
      setProcessingUser(userId);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Não autenticado');
      }

      const { data, error } = await supabase.functions.invoke('gerenciar-roles', {
        body: { userId, role, action },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: data.message || `Role ${action === 'add' ? 'adicionada' : 'removida'} com sucesso`,
      });

      // Recarregar usuários
      await loadUsers();
    } catch (error) {
      console.error('Erro ao gerenciar role:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível gerenciar a role',
        variant: 'destructive',
      });
    } finally {
      setProcessingUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Acesso Negado
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Gerenciamento de Roles
          </CardTitle>
          <CardDescription>
            Gerencie os papéis e permissões dos usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userItem) => (
              <div
                key={userItem.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{userItem.nome}</h3>
                  <p className="text-sm text-muted-foreground">{userItem.email}</p>
                  <div className="flex gap-2 mt-2">
                    {userItem.roles.length > 0 ? (
                      userItem.roles.map((role) => {
                        const roleConfig = AVAILABLE_ROLES.find(r => r.value === role);
                        return (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {roleConfig?.label || role}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => manageRole(userItem.id, role, 'remove')}
                              disabled={processingUser === userItem.id}
                            >
                              <UserMinus className="w-3 h-3" />
                            </Button>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem roles</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    disabled={processingUser === userItem.id}
                    onValueChange={(role) => manageRole(userItem.id, role, 'add')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Adicionar role" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ROLES.map((role) => (
                        <SelectItem
                          key={role.value}
                          value={role.value}
                          disabled={userItem.roles.includes(role.value)}
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {processingUser === userItem.id && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
