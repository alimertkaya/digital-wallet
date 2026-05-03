#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.local"

# ── .env.local dosyası yoksa oluştur ─────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo ""
  echo "⚙️  İlk kurulum: .env.local dosyası oluşturuluyor..."
  JWT_SECRET=$(openssl rand -base64 32)
  ENCRYPTION_KEY=$(openssl rand -base64 32)
  cat > "$ENV_FILE" <<EOF
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
EOF
  echo "✅ .env.local oluşturuldu. Bir dahaki çalıştırmada aynı key'ler kullanılır."
  echo ""
fi

# ── .env.local oku ───────────────────────────────────────────────────────────
export $(grep -v '^#' "$ENV_FILE" | xargs)

# ── Port kontrolü ─────────────────────────────────────────────────────────────
if lsof -ti :8080 > /dev/null 2>&1; then
  echo "⚠️  Port 8080 kullanımda, eski proses kapatılıyor..."
  lsof -ti :8080 | xargs kill -9
  sleep 1
fi

# ── Başlat ────────────────────────────────────────────────────────────────────
echo "🚀 Digital Wallet Backend başlatılıyor..."
echo "   Swagger UI → http://localhost:8080/swagger-ui.html"
echo "   Durdurmak için: Ctrl + C"
echo ""

cd "$SCRIPT_DIR"
mvn spring-boot:run -Dspring-boot.run.profiles=dev
