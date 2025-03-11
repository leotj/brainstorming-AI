#!/bin/bash

# Read .env file without exporting to environment
if [ -f .env ]; then
  # Parse .env file securely
  SURREALDB_USERNAME=$(grep -v '^#' .env | grep SURREALDB_USERNAME | cut -d '=' -f2)
  SURREALDB_PASSWORD=$(grep -v '^#' .env | grep SURREALDB_PASSWORD | cut -d '=' -f2)
  SURREALDB_NAMESPACE=$(grep -v '^#' .env | grep SURREALDB_NAMESPACE | cut -d '=' -f2)
  SURREALDB_DATABASE=$(grep -v '^#' .env | grep SURREALDB_DATABASE | cut -d '=' -f2)
fi

echo "Waiting for SurrealDB to start..."
until curl -sSf http://localhost:8000/health >/dev/null 2>&1; do
  echo "SurrealDB not ready yet, waiting..."
  sleep 5
done

echo "SurrealDB is up! Importing schema..."
# Use variables directly without showing them in process list
surreal import \
  --endpoint http://localhost:8000 \
  --namespace "$SURREALDB_NAMESPACE" \
  --database "$SURREALDB_DATABASE" \
  --username "$SURREALDB_USERNAME" \
  --password "$SURREALDB_PASSWORD" \
  ./backend-service/src/surrealdb/schema.surql

echo "Schema import completed!"
