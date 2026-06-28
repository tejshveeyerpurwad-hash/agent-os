from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router
from app.utils.logger import logger

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI Business Operating System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.on_event("startup")
async def startup():
    logger.info("AgentOS backend starting", version=settings.app_version)


@app.on_event("shutdown")
async def shutdown():
    logger.info("AgentOS backend shutting down")
