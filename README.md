# AgentOS — AI Business Operating System

Multi-agent AI system for automating business workflows. Multiple AI agents collaborate to execute real business processes.

## Tech Stack

### Frontend
- **React 19** + **Vite 8** + **TypeScript 6**
- **Tailwind CSS 4** — CSS-first utility framework
- **Framer Motion** — animations and transitions
- **React Router 7** — client-side routing
- **Zustand** — lightweight state management
- **React Hook Form** + **Zod** — form validation
- **Recharts** — data visualization
- **Lucide React** — icon library
- **Axios** — HTTP client with interceptors

### Backend
- **FastAPI** — async Python web framework
- **SQLAlchemy 2.0** — async ORM with PostgreSQL
- **Pydantic** + **Pydantic Settings** — validation and config
- **python-jose** — JWT authentication
- **passlib** — password hashing
- **Alembic** — database migrations
- **structlog** — structured logging

### Infrastructure
- **PostgreSQL** — primary database
- **Redis** — caching and task queues
- **Docker** + **Docker Compose** — containerization

## Quick Start

### Prerequisites
- Node.js 22+
- Python 3.11+
- PostgreSQL 16+ (or Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker (full stack)
```bash
docker-compose up --build
```

## Project Structure

```
agent-os/
├── frontend/               # React + Vite + TypeScript
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── ui/         # Design system (Button, Card, Input, etc.)
│       │   ├── layout/     # Sidebar, TopNav, MainLayout, AuthGuard
│       │   ├── dashboard/  # Dashboard-specific components
│       │   ├── agents/     # Agent card, status indicators
│       │   ├── workflows/  # Workflow card, status indicators
│       │   └── analytics/  # Charts, metric cards
│       ├── pages/          # Route-level page components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # Axios API layer
│       ├── store/          # Zustand stores
│       ├── types/          # TypeScript type definitions
│       └── utils/          # cn(), constants
├── backend/                # FastAPI + Python
│   └── app/
│       ├── api/            # HTTP routes and auth dependencies
│       ├── agents/         # Agent abstraction and manager
│       ├── workflows/      # Workflow engine and definitions
│       ├── services/       # Business logic (Lemma, auth)
│       ├── models/         # SQLAlchemy ORM models
│       ├── database/       # Async session and Base
│       ├── schemas/        # Pydantic validation schemas
│       ├── utils/          # Structured logging
│       └── config/         # Settings via pydantic-settings
├── shared/                 # Cross-platform types
├── docs/                   # Architecture and setup docs
├── docker-compose.yml      # Full stack orchestration
└── .github/                # CI/CD workflows
```

## Architecture

- **Agent System**: Abstract base agent class with pluggable implementations (Lemma SDK, custom)
- **Workflow Engine**: Sequential and parallel execution of multi-step processes
- **Async Database**: SQLAlchemy async sessions with connection pooling
- **JWT Auth**: Token-based authentication with bcrypt password hashing
- **API Layer**: Centralized Axios instance with request/response interceptors
- **State Management**: Zustand stores for auth, app state, and theme
- **Error Boundaries**: React error boundaries with retry capability
