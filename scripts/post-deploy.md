# ✅ Checklist Pós-Deploy - Plataforma TeleMed

## 🔐 1. Configuração de Variáveis de Ambiente

### Vercel/Netlify
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` configurado  
- [ ] `VITE_SUPABASE_PROJECT_ID` configurado
- [ ] `VITE_JITSI_BASE_URL` = `https://meet.jit.si`
- [ ] `VITE_APP_URL` = URL de produção (ex: `https://telemed.com.br`)
- [ ] `VITE_SENTRY_DSN` configurado (opcional)

### Supabase Edge Functions
- [ ] Acessar: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/settings/functions
- [ ] Adicionar secret `APP_URL` com o domínio de produção
- [ ] Verificar que functions estão deployed

---

## 🌐 2. CORS do Supabase

### Configurar URLs Autorizadas
- [ ] Acessar: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/settings/api
- [ ] Em "API Settings" → "URL Configuration"
- [ ] Adicionar domínio de produção em "Site URL"
- [ ] Adicionar domínio em "Redirect URLs" (para autenticação)

Exemplo:
```
Site URL: https://telemed.com.br
Redirect URLs: https://telemed.com.br/**
```

---

## 🔒 3. Autenticação

### Configurar Provedores de Auth
- [ ] Acessar: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/providers
- [ ] Email/Password está ATIVADO
- [ ] **IMPORTANTE:** Desabilitar "Confirm email" em dev/staging (opcional em prod)
- [ ] Configurar templates de email (opcional)

### RLS (Row Level Security)
- [ ] Verificar que todas as tabelas sensíveis têm RLS ativo
- [ ] Testar que usuários só veem seus próprios dados
- [ ] Comandos úteis no SQL Editor:

```sql
-- Verificar RLS em todas as tabelas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Listar políticas RLS
SELECT * FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🎥 4. Jitsi Meet

### Verificar Configuração
- [ ] Testar videochamada em ambiente de produção
- [ ] Verificar que áudio/vídeo funcionam
- [ ] Testar compartilhamento de tela
- [ ] Verificar em mobile (iOS Safari e Chrome Android)

### Troubleshooting Comum
- Câmera/mic não funcionam → Verificar HTTPS ativo
- Erro de permissão → Checar Permissions-Policy header
- Tela preta → Verificar CSP permite `https://meet.jit.si`

---

## 🔐 5. Headers de Segurança

### Verificar Headers HTTP
Use ferramenta: https://securityheaders.com/

- [ ] `Strict-Transport-Security` presente
- [ ] `Content-Security-Policy` presente e não está bloqueando recursos
- [ ] `Permissions-Policy` permite camera e microphone
- [ ] `X-Frame-Options` configurado
- [ ] `X-Content-Type-Options` = nosniff

### Testar CSP
Abrir console do navegador e verificar que não há erros de:
- `Refused to load script`
- `Refused to connect to`
- `Refused to frame`

Se houver, ajustar CSP em `vercel.json` ou configuração do CDN.

---

## 🧪 6. Testes Funcionais

### Fluxo Completo de Consulta
- [ ] Login funciona sem erros
- [ ] Agendar consulta funciona
- [ ] Tela de teste de dispositivos mostra vídeo local
- [ ] Entrar na videochamada funciona (< 5s)
- [ ] Áudio funciona (fazer teste falando)
- [ ] Vídeo funciona (ativar/desativar câmera)
- [ ] Compartilhar tela funciona
- [ ] Sair da consulta e finalizar funciona
- [ ] PDF de prescrição é gerado (quando implementado)

### Teste em Diferentes Navegadores
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

---

## 📊 7. Monitoramento

### Logs do Supabase
- [ ] Verificar Edge Function Logs: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/functions/gerar-sala-jitsi/logs
- [ ] Verificar Auth Logs para erros de login
- [ ] Verificar Database Logs para queries lentas

### Sentry (se configurado)
- [ ] Verificar que erros estão sendo capturados
- [ ] Configurar alertas para erros críticos
- [ ] Adicionar source maps para stack traces legíveis

---

## 🚀 8. Performance

### Lighthouse Score
Rodar: https://pagespeed.web.dev/

Metas:
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 80

### Otimizações Comuns
- [ ] Imagens otimizadas (WebP, lazy loading)
- [ ] Code splitting ativo
- [ ] Bundle size < 500KB (initial)
- [ ] Time to Interactive < 3s

---

## 📝 9. Documentação

- [ ] README.md atualizado com:
  - [ ] Instruções de setup
  - [ ] Variáveis de ambiente necessárias
  - [ ] Como rodar localmente
  - [ ] Como fazer deploy
- [ ] Guia de troubleshooting criado
- [ ] Credenciais de teste documentadas (se aplicável)

---

## ✅ 10. Checklist Final

### Pré-Produção
- [ ] Todos os testes manuais passaram
- [ ] Logs não mostram erros críticos
- [ ] Headers de segurança configurados
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente em produção
- [ ] HTTPS ativo e certificado válido

### Pós-Produção
- [ ] Monitorar logs nas primeiras 24h
- [ ] Testar com usuários reais
- [ ] Coletar feedback de UX
- [ ] Documentar issues conhecidos

---

## 🆘 Troubleshooting Rápido

### Erro: "Failed to fetch"
1. Verificar que Supabase URL está correto
2. Verificar CORS no Supabase
3. Verificar que API keys estão corretas

### Câmera/Mic não funcionam
1. Verificar que site está em HTTPS
2. Verificar Permissions-Policy header
3. Testar em navegador diferente
4. Ver console do browser para erros específicos

### Videochamada não conecta
1. Verificar que Jitsi URL está correta
2. Verificar CSP permite `meet.jit.si`
3. Verificar logs da Edge Function `gerar-sala-jitsi`
4. Testar com sala do Jitsi direto: https://meet.jit.si/teste123

---

**Última Atualização:** 2025-10-07  
**Responsável:** Equipe TeleMed
