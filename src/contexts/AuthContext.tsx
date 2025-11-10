import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Timeout de segurança para garantir que isLoading seja false
    const safetyTimeout = setTimeout(() => {
      console.warn('Auth timeout - forçando isLoading = false');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }, 10000);

    // Configurar listener de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        clearTimeout(safetyTimeout);
        
        if (session?.user) {
          // Atualizar estado imediatamente para evitar loops
          setAuthState(prev => ({ ...prev, isLoading: false }));
          
          // Buscar perfil em uma operação separada
          setTimeout(async () => {
            try {
              const [{ data: profile, error: profileError }, { data: roleData, error: roleError }] = await Promise.all([
                supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single(),
                supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', session.user.id)
                  .order('created_at', { ascending: true })
                  .limit(1)
                  .maybeSingle()
              ]);

              if (profile && !profileError && roleData) {
                const user: User = {
                  id: profile.id,
                  email: profile.email,
                  nome: profile.nome,
                  role: roleData.role as UserRole,
                  telefone: profile.telefone,
                  cpf: profile.cpf,
                  crm: profile.crm,
                  especialidade: profile.especialidade,
                  clinicaId: profile.clinica_id,
                  endereco: profile.endereco as any,
                  dataNascimento: profile.data_nascimento,
                  createdAt: profile.created_at,
                  updatedAt: profile.updated_at,
                };

                setAuthState({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                console.warn('Perfil não encontrado, criando usuário básico:', profileError, roleError);
                // Criar usuário básico a partir dos dados da sessão
                const basicUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nome: session.user.user_metadata?.nome || session.user.email || 'Usuário',
                  role: session.user.user_metadata?.role || 'paciente',
                  telefone: session.user.user_metadata?.telefone,
                  cpf: session.user.user_metadata?.cpf,
                  crm: session.user.user_metadata?.crm,
                  especialidade: session.user.user_metadata?.especialidade,
                  createdAt: session.user.created_at,
                  updatedAt: session.user.updated_at,
                };

                setAuthState({
                  user: basicUser,
                  isAuthenticated: true,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }, 0);
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        clearTimeout(safetyTimeout);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // O listener onAuthStateChange vai lidar com a atualização do estado
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            nome: userData.nome,
            role: userData.role,
            telefone: userData.telefone,
            cpf: userData.cpf,
            crm: userData.crm,
            especialidade: userData.especialidade,
          }
        }
      });

      if (error) {
        console.error('Erro no registro:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // O listener onAuthStateChange vai lidar com a atualização do estado
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro no logout:', error);
    }
    // O listener onAuthStateChange vai lidar com a atualização do estado
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};