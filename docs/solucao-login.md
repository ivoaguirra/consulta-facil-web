# 🚨 SOLUÇÃO: Não consigo fazer login após cadastro

## Problema
Após se cadastrar, você não consegue fazer login e recebe erro "Invalid login credentials".

## Causa
O Supabase está configurado para exigir confirmação de email. Quando você se cadastra, recebe um email de confirmação que precisa clicar antes de poder fazer login.

## Solução (Recomendada para Ambiente de Testes)

### Passo 1: Desabilitar Confirmação de Email
1. Acesse: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/providers
2. Role até "Email" (primeiro item da lista)
3. Clique em "Email" para expandir
4. **DESMARQUE** a opção "Confirm email"
5. Clique em "Save"

### Passo 2: Tentar Login Novamente
Agora você pode fazer login normalmente com:
- **Email**: ivo.aguirra@gmail.com
- **Senha**: juli1570

---

## Alternativa: Confirmar o Email

Se você quiser manter a confirmação de email ativa (mais seguro para produção):

1. Verifique seu email (ivo.aguirra@gmail.com)
2. Procure por email do Supabase com assunto "Confirm your signup"
3. Clique no link de confirmação
4. Depois você poderá fazer login

---

## Para Usuários de Teste

Se você quiser criar usuários de teste sem precisar confirmar email:

1. Desabilite "Confirm email" (como descrito acima)
2. Ou crie usuários manualmente no painel do Supabase:
   - https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/users
   - Clique em "Add user" → "Create new user"
   - Marque "Auto Confirm User"

---

## Configuração Recomendada

### Desenvolvimento/Testes
- ❌ Confirm email: **DESABILITADO**
- ✅ Facilita testes rápidos

### Produção
- ✅ Confirm email: **HABILITADO**
- ✅ Mais seguro, evita spam/bots

---

**Criado em**: 2025-10-07  
**Projeto**: sqnukbqodqqmrwsggtcv
