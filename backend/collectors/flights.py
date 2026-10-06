"""
PROJECT ARGUS — Coletor de Voos
Fonte: OpenSky Network (https://opensky-network.org)
Dados: posições de aeronaves em tempo real (global, público).
"""

import httpx
from datetime import datetime, timezone
from typing import Optional

OPENSKY_URL = "https://opensky-network.org/api/states/all"
TIMEOUT = 30.0


async def fetch_flights(limit: int = 100, bbox: Optional[dict] = None) -> dict:
    """
    Busca voos em tempo real da OpenSky Network.

    Args:
        limit: número máximo de aeronaves a retornar (padrão: 100)
        bbox: filtro opcional por área geográfica
              Ex: {"lamin": -35, "lomin": -75, "lamax": 6, "lomax": -34}  # Brasil

    Returns:
        dict com contagem, timestamp e lista de voos normalizados.
    """
    params = {}
    if bbox:
        params.update(bbox)

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        response = await client.get(OPENSKY_URL, params=params)
        response.raise_for_status()
        data = response.json()

    states = data.get("states") or []
    flights = []

    for s in states[:limit]:
        flights.append({
            "icao24": s[0],
            "callsign": (s[1] or "").strip(),
            "pais_origem": s[2],
            "longitude": s[5],
            "latitude": s[6],
            "altitude_m": s[13],
            "velocidade_ms": s[9],
            "heading": s[10],
            "no_chao": s[8],
            "ultima_atualizacao": s[4],
        })

    return {
        "fonte": "OpenSky Network",
        "total_disponivel": len(states),
        "total_retornado": len(flights),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "voos": flights,
    }