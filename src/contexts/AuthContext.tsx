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
    // Configurar listener de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (session?.user) {
          // Buscar perfil do usuário
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            const user: User = {
              id: profile.id,
              email: profile.email,
              nome: profile.nome,
              role: profile.role,
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
            console.error('Erro ao buscar perfil:', error);
          }
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
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
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