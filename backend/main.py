"""
PROJECT ARGUS
A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
Backend FastAPI — Ponto de entrada principal.
"""

import httpx
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from collectors.flights import fetch_flights
from collectors.satellites import fetch_satellites, GRUPOS
from collectors.earthquakes import fetch_earthquakes, PERIODOS, MAGNITUDES
from collectors.flight_enricher import enrich_flights

# ============ CACHE DE VOOS (Evita bloqueio da OpenSky) ============
_flights_cache = {"data": None, "timestamp": None}

app = FastAPI(
    title="PROJECT ARGUS API",
    description="Sistema Unificado Global de Reconhecimento Agregado",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — libera o frontend (Vite em localhost:5173 e 5174)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    """Retorna voos em tempo real (com cache de 60s para evitar bloqueio da OpenSky)."""
    global _flights_cache
    agora = datetime.now(timezone.utc)

    # 1. Se tem cache e ele é recente (menos de 60s), devolve o cache
    if _flights_cache["data"] and _flights_cache["timestamp"]:
        if (agora - _flights_cache["timestamp"]).total_seconds() < 60:
            return _flights_cache["data"]

    # 2. Se não tem cache, tenta buscar na OpenSky
    bbox = None
    if brazil:
        bbox = {"lamin": -35.0, "lomin": -75.0, "lamax": 6.0, "lomax": -34.0}

    try:
        dados = await fetch_flights(limit=limit, bbox=bbox)
        
        # Tenta enriquecer, mas se a adsbdb falhar, não quebra o sistema
        try:
            dados["voos"] = await enrich_flights(dados.get("voos", []), max_enriquecer=80)
        except Exception as e:
            print(f"Aviso: Erro ao enriquecer voos: {e}")

        # Salva no cache
        _flights_cache["data"] = dados
        _flights_cache["timestamp"] = agora
        return dados

    except httpx.HTTPStatusError as e:
        # 3. Se a OpenSky der erro, mas a gente tem um cache velho, devolve o cache velho
        if _flights_cache["data"]:
            print("Aviso: OpenSky bloqueou. Retornando cache antigo.")
            return _flights_cache["data"]
        raise HTTPException(status_code=502, detail=f"Erro OpenSky: {e}")
    except Exception as e:
        if _flights_cache["data"]:
            return _flights_cache["data"]
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")


@app.get("/satellites")
async def satellites(
    grupo: str = Query("estacoes", description=f"Grupos: {list(GRUPOS.keys())}"),
    limit: int = Query(50, ge=1, le=200, description="Número máximo de satélites"),
):
    """Retorna posições em tempo real de satélites (Celestrak + Skyfield)."""
    try:
        return await fetch_satellites(grupo=grupo, limit=limit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Erro Celestrak: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")


@app.get("/earthquakes")
async def earthquakes(
    periodo: str = Query("dia", description=f"Períodos: {list(PERIODOS.keys())}"),
    magnitude: str = Query("m25", description=f"Magnitudes: {list(MAGNITUDES.keys())}"),
    limit: int = Query(50, ge=1, le=500, description="Número máximo de terremotos"),
):
    """Retorna terremotos recentes da USGS."""
    try:
        return await fetch_earthquakes(periodo=periodo, magnitude=magnitude, limit=limit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Erro USGS: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {e}")