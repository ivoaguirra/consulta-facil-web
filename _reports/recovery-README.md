# 🏥 Telemedicina - Modo Recuperação

Este projeto é uma aplicação de telemedicina construída com **React + Supabase + Jitsi Meet**.

## 🚀 Modo Recuperação - Setup Rápido

### 1. Verificar Dependências

```bash
# Instalar dependências
npm install

# Verificar variáveis de ambiente
npm run check-env
```

### 2. Configurar Supabase

1. Edite o arquivo `.env.local` criado pelo script
2. Adicione suas credenciais reais do Supabase:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

### 3. Executar Autoteste

```bash
# Teste completo do sistema
npm run selftest

# OU execute o processo completo de recuperação
npm run recovery
```

### 4. Iniciar Aplicação

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm run preview
```

## 🧪 Scripts de Diagnóstico

| Script | Descrição |
|--------|-----------|
| `npm run check-env` | Verifica variáveis de ambiente obrigatórias |
| `npm run selftest` | Teste E2E completo (Supabase + Jitsi + Auth) |
| `npm run recovery` | Processo completo de recuperação |
| `npm run health` | Check básico de saúde do projeto |

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Videochamadas**: Jitsi Meet
- **Roteamento**: React Router
- **UI**: Shadcn/ui components

## 📋 Funcionalidades Testadas

O `selftest` verifica:

1. ✅ **Conexão Supabase** - Conectividade com o banco
2. ✅ **Acesso às Tabelas** - RLS policies funcionando
3. ✅ **Edge Function Jitsi** - Geração de salas de videochamada
4. ✅ **Fluxo de Autenticação** - Cadastro, login e logout

## 🔧 Troubleshooting

### Erro: "Variáveis do Supabase não definidas"
```bash
npm run check-env
# Edite .env.local com suas credenciais reais
```

### Erro: "Falha na conexão com Supabase"
- Verifique se a URL e chave estão corretas
- Confirme se o projeto Supabase está ativo
- Teste no painel do Supabase

### Erro: "Edge function gerar-sala-jitsi falha"
- Verifique se a função foi deployada no Supabase
- Confira logs da edge function no dashboard

### Erro: "Falha no fluxo de autenticação"
- Verifique RLS policies nas tabelas
- Confirme se a tabela `profiles` existe
- Verifique triggers de criação de perfil

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── contexts/           # Contextos React
├── integrations/       # Integrações (Supabase)
└── lib/                # Utilitários

supabase/
├── functions/          # Edge Functions
└── config.toml         # Configuração do Supabase

scripts/
├── check-env.js        # Verificação de ambiente
└── selftest-supabase.js # Autoteste E2E
```

## 🆘 Suporte

Se os testes continuarem falhando:

1. Verifique o console do navegador para erros JavaScript
2. Confirme as configurações no painel do Supabase
3. Teste as edge functions diretamente no Supabase
4. Verifique se todas as tabelas e policies estão criadas

---

**Última atualização**: $(date +%Y-%m-%d)