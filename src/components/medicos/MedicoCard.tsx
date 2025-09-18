import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Star, 
  MapPin, 
  DollarSign,
  Eye,
  Plus,
  Stethoscope
} from 'lucide-react';

// Safe public interface - only contains professional information
export interface MedicoPublico {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
  avatar_url?: string;
  ativo: boolean;
  clinica_id?: string;
}

interface MedicoCardProps {
  medico: MedicoPublico;
  showActions?: boolean;
}

export function MedicoCard({ medico, showActions = true }: MedicoCardProps) {
  const navigate = useNavigate();
  const [dialogAberto, setDialogAberto] = useState(false);

  const abrirPerfilMedico = () => {
    setDialogAberto(true);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{medico.nome}</h3>
                <p className="text-sm text-muted-foreground">{medico.crm}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {medico.especialidade}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Disponível para consultas online</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Valor sob consulta</span>
              </div>
            </div>

            <div className="flex space-x-1">
              <Badge variant="outline" className="text-xs">Online</Badge>
            </div>

            {showActions && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={abrirPerfilMedico}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    navigate(`/agendamentos?medico=${medico.id}&nome=${encodeURIComponent(medico.nome)}`);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog do Perfil do Médico - Apenas informações públicas */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil do Médico</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{medico.nome}</h3>
                <p className="text-muted-foreground">{medico.crm}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">• Profissional verificado</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Especialidade</h4>
                  <Badge variant="outline">{medico.especialidade}</Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Atendimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Consultas online disponíveis
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Agendamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Para agendar uma consulta, clique no botão "Agendar" no cartão do médico.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => {
                  setDialogAberto(false);
                  navigate(`/agendamentos?medico=${medico.id}&nome=${encodeURIComponent(medico.nome)}`);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}