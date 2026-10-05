"""
PROJECT ARGUS
A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
Backend FastAPI — Ponto de entrada principal.
"""

from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="PROJECT ARGUS API",
    description="Sistema Unificado Global de Reconhecimento Agregado",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.get("/")
def root():
    """Endpoint raiz — confirma que o ARGUS está online."""
    return {
        "projeto": "PROJECT ARGUS",
        "sigla": "A.R.G.U.S.",
        "significado": "Aggregated Reconnaissance and Global Unified System",
        "tagline": "Cem olhos. Uma verdade.",
        "versao": "0.1.0",
        "status": "online",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health")
def health():
    """Endpoint de saúde — usado para monitorar se a API está de pé."""
    return {"status": "healthy"}