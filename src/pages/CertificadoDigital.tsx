import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ValidadorCRM } from '@/components/validacao/ValidadorCRM';
import { Layout } from '@/components/layout/Layout';

const CertificadoDigital: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Certificado Digital</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie certificados digitais e validação ICP-Brasil
          </p>
        </div>
        
        <ValidadorCRM />
      </div>
    </Layout>
  );
};

export default CertificadoDigital;