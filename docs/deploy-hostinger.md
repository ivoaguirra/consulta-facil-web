# Guia de Deploy na VPS da Hostinger

Este guia descreve, passo a passo, como preparar uma VPS Ubuntu/Debian da Hostinger para hospedar o projeto **TeleMed**. Todas as etapas estão em português e consideram um acesso SSH com privilégios de `sudo`.

> 🛟 **Recomendação:** execute os comandos em blocos e só avance quando cada etapa finalizar sem erros.

## 1. Preparar o ambiente da VPS

```bash
# Atualize a lista de pacotes e aplique correções de segurança
sudo apt update && sudo apt upgrade -y

# Instale utilitários básicos
sudo apt install -y build-essential curl git ufw
```

> Se o firewall (UFW) ainda não estiver habilitado, libere a porta de SSH e HTTP/HTTPS antes de ativá-lo:
>
> ```bash
> sudo ufw allow OpenSSH
> sudo ufw allow http
> sudo ufw allow https
> sudo ufw enable
> ```

## 2. Instalar Node.js (via NodeSource)

```bash
# Escolha a versão LTS (20.x) compatível com o projeto
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instale Node.js e npm
sudo apt install -y nodejs

# Verifique se as versões estão corretas
node -v
npm -v
```

Caso prefira usar `nvm`, instale-o e depois execute `nvm install 20`.

## 3. Criar a pasta da aplicação

Defina uma pasta padrão (ex.: `/var/www/consulta-facil-web`). O comando abaixo cria a estrutura e aplica permissões ao usuário atual:

```bash
APP_DIR=/var/www/consulta-facil-web
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER":"$USER" "$APP_DIR"
```

Se desejar manter tudo dentro do `home`, utilize `APP_DIR=$HOME/apps/consulta-facil-web`.

## 4. Clonar o repositório

```bash
cd "$APP_DIR"
# Substitua a URL abaixo pela do seu fork ou repositório privado
git clone https://github.com/SEU_USUARIO/consulta-facil-web.git .
```

Se você já realizou o clone anteriormente, atualize o código com `git pull`.

## 5. Configurar variáveis de ambiente

O projeto fornece um script que gera placeholders no arquivo `.env.local`.

```bash
# Instale as dependências
npm install

# Gere o arquivo .env.local com chaves padrão
npm run setup
```

Edite `.env.local` e substitua os valores de Supabase/Jitsi pelas credenciais reais do seu projeto.

Variáveis principais:

- `VITE_SUPABASE_URL` – URL do projeto Supabase (ex.: `https://abc123.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` – chave pública (`anon key`)
- `VITE_SUPABASE_PROJECT_ID` – ID do projeto (opcional, usado em integrações internas)
- `VITE_SUPABASE_FUNCTIONS_URL` – (opcional) URL base das Edge Functions. Se não informar, o app usa `${VITE_SUPABASE_URL}/functions/v1`.
- `VITE_JITSI_BASE_URL` – (opcional) domínio do Jitsi Meet. Padrão: `https://meet.jit.si`.

## 6. Construir o frontend

```bash
npm run build
```

O resultado será armazenado na pasta `dist/`.

## 7. Executar em produção

A forma mais simples é servir os arquivos estáticos da pasta `dist` com algum servidor HTTP.

### Opção A: usar o `serve`

```bash
sudo npm install -g serve
serve -s dist -l 4173
```

### Opção B: usar Nginx como proxy reverso

1. Instale o Nginx:
   ```bash
   sudo apt install -y nginx
   ```
2. Crie um arquivo de configuração em `/etc/nginx/sites-available/consulta-facil` com o conteúdo:
   ```nginx
   server {
     listen 80;
     server_name exemplo.com.br;

     root /var/www/consulta-facil-web/dist;
     index index.html;

     location / {
       try_files $uri /index.html;
     }
   }
   ```
3. Ative o site e recarregue o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/consulta-facil /etc/nginx/sites-enabled/consulta-facil
   sudo nginx -t
   sudo systemctl reload nginx
   ```

Para HTTPS, configure o [Certbot](https://certbot.eff.org/) após apontar o domínio para a VPS.

## 8. Automatizar o processo (opcional)

### 8.1. Script local para subir o build via SSH

O repositório possui o script [`scripts/deploy-hostinger.sh`](../scripts/deploy-hostinger.sh) que envia a pasta `dist/` via `rsync` para a VPS (certifique-se de ter `ssh` e `rsync` instalados na máquina local).

1. Defina as variáveis de ambiente no seu terminal local (substitua pelos seus dados):
   ```bash
   export HOSTINGER_HOST=203.0.113.10
   export HOSTINGER_USER=seu_usuario
   export HOSTINGER_PATH=/var/www/consulta-facil-web/dist
   export HOSTINGER_PORT=22 # opcional, 22 é o padrão
   ```
2. Execute o deploy:
   ```bash
   npm run deploy:hostinger
   ```

O script dispara `npm run build` automaticamente (defina `HOSTINGER_SKIP_BUILD=1` se já tiver um build pronto), garante que a pasta remota exista e sincroniza os arquivos de forma incremental.

### 8.2. Script dentro da VPS

Caso prefira atualizar tudo diretamente na VPS, crie um script `deploy.sh` dentro dela:

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/var/www/consulta-facil-web
cd "$APP_DIR"

git pull
npm install
npm run setup
npm run build
```

Depois, execute `chmod +x deploy.sh` e rode `./deploy.sh` a cada atualização.

## 9. Manter o serviço ativo

Se optar por um servidor Node (ex.: `serve`), utilize o [PM2](https://pm2.keymetrics.io/):

```bash
sudo npm install -g pm2
pm2 serve dist 4173 --name telemed
pm2 save
pm2 startup systemd
```

Assim, o serviço reinicia automaticamente após reboots.

---

Seguindo os passos acima, a aplicação estará disponível na sua VPS Hostinger com as pastas e dependências corretas.
