# 🚨 SOLUÇÃO: Não consigo fazer login após cadastro

## Problema
Após se cadastrar, você não consegue fazer login e recebe erro "Invalid login credentials".

## Causa Raiz IDENTIFICADA ✅
O email **ivo.aguirra@gmail.com JÁ ESTÁ CONFIRMADO** no banco de dados (confirmado em 2025-09-17), mas a senha cadastrada não está correta. Há uma incompatibilidade entre a senha que você está tentando usar e a que está armazenada no Supabase.

## 🔧 Solução IMEDIATA (Execute AGORA)

### Opção 1: Resetar a Senha do Usuário Existente (RECOMENDADO)

1. **Acesse o painel de usuários do Supabase:**
   https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/users

2. **Encontre o usuário ivo.aguirra@gmail.com** na lista

3. **Clique nos 3 pontinhos (⋮)** ao lado do usuário

4. **Selecione "Send Password Recovery"** ou **"Reset Password"**

5. **Defina uma nova senha** (exemplo: `NovaSenh@123`) e confirme

6. **Tente fazer login** com a nova senha

### Opção 2: Deletar e Recriar o Usuário

1. **Acesse:** https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/users

2. **Encontre ivo.aguirra@gmail.com** e clique nos 3 pontinhos (⋮)

3. **Delete o usuário**

4. **Na aplicação, faça cadastro novamente** com os dados:
   - Email: ivo.aguirra@gmail.com
   - Senha: juli1570 (ou outra de sua preferência)

5. **IMPORTANTE:** Antes de cadastrar, desabilite a confirmação de email:
   - Acesse: https://supabase.com/dashboard/project/sqnukbqodqqmrwsggtcv/auth/providers
   - Role até "Email" (primeiro item)
   - **DESMARQUE** "Confirm email"
   - Clique em "Save"

6. **Agora faça o cadastro** e o login funcionará imediatamente

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
