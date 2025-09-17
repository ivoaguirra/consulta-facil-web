# Integração Jitsi Meet - TeleMed

## Funcionalidades Implementadas

### 1. **Backend (Edge Function Supabase)**
- **Endpoint**: `GET /functions/v1/gerar-sala-jitsi/{consultaId}`
- **Funcionalidade**: Gera sala única e segura para cada consulta
- **Hash**: Nome da sala baseado em SHA-256 do ID da consulta
- **Autenticação**: Validação de token Supabase
- **Configuração**: Personalização do Jitsi Meet (idioma PT, botões, etc.)

### 2. **Frontend (React Components)**

#### `useJitsiMeet` Hook
- Gerenciamento de estado da videochamada
- Conexão com edge function
- Controle de sala e participantes

#### `JitsiMeetComponent`
- Componente React para integração Jitsi
- Controles personalizados (áudio, vídeo, tela)
- Indicadores de status e participantes
- Suporte a fullscreen

#### `Videochamada` Page
- Rota: `/video/:consultaId`
- Teste de dispositivos obrigatório
- Interface completa de videochamada
- Timer de duração da consulta

### 3. **Fluxo de Uso**

1. **Acesso à Consulta**: Na página de consultas, clique em "Iniciar Videochamada"
2. **Teste de Dispositivos**: Verificação obrigatória de câmera e microfone
3. **Entrada na Sala**: Acesso direto ao Jitsi Meet integrado
4. **Controles**: Botões personalizados para áudio, vídeo e compartilhamento
5. **Finalização**: Timer e retorno automático para lista de consultas

### 4. **Recursos Técnicos**

#### Segurança
- Hash único por consulta (SHA-256)
- Autenticação via Supabase
- Validação de tokens
- URLs temporárias e não reutilizáveis

#### Interface
- Design responsivo e moderno
- Controles intuitivos
- Indicadores visuais de status
- Suporte a fullscreen

#### Integração
- Script dinâmico do Jitsi Meet
- API Externa oficial
- Configuração personalizada
- Suporte a múltiplos dispositivos

### 5. **Configurações do Jitsi**

```javascript
configOverwrite: {
  startAudioOnly: false,
  enableWelcomePage: false,
  prejoinPageEnabled: true,
  disableThirdPartyRequests: true,
  defaultLanguage: 'pt',
  enableClosePage: false,
  toolbarButtons: [
    'microphone', 'camera', 'desktop', 
    'fullscreen', 'hangup', 'chat', 
    'raisehand', 'settings'
  ]
}
```

### 6. **Estrutura de Arquivos**

```
src/
├── hooks/
│   └── useJitsiMeet.ts          # Hook principal
├── components/videochamada/
│   └── JitsiMeetComponent.tsx   # Componente Jitsi
├── pages/
│   └── Videochamada.tsx         # Página principal
└── types/medical.ts             # Tipos TypeScript

supabase/functions/
└── gerar-sala-jitsi/
    └── index.ts                 # Edge function
```

### 7. **Próximos Passos (Expansibilidade)**

#### Autenticação Jitsi Privada
- JWT tokens para salas privadas
- Moderadores e permissões
- Gravação de consultas

#### Funcionalidades Avançadas
- Chat integrado
- Compartilhamento de arquivos
- Whiteboard médico
- Prontuário em tempo real

#### Métricas e Analytics
- Duração das consultas
- Qualidade da conexão
- Relatórios de uso

### 8. **Como Usar**

1. **Acessar Consultas**: Vá para `/consultas`
2. **Iniciar Videochamada**: Clique no botão "Iniciar Videochamada"
3. **Testar Dispositivos**: Complete o teste obrigatório
4. **Entrar na Consulta**: Clique em "Entrar na Consulta"
5. **Usar Controles**: Áudio, vídeo, compartilhamento de tela
6. **Finalizar**: Clique em "Sair da Consulta"

### 9. **Dependências**

- **Jitsi Meet External API**: Script carregado dinamicamente
- **Supabase**: Autenticação e edge functions
- **React Router**: Navegação entre páginas
- **Lucide React**: Ícones da interface

### 10. **Observações**

- ✅ Funciona com a stack atual (React + Supabase)
- ✅ Design responsivo e moderno
- ✅ Segurança implementada
- ✅ Teste de dispositivos integrado
- ✅ Controles personalizados
- ✅ Nomes em português conforme solicitado
- ✅ Arquitetura limpa e expansível

A implementação está pronta para uso e pode ser facilmente expandida com novas funcionalidades conforme necessário.