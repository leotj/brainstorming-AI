# README

## Architecture Diagram

### C4 Diagram - Context
![C4 Diagram - Context](/docs/C4%20Diagram-Context.jpg)

### C4 Diagram - Containers
![C4 Diagram - Containers](/docs/C4%20Diagram-Containers.jpg)

## How To Run
1. Create Certificate for Neo4j Https

    `openssl genpkey -algorithm RSA -out ./infrastructure/neo4j/certificates/https/private.key -aes256`

    `openssl req -new -key ./infrastructure/neo4j/certificates/https/private.key -out ./infrastructure/neo4j/certificates/https/request.csr`

    `openssl x509 -req -days 365 -in ./infrastructure/neo4j/certificates/https/request.csr -signkey ./infrastructure/neo4j/certificates/https/private.key -out ./infrastructure/neo4j/certificates/https/public.crt`


2. Create Certificate for Neo4j Bolt

    `openssl genpkey -algorithm RSA -out ./infrastructure/neo4j/certificates/bolt/private.key -aes256`

    `openssl req -new -key ./infrastructure/neo4j/certificates/bolt/private.key -out ./infrastructure/neo4j/certificates/bolt/request.csr`

    `openssl x509 -req -days 365 -in ./infrastructure/neo4j/certificates/bolt/request.csr -signkey ./infrastructure/neo4j/certificates/bolt/private.key -out ./infrastructure/neo4j/certificates/bolt/public.crt`

3. Define The Variables Below Inside The .env File

- NEO4J_PASSWORD
- NEO4J_CERTIFICATE_PASSPHRASE
