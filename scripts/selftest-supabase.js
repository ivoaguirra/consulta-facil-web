#!/usr/bin/env node
/*
  selftest-supabase.js — Autoteste E2E para React + Supabase + Jitsi
  Fluxo: verifica conexão Supabase → testa edge functions → simula fluxo de usuário
  Uso: node scripts/selftest-supabase.js
*/
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[selftest] ❌ ERRO: Variáveis do Supabase não definidas. Execute: node scripts/check-env.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    console.log('[selftest] ✅ Conexão com Supabase OK');
    return true;
  } catch (error) {
    console.error('[selftest] ❌ Falha na conexão com Supabase:', error.message);
    return false;
  }
}

async function testJitsiFunction() {
  try {
    const consultaId = 'test-' + Date.now();
    const { data, error } = await supabase.functions.invoke('gerar-sala-jitsi', {
      body: { consultaId }
    });
    
    if (error) throw error;
    if (!data || !data.urlSala) throw new Error('URL da sala não retornada');
    
    console.log('[selftest] ✅ Edge function gerar-sala-jitsi OK');
    console.log('[selftest] 🎥 URL de teste:', data.urlSala);
    return true;
  } catch (error) {
    console.error('[selftest] ❌ Falha na edge function Jitsi:', error.message);
    return false;
  }
}

async function testAuthFlow() {
  try {
    // Gerar email único para teste
    const testEmail = `teste_${Date.now()}@exemplo.com`;
    const testPassword = 'senha123456';
    
    // Testar cadastro
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          nome: 'Usuário Teste',
          role: 'paciente'
        }
      }
    });
    
    if (signUpError) throw signUpError;
    console.log('[selftest] ✅ Cadastro de usuário OK');
    
    // Testar login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) throw signInError;
    console.log('[selftest] ✅ Login de usuário OK');
    
    // Logout
    await supabase.auth.signOut();
    console.log('[selftest] ✅ Logout OK');
    
    return true;
  } catch (error) {
    console.error('[selftest] ❌ Falha no fluxo de autenticação:', error.message);
    return false;
  }
}

async function testTableAccess() {
  try {
    // Testar leitura das tabelas principais
    const tables = ['profiles', 'agendamentos', 'clinicas'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && !error.message.includes('permission denied')) {
        throw new Error(`Erro na tabela ${table}: ${error.message}`);
      }
    }
    
    console.log('[selftest] ✅ Acesso às tabelas OK');
    return true;
  } catch (error) {
    console.error('[selftest] ❌ Falha no acesso às tabelas:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('[selftest] 🚀 Iniciando autoteste do projeto de telemedicina...\n');
  
  const tests = [
    { name: 'Conexão Supabase', fn: testSupabaseConnection },
    { name: 'Acesso às tabelas', fn: testTableAccess },
    { name: 'Edge function Jitsi', fn: testJitsiFunction },
    { name: 'Fluxo de autenticação', fn: testAuthFlow }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`[selftest] ❌ Erro no teste "${test.name}":`, error.message);
      failed++;
    }
    console.log(''); // Linha em branco
  }
  
  console.log(`\n[selftest] 📊 Resultado: ${passed} ✅ | ${failed} ❌`);
  
  if (failed === 0) {
    console.log('[selftest] 🎉 TODOS OS TESTES PASSARAM! Projeto funcionando corretamente.');
    process.exit(0);
  } else {
    console.log('[selftest] 💥 ALGUNS TESTES FALHARAM. Verifique a configuração.');
    process.exit(1);
  }
}

// Executar testes
runAllTests().catch(error => {
  console.error('[selftest] ❌ Erro fatal:', error);
  process.exit(1);
});