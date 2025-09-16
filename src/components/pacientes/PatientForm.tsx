import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Paciente } from '@/types/medical';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>) => void;
  patient?: Paciente;
  mode: 'create' | 'edit';
}

export const PatientForm: React.FC<PatientFormProps> = ({
  isOpen,
  onClose,
  onSave,
  patient,
  mode
}) => {
  const [formData, setFormData] = useState({
    nome: patient?.nome || '',
    cpf: patient?.cpf || '',
    email: patient?.email || '',
    telefone: patient?.telefone || '',
    dataNascimento: patient?.dataNascimento || '',
    endereco: {
      rua: patient?.endereco?.rua || '',
      numero: patient?.endereco?.numero || '',
      complemento: patient?.endereco?.complemento || '',
      bairro: patient?.endereco?.bairro || '',
      cidade: patient?.endereco?.cidade || '',
      estado: patient?.endereco?.estado || '',
      cep: patient?.endereco?.cep || ''
    },
    convenio: {
      nome: patient?.convenio?.nome || '',
      numero: patient?.convenio?.numero || ''
    },
    historicoMedico: patient?.historicoMedico || '',
    observacoes: patient?.observacoes || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));
  };

  const handleConvenioChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      convenio: {
        ...prev.convenio,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      },
      convenio: {
        nome: '',
        numero: ''
      },
      historicoMedico: '',
      observacoes: ''
    });
  };

  const handleClose = () => {
    if (mode === 'create') {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Paciente' : 'Editar Paciente'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.endereco.rua}
                  onChange={(e) => handleAddressChange('rua', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.endereco.numero}
                  onChange={(e) => handleAddressChange('numero', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.endereco.complemento}
                  onChange={(e) => handleAddressChange('complemento', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleAddressChange('bairro', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleAddressChange('cidade', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.endereco.estado}
                  onChange={(e) => handleAddressChange('estado', e.target.value)}
                  placeholder="SP"
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.endereco.cep}
                  onChange={(e) => handleAddressChange('cep', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Convênio */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Convênio (Opcional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="convenio-nome">Nome do Convênio</Label>
                <Input
                  id="convenio-nome"
                  value={formData.convenio.nome}
                  onChange={(e) => handleConvenioChange('nome', e.target.value)}
                  placeholder="Ex: Unimed, Bradesco Saúde"
                />
              </div>
              <div>
                <Label htmlFor="convenio-numero">Número da Carteirinha</Label>
                <Input
                  id="convenio-numero"
                  value={formData.convenio.numero}
                  onChange={(e) => handleConvenioChange('numero', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Médicas</h3>
            <div>
              <Label htmlFor="historicoMedico">Histórico Médico</Label>
              <Textarea
                id="historicoMedico"
                value={formData.historicoMedico}
                onChange={(e) => handleInputChange('historicoMedico', e.target.value)}
                placeholder="Alergias, medicamentos em uso, cirurgias anteriores..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Cadastrar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};