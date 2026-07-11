from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import ask, debug, health, search, upload
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Chat PDF API",
    description="RAG sobre PDFs usando ChromaDB y Groq.",
    version="0.1.0",
    docs_url="/docs",       # default, podés cambiarlo
    redoc_url="/redoc",     # segunda UI alternativa
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(upload.router)
app.include_router(search.router)
app.include_router(ask.router)
app.include_router(debug.router)
