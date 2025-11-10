#!/usr/bin/env bash
set -euo pipefail

if ! command -v rsync >/dev/null 2>&1; then
  echo "[deploy-hostinger] rsync não encontrado. Instale com 'sudo apt install -y rsync'." >&2
  exit 1
fi

HOST=${HOSTINGER_HOST:-}
USER=${HOSTINGER_USER:-}
REMOTE_PATH=${HOSTINGER_PATH:-}
PORT=${HOSTINGER_PORT:-22}

if [[ -z "$HOST" || -z "$USER" || -z "$REMOTE_PATH" ]]; then
  cat >&2 <<'MSG'
[deploy-hostinger] Configure as variáveis de ambiente:
  HOSTINGER_HOST      -> endereço/IP da VPS (ex.: 203.0.113.10)
  HOSTINGER_USER      -> usuário SSH com permissão de escrita
  HOSTINGER_PATH      -> caminho destino na VPS (ex.: /var/www/consulta-facil-web/dist)
  HOSTINGER_PORT      -> (opcional) porta SSH, padrão 22
MSG
  exit 1
fi

if [[ "${HOSTINGER_SKIP_BUILD:-0}" != "1" ]]; then
  echo "[deploy-hostinger] Gerando build de produção (defina HOSTINGER_SKIP_BUILD=1 para pular esta etapa)..."
  npm run build >/tmp/hostinger-build.log 2>&1 || {
    cat /tmp/hostinger-build.log >&2
    exit 1
  }
fi

if [[ ! -d "dist" ]]; then
  echo "[deploy-hostinger] Pasta dist/ não encontrada. Gere o build com 'npm run build'." >&2
  exit 1
fi

echo "[deploy-hostinger] Criando pasta destino em $USER@$HOST:$REMOTE_PATH"
ssh -p "$PORT" "$USER@$HOST" "mkdir -p '$REMOTE_PATH'"

echo "[deploy-hostinger] Enviando arquivos..."
rsync -az --delete -e "ssh -p $PORT" dist/ "$USER@$HOST:$REMOTE_PATH/"

echo "[deploy-hostinger] Deploy finalizado com sucesso."
