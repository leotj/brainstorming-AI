# README

## How To Run

1. Set up environment variables
    ```bash
    # Copy the example environment file
    cp .env.example .env

    # Edit .env with your configuration values
    ```
2. Start the application
    ```bash
    docker-compose up -d
    ```
3. First-time setup
    > Note: Only required for initial setup
    If this is your first time running the application, import the database schema:
    ```bash
    ./import-surrealdb-schema.sh
    ```

## Software Development Requirements
1. Docker & Docker Compose
2. SurrealDB
3. NodeJs v23.7.0
4. Pnpm 10.2.1

## Architecture Diagram

### C4 Diagram - Context
![C4 Diagram - Context](/docs/C4%20Diagram-Context.svg)

### C4 Diagram - Containers
![C4 Diagram - Containers](/docs/C4%20Diagram-Containers.svg)

## Graph Database

### Design
![Graph Database Design](/docs/Graph%20Database%20-%20Design.svg)

### View
![Graph Database View](/docs/Graph%20Database%20-%20View.png)

## Screenshots

### Apps UI - Procesing Prompt
![Apps UI - Procesing Prompt](/docs/Apps%20UI%20-%20Procesing%20Prompt.png)

### Cache - Conversation History as Single Context
![Cache - Conversation History as Single Context](/docs/Cache%20-%20Conversation%20History%20as%20Single%20Context.png)
