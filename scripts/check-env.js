#!/usr/bin/env node
/*
  check-env.js — Verifica variáveis obrigatórias do Supabase, cria .env.local se necessário
  Uso: node scripts/check-env.js
*/
const fs = require('fs');
const path = require('path');

// Carregar .env existente
const envPath = path.resolve('.env');
const envLocalPath = path.resolve('.env.local');
const envExamplePath = path.resolve('.env.example');

let envContent = '';
if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, 'utf-8');
} else if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
}

// Parse variáveis existentes
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const REQUIRED = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY', 
  'VITE_SUPABASE_PROJECT_ID'
];

const OPTIONAL = [
  'VITE_JITSI_BASE_URL'
];

const report = [];
let missing = [];

REQUIRED.forEach((key) => {
  if (!envVars[key] || String(envVars[key]).trim() === '') {
    missing.push(key);
  }
});

if (missing.length === 0) {
  console.log('[check-env] ✅ OK: Todas as variáveis obrigatórias estão definidas.');
  
  // Verificar opcionais
  OPTIONAL.forEach(key => {
    if (!envVars[key]) {
      report.push(`[check-env] ⚠️  Variável opcional não definida: ${key}`);
    }
  });
  
  if (report.length > 0) {
    console.log(report.join('\n'));
  }
  
  process.exit(0);
}

// Sugerir valores padrão baseados nos existentes ou placeholders
const suggestions = {
  VITE_SUPABASE_URL: envVars.VITE_SUPABASE_URL || 'https://sua-url.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: envVars.VITE_SUPABASE_PUBLISHABLE_KEY || 'sua-chave-publica-aqui',
  VITE_SUPABASE_PROJECT_ID: envVars.VITE_SUPABASE_PROJECT_ID || 'seu-project-id',
  VITE_JITSI_BASE_URL: envVars.VITE_JITSI_BASE_URL || 'https://meet.jit.si'
};

// Adicionar variáveis faltantes
missing.forEach((key) => {
  envVars[key] = suggestions[key] || '';
  report.push(`[check-env] ➕ Adicionado placeholder para ${key}`);
});

// Gerar conteúdo do .env
const newContent = Object.entries(envVars)
  .filter(([key, value]) => key && value !== undefined)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n') + '\n';

// Escrever arquivo
const targetPath = envLocalPath;
fs.writeFileSync(targetPath, newContent);

console.log(report.join('\n'));
console.log(`[check-env] 📝 Gerado/atualizado ${path.basename(targetPath)}`);
console.log('[check-env] 🔧 Revise as variáveis e ajuste os valores reais do seu projeto Supabase.');

process.exit(missing.length > 0 ? 1 : 0);