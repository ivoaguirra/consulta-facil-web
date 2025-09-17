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

  // Debug logging
  console.log('AuthProvider - Current state:', authState);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Safety timeout - ensure loading never lasts more than 10 seconds
    const safetyTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }, 10000);

    // Configurar listener de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session);
        clearTimeout(safetyTimeout);
        
        if (session?.user) {
          // Set loading false immediately, then try to fetch profile async
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });

          // Fetch profile in background with timeout
          setTimeout(async () => {
            try {
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
                console.error('Profile not found or error:', error);
                // Stay unauthenticated but not loading
                setAuthState({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
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
      clearTimeout(safetyTimeout);
      if (!session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
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