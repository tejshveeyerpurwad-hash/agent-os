# AgentOS Architecture

## Overview

AgentOS is an AI Business Operating System where multiple AI agents collaborate to execute real business workflows. The system follows a modular, event-driven architecture with clear separation of concerns.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                    Frontend                       │
│              React + Vite + TypeScript            │
│                   Tailwind CSS                    │
│            Framer Motion + React Router           │
│                   Zustand (State)                 │
└────────────────────┬──────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌──────────────────────────────────────────────────┐
│                   Backend API                      │
│                  FastAPI (Python)                  │
│              Lemma SDK Integration                 │
│               JWT Authentication                   │
└────────────────────┬──────────────────────────────┘
                     │
          ┌──────────┼─────────────┐
          ▼          ▼              ▼
┌──────────────┐ ┌────────┐ ┌──────────────┐
│  PostgreSQL   │ │  Redis │ │  File Store  │
│  (Primary DB) │ │ (Cache)│ │  (Documents) │
└──────────────┘ └────────┘ └──────────────┘
```

## Directory Structure

### Frontend

```
frontend/src/
├── components/   # Reusable UI components
│   ├── ui/       # Design system primitives
│   ├── layout/   # Layout components
│   ├── dashboard/
│   ├── agents/
│   ├── workflows/
│   └── analytics/
├── pages/        # Route-level page components
├── hooks/        # Custom React hooks
├── services/     # API integration layer
├── store/        # Zustand state management
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

### Backend

```
backend/app/
├── api/          # HTTP route handlers
├── agents/       # Agent abstraction and management
├── workflows/    # Workflow engine and definitions
├── services/     # Business logic services
├── models/       # SQLAlchemy ORM models
├── database/     # Database connection and session
├── schemas/      # Pydantic validation schemas
├── utils/        # Shared utilities
└── config/       # Application configuration
```

## Key Design Decisions

1. **Modular Agent System**: Agents are abstracted through a base class, allowing multiple implementations
2. **Async-First**: Both frontend and backend use async patterns for scalability
3. **Type Safety**: TypeScript for frontend, Pydantic for backend
4. **State Management**: Zustand for lightweight, scalable state
5. **API Layer**: Centralized Axios instance with interceptors
6. **Authentication**: JWT-based with secure token handling
