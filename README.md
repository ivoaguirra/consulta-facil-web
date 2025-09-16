# TeleMed - Plataforma de Telemedicina

Uma plataforma completa de telemedicina desenvolvida com React, TypeScript e Tailwind CSS, oferecendo sistema de agendamentos, consultas virtuais, prontuário eletrônico e gestão de pagamentos.

## 🚀 Funcionalidades Principais

### Sistema Multi-usuário
- **Pacientes**: Agendamento de consultas, participação em videochamadas, acesso ao prontuário
- **Médicos**: Gestão de consultas, atendimento virtual, criação de prontuários
- **Clínicas**: Administração de médicos, acompanhamento de pacientes e relatórios

### Core Features
- ✅ **Autenticação JWT** com diferentes perfis de usuário
- ✅ **Dashboard personalizado** para cada tipo de usuário
- ✅ **Sistema de agendamentos** com aprovação médica
- ✅ **Videoconferência integrada** via Jitsi Meet
- ✅ **Prontuário eletrônico** completo e seguro
- ✅ **Pagamentos integrados** com simulação Stripe
- ✅ **Interface responsiva** e acessível
- ✅ **Tema médico profissional** com design system consistente

## 🏗️ Arquitetura

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM
- **Estado**: React Context API
- **Formulários**: React Hook Form + Zod
- **Icons**: Lucide React
- **Build**: Vite
- **Videoconferência**: Jitsi Meet (iframe)

### Estrutura de Diretórios
```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Layout
│   └── ui/              # Componentes shadcn/ui
├── contexts/            # Context API (Auth)
├── pages/               # Páginas principais
├── types/               # Tipos TypeScript
├── lib/                 # Utilitários
└── hooks/               # Custom hooks
```

## 🎨 Design System

### Cores Principais
- **Azul Médico**: `hsl(210, 85%, 45%)` - Cor primária
- **Verde Saúde**: `hsl(142, 76%, 36%)` - Cor secundária
- **Tons Neutros**: Escala de cinzas profissionais
- **Estados**: Success, Warning, Error com cores semânticas

### Componentes Customizados
- Cards com elevação sutil
- Botões com variações médicas
- Badges de status coloridos
- Formulários com validação visual
- Tabelas responsivas

## 📋 Guia de Uso

### Para Pacientes
1. **Cadastro/Login**: Acesse com perfil de paciente
2. **Agendamento**: Solicite consultas com médicos disponíveis
3. **Consultas**: Participe de videochamadas no horário agendado
4. **Prontuário**: Visualize seu histórico médico
5. **Pagamentos**: Quite suas consultas de forma segura

### Para Médicos
1. **Dashboard**: Visualize agenda e estatísticas
2. **Agendamentos**: Aprove/rejeite solicitações de consultas
3. **Consultas**: Realize atendimentos por videoconferência
4. **Prontuários**: Crie e gerencie registros médicos
5. **Pacientes**: Acompanhe histórico dos pacientes

### Para Clínicas
1. **Visão Geral**: Dashboard executivo com métricas
2. **Médicos**: Gerencie equipe médica
3. **Relatórios**: Acesse relatórios financeiros e operacionais
4. **Pacientes**: Visualize base de pacientes cadastrados

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos
```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Navegue até o diretório
cd telemed-platform

# 3. Instale dependências
npm install

# 4. Execute em desenvolvimento
npm run dev

# 5. Acesse http://localhost:8080
```

### Dados de Teste
Para testar a aplicação, use qualquer email e senha:
- **Paciente**: usuario@exemplo.com / 123456
- **Médico**: medico@exemplo.com / 123456  
- **Clínica**: clinica@exemplo.com / 123456

## 🔐 Segurança

### Implementadas
- Autenticação por Context API
- Rotas protegidas por role
- Validação de formulários
- Sanitização de dados
- Interface responsiva

### Para Produção
- Integrar com Supabase Auth
- Implementar HTTPS
- Validação backend
- Rate limiting
- Logs de auditoria

## 🚀 Deploy

### Lovable (Recomendado)
1. Acesse o [projeto Lovable](https://lovable.dev/projects/566fe9eb-df57-4daa-8c37-3124af2a2f4e)
2. Clique em Share → Publish
3. Configure domínio personalizado se necessário

### Outras Opções
- **Vercel**: `npm run build` + deploy
- **Netlify**: Conecte repositório Git
- **GitHub Pages**: Configure workflow de CI/CD

## 🔄 Próximas Funcionalidades

- [ ] Integração real com Supabase
- [ ] Pagamentos reais via Stripe
- [ ] Notificações push
- [ ] Chat em tempo real
- [ ] Histórico de exames
- [ ] Prescrições digitais
- [ ] Relatórios avançados
- [ ] App mobile (React Native)

## 📞 Videoconferência

A integração com Jitsi Meet permite:
- Salas virtuais exclusivas por consulta
- Controles de áudio/vídeo
- Compartilhamento de tela
- Chat durante consulta
- Gravação (configurável)

## 💳 Sistema de Pagamentos

- Interface de checkout simulada
- Integração preparada para Stripe
- Gestão de faturas
- Histórico de transações
- Diferentes métodos de pagamento

## 📱 Responsividade

- Mobile-first design
- Breakpoints otimizados
- Touch-friendly interface
- Performance otimizada
- PWA ready

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📧 Contato

Para dúvidas ou suporte, entre em contato através do [Lovable](https://lovable.dev).

---

**TeleMed** - Conectando pacientes e médicos através da tecnologia 🏥💙
