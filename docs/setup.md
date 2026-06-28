# AgentOS Setup Guide

## Prerequisites

- Node.js 22+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
uvicorn app.main:app --reload
```

## Docker Setup

```bash
docker-compose up --build
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql+asyncpg://postgres:postgres@localhost:5432/agentos |
| REDIS_URL | Redis connection string | redis://localhost:6379/0 |
| SECRET_KEY | JWT signing secret | change-me-in-production |
| LEMMA_API_KEY | Lemma SDK API key | (optional) |
| ALLOWED_ORIGINS | CORS allowed origins | ["http://localhost:5173"] |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API base URL | /api |
