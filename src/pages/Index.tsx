import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mx-auto mb-6">
          <Heart className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl font-bold text-foreground mb-4">TeleMed</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Plataforma completa de telemedicina para médicos, pacientes e clínicas
        </p>
        
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link to="/demo">Ver Demonstração</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
