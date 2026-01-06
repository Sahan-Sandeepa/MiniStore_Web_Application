# MiniStore Server

This is the backend server for **MiniStore**, built with ASP.NET Core 8, using **PostgreSQL**, **Redis**, and **Elasticsearch**. The server is fully containerized using **Docker Compose** for easy setup and development.

---

## 📂 Project Structure

        server/
        ├── MiniStore.API/              # ASP.NET Core API project
        ├── MiniStore.Core/             # Core domain & business logic
        ├── MiniStore.Infrastructure/   # Data access, repositories, EF Core
        ├── Dockerfile                  # Multi-stage Dockerfile for API
        ├── docker-compose.yml          # Docker Compose (development)
        ├── .env                        # Environment variables
        └── README.md

---

## 🛠 Prerequisites

    - [Docker](https://www.docker.com/get-started)
    - [Docker Compose](https://docs.docker.com/compose/install/)
    - Optional: [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (for local dev)
    - Ensure ports **5298 – API**, **5432 – PostgreSQL**, **6379 – Redis**, and **9200 – Elasticsearch** are free

---

## ⚙️ Environment Variables

    Create a `.env` file in `/server`:

        POSTGRES_USER={POSTGRES_USER}
        POSTGRES_PASSWORD={POSTGRES_PASSWORD}
        POSTGRES_DB={POSTGRES_DB}
        POSTGRES_PORT={POSTGRES_PORT}
        REDIS_PORT={REDIS_PORT}
        ELASTIC_PORT={ELASTIC_PORT}

---

## 🚀 Running the Server

    1. Open terminal in `/server`.
    2. Build and start all containers:

    docker compose up --build

    This will start:

    ASP.NET Core API (with dotnet watch / live reload)
    PostgreSQL
    Redis
    Elasticsearch

    3. For Dev Mode with Live Reload: docker compose -p ministore-dev -f docker-compose.dev.yml up
    4. For Production Mode: docker compose -p ministore-prod -f docker-compose.prod.yml up -d

### 🔥 Live Reload (Hot Reload)

    Live reload is enabled by default using `dotnet watch`

    To disable live reload, set the environment variable in `docker-compose.yml`:
    DOTNET_USE_POLLING_FILE_WATCHER=1

    Verify containers are running:
    docker ps
    API: http://localhost:{PORT_NO}

    Postgres: port {PORT_NO}
    Redis: port {PORT_NO}
    Elasticsearch: port {PORT_NO}

    🧹 Stopping and Clearing
    Stop containers (without removing data)
    docker compose down

    Stop containers and remove volumes (resets DB & Elasticsearch)
    docker compose down -v
    ⚠️ Warning: This deletes all stored data.

    Remove dangling Docker images & cache
    docker system prune -af --volumes
    docker volume prune

    Frees up space if builds and old images accumulate.

🔧 Dockerfile Overview
The Dockerfile uses a multi-stage build:
Build stage: Restores dependencies, builds, and publishes.
Final stage: Only includes published output, reducing image size.

Key commands:

# Publish API

    RUN dotnet publish MiniStore.API/MiniStore.API.csproj -c Release -o /app/publish --no-restore
    Optional: Add /p:PublishTrimmed=true to reduce image size further.

    📦 Volumes
        Postgres data: pgdata
        Elasticsearch data: esdata
        Defined in docker-compose.yml:

        volumes:
        pgdata:
        esdata:
        🧪 Testing API

        curl http://localhost:529{PORT_NO}8/api/values
        Replace /api/values with your API endpoints.

    ⚡ For Development
        Use .dockerignore to exclude unnecessary files:

        **/bin/
        **/obj/
        .git
        .vscode
        *.user
        *.suo

        To rebuild API only (without DB/Redis/ES):
        docker compose build api
        docker compose up api

        To view logs:
        docker compose logs -f api
