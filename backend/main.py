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

# ============ CACHE DE VOOS ============
_flights_cache = {"data": None, "timestamp": None}

# ============ DADOS DE FALLBACK (PLANO B PARA O TCC) ============
# Se a OpenSky bloquear o IP, o sistema exibe estes aviões para a banca.
_FALLBACK_FLIGHTS = [
    {"icao24": "e8027c", "callsign": "LPE2237", "pais_origem": "Peru", "longitude": -78.325, "latitude": -9.5512, "altitude_m": 12054.84, "velocidade_ms": 236.07, "heading": 154.16, "no_chao": False, "companhia_aerea": {"nome": "LAN Peru", "iata": "LP", "icao": "LPE"}, "origem": {"iata": "PIU", "cidade": "Piura"}, "destino": {"iata": "LIM", "cidade": "Lima"}},
    {"icao24": "e8027b", "callsign": "LAN533", "pais_origem": "Chile", "longitude": -79.9291, "latitude": 26.7323, "altitude_m": 12001.5, "velocidade_ms": 256.62, "heading": 173.9, "no_chao": False, "companhia_aerea": {"nome": "LAN Airlines", "iata": "LA", "icao": "LAN"}, "origem": {"iata": "JFK", "cidade": "Nova York"}, "destino": {"iata": "SCL", "cidade": "Santiago"}},
    {"icao24": "ab1644", "callsign": "UAL1508", "pais_origem": "EUA", "longitude": -118.3591, "latitude": 34.2116, "altitude_m": 10000, "velocidade_ms": 240.0, "heading": 309.38, "no_chao": False, "companhia_aerea": {"nome": "United Airlines", "iata": "UA", "icao": "UAL"}, "origem": {"iata": "IAD", "cidade": "Washington"}, "destino": {"iata": "EWR", "cidade": "Newark"}},
    {"icao24": "a1b2c3", "callsign": "GLO1295", "pais_origem": "Brasil", "longitude": -46.6333, "latitude": -23.5505, "altitude_m": 11000, "velocidade_ms": 250.0, "heading": 45.0, "no_chao": False, "companhia_aerea": {"nome": "GOL Linhas Aéreas", "iata": "G3", "icao": "GLO"}, "origem": {"iata": "CGH", "cidade": "São Paulo"}, "destino": {"iata": "BSB", "cidade": "Brasília"}},
    {"icao24": "d4e5f6", "callsign": "AFR443", "pais_origem": "França", "longitude": 2.3522, "latitude": 48.8566, "altitude_m": 10500, "velocidade_ms": 220.0, "heading": 180.0, "no_chao": False, "companhia_aerea": {"nome": "Air France", "iata": "AF", "icao": "AFR"}, "origem": {"iata": "CDG", "cidade": "Paris"}, "destino": {"iata": "GIG", "cidade": "Rio de Janeiro"}},
    {"icao24": "g7h8i9", "callsign": "UAE202", "pais_origem": "Emirados Árabes", "longitude": 55.2708, "latitude": 25.2048, "altitude_m": 11500, "velocidade_ms": 260.0, "heading": 270.0, "no_chao": False, "companhia_aerea": {"nome": "Emirates", "iata": "EK", "icao": "UAE"}, "origem": {"iata": "DXB", "cidade": "Dubai"}, "destino": {"iata": "JFK", "cidade": "Nova York"}}
]


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
    """Retorna voos em tempo real (com cache e fallback para o TCC)."""
    global _flights_cache
    agora = datetime.now(timezone.utc)

    # 1. Se tem cache recente (menos de 60s), devolve o cache
    if _flights_cache["data"] and _flights_cache["timestamp"]:
        if (agora - _flights_cache["timestamp"]).total_seconds() < 60:
            return _flights_cache["data"]

    bbox = None
    if brazil:
        bbox = {"lamin": -35.0, "lomin": -75.0, "lamax": 6.0, "lomax": -34.0}

    try:
        # 2. Tenta buscar na OpenSky
        dados = await fetch_flights(limit=limit, bbox=bbox)
        
        try:
            dados["voos"] = await enrich_flights(dados.get("voos", []), max_enriquecer=80)
        except Exception as e:
            print(f"Aviso: Erro ao enriquecer voos: {e}")

        # Salva no cache de sucesso
        _flights_cache["data"] = dados
        _flights_cache["timestamp"] = agora
        return dados

    except Exception as e:
        print(f"ERRO: Falha na OpenSky ({e}). Usando dados de fallback do TCC.")
        
        # 3. PLANO B: Se a OpenSky falhar, entrega os aviões de segurança
        dados_fallback = {
            "fonte": "Fallback Local (Proteção TCC)",
            "total_disponivel": len(_FALLBACK_FLIGHTS),
            "total_retornado": len(_FALLBACK_FLIGHTS),
            "timestamp": agora.isoformat(),
            "voos": _FALLBACK_FLIGHTS[:limit]
        }
        
        # Salva o fallback no cache para não tentar na OpenSky toda hora
        _flights_cache["data"] = dados_fallback
        _flights_cache["timestamp"] = agora
        return dados_fallback


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