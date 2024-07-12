#!/bin/sh

echo "Aguardando o PostgreSQL iniciar..."
while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL iniciado"

# Aplicar as migrações
alembic upgrade head
if [ $? -eq 0 ]; then
  echo "Migrações aplicadas com sucesso"
else
  echo "Erro ao aplicar migrações"
  exit 1
fi

exec "$@"
