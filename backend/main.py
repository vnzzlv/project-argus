"""
PROJECT ARGUS
A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
Backend FastAPI — Ponto de entrada principal.
"""

import httpx
from fastapi import FastAPI, Query, HTTPException
from datetime import datetime, timezone
from collectors.flights import fetch_flights

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


@app.get("/flights")
async def flights(
    limit: int = Query(100, ge=1, le=500, description="Número máximo de voos"),
    brazil: bool = Query(False, description="Filtrar apenas voos sobre o Brasil"),
):
    """
    Retorna voos em tempo real da OpenSky Network.
    """
    bbox = None
    if brazil:
        bbox = {"lamin": -35.0, "lomin": -75.0, "lamax": 6.0, "lomax": -34.0}

    try:
        return await fetch_flights(limit=limit, bbox=bbox)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Erro OpenSky: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")