import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Pacientes() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar pacientes..." 
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              Nenhum paciente encontrado. Clique em "Novo Paciente" para adicionar o primeiro.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}