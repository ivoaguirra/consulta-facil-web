import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Paciente } from '@/types/medical';

interface PatientTableProps {
  patients: Paciente[];
  onView: (patient: Paciente) => void;
  onEdit: (patient: Paciente) => void;
  onDelete: (patient: Paciente) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onView,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum paciente encontrado. Clique em "Novo Paciente" para adicionar o primeiro.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Convênio</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div>
                <div className="font-medium">{patient.nome}</div>
                <div className="text-sm text-muted-foreground">{patient.email}</div>
              </div>
            </TableCell>
            <TableCell>{patient.cpf}</TableCell>
            <TableCell>{calculateAge(patient.dataNascimento)} anos</TableCell>
            <TableCell>{patient.telefone}</TableCell>
            <TableCell>
              {patient.convenio ? (
                <Badge variant="secondary">{patient.convenio.nome}</Badge>
              ) : (
                <Badge variant="outline">Particular</Badge>
              )}
            </TableCell>
            <TableCell>{formatDate(patient.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(patient)}
                  title="Visualizar"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(patient)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(patient)}
                  title="Excluir"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};