import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Calendar,
  FileText,
  Users,
  Video,
  CreditCard,
  BarChart3,
  Stethoscope,
  Building2,
  UserPlus,
  Clock,
  TestTube
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    roles: ['clinica', 'medico', 'paciente'],
  },
  {
    href: '/agendamentos',
    label: 'Agendamentos',
    icon: Calendar,
    roles: ['medico', 'paciente'],
  },
  {
    href: '/consultas',
    label: 'Consultas',
    icon: Video,
    roles: ['medico', 'paciente'],
  },
  {
    href: '/prontuarios',
    label: 'Prontuários',
    icon: FileText,
    roles: ['medico', 'paciente'],
  },
  {
    href: '/documentos',
    label: 'Documentos Médicos',
    icon: FileText,
    roles: ['medico'],
  },
  {
    href: '/medicos',
    label: 'Médicos',
    icon: Stethoscope,
    roles: ['clinica', 'paciente'],
  },
  {
    href: '/pacientes',
    label: 'Pacientes',
    icon: Users,
    roles: ['clinica', 'medico'],
  },
  {
    href: '/clinicas',
    label: 'Clínicas',
    icon: Building2,
    roles: ['medico'],
  },
  {
    href: '/pagamentos',
    label: 'Pagamentos',
    icon: CreditCard,
    roles: ['clinica', 'paciente'],
  },
  {
    href: '/historico',
    label: 'Histórico',
    icon: Clock,
    roles: ['medico', 'paciente'],
  },
  {
    href: '/procedimentos',
    label: 'Procedimentos',
    icon: UserPlus,
    roles: ['medico', 'clinica'],
  },
  {
    href: '/teste-camera',
    label: 'Teste de Câmera',
    icon: TestTube,
    roles: ['medico', 'clinica'],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};