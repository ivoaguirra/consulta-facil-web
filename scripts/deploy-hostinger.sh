#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$PROJECT_ROOT"

CONFIG_FILE_DEFAULT="$PROJECT_ROOT/.env.hostinger"
REQUESTED_CONFIG="${HOSTINGER_ENV_FILE:-$CONFIG_FILE_DEFAULT}"

load_config() {
  local file="$1"
  if [[ -f "$file" ]]; then
    echo "[deploy-hostinger] Carregando variáveis de $file"
    # shellcheck source=/dev/null
    set -a
    source "$file"
    set +a
  fi
}

load_config "$REQUESTED_CONFIG"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      HOSTINGER_HOST="$2"
      shift 2
      ;;
    --host=*)
      HOSTINGER_HOST="${1#*=}"
      shift
      ;;
    --user)
      HOSTINGER_USER="$2"
      shift 2
      ;;
    --user=*)
      HOSTINGER_USER="${1#*=}"
      shift
      ;;
    --path)
      HOSTINGER_PATH="$2"
      shift 2
      ;;
    --path=*)
      HOSTINGER_PATH="${1#*=}"
      shift
      ;;
    --port)
      HOSTINGER_PORT="$2"
      shift 2
      ;;
    --port=*)
      HOSTINGER_PORT="${1#*=}"
      shift
      ;;
    --skip-build)
      HOSTINGER_SKIP_BUILD=1
      shift
      ;;
    --config)
      HOSTINGER_ENV_FILE="$2"
      shift 2
      ;;
    --config=*)
      HOSTINGER_ENV_FILE="${1#*=}"
      shift
      ;;
    --help|-h)
      cat <<'MSG'
Uso: npm run deploy:hostinger [-- [opções]]

Opções:
  --host <HOST>          Hostname ou IP da VPS
  --user <USUÁRIO>       Usuário SSH com permissão de escrita
  --path <CAMINHO>       Caminho remoto para enviar o build (ex.: /var/www/app/dist)
  --port <PORTA>         Porta SSH (padrão: 22)
  --skip-build           Pular etapa de build (usa dist/ atual)
  --config <ARQUIVO>     Carregar variáveis de um arquivo .env (padrão: .env.hostinger)
  -h, --help             Mostrar esta ajuda

As opções sobrescrevem variáveis carregadas do ambiente ou do arquivo .env.
MSG
      exit 0
      ;;
    *)
      echo "[deploy-hostinger] Opção desconhecida: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -n "${HOSTINGER_ENV_FILE:-}" ]]; then
  if [[ "$HOSTINGER_ENV_FILE" != "$REQUESTED_CONFIG" ]]; then
    load_config "$HOSTINGER_ENV_FILE"
  elif [[ ! -f "$HOSTINGER_ENV_FILE" && "$HOSTINGER_ENV_FILE" != "$CONFIG_FILE_DEFAULT" ]]; then
    echo "[deploy-hostinger] Aviso: arquivo $HOSTINGER_ENV_FILE não encontrado." >&2
  fi
fi

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
