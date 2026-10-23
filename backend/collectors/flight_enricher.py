"""
PROJECT ARGUS — Enriquecedor de Voos
Fonte: adsbdb API (https://api.adsbdb.com) — gratuita, sem chave
Adiciona: companhia aérea, aeroporto de origem e destino.
"""

import asyncio
import httpx
from typing import Optional

ADSBDB_URL = "https://api.adsbdb.com/v0/callsign"

# Limita requisições simultâneas (evita sobrecarregar a API)
SEMAPHORE = asyncio.Semaphore(10)

# Cache em memória (evita consultar o mesmo callsign várias vezes)
_CACHE: dict = {}


async def _buscar_rota(callsign: str) -> Optional[dict]:
    """Consulta a adsbdb para um único callsign."""
    if not callsign:
        return None

    callsign = callsign.strip().upper()
    if callsign in _CACHE:
        return _CACHE[callsign]

    async with SEMAPHORE:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                r = await client.get(f"{ADSBDB_URL}/{callsign}")
                if r.status_code == 200:
                    rota = r.json().get("response", {}).get("flightroute")
                    _CACHE[callsign] = rota
                    return rota
        except Exception:
            pass

    _CACHE[callsign] = None
    return None


def _formatar(rota: Optional[dict]) -> dict:
    """Normaliza a resposta da adsbdb para o padrão ARGUS."""
    if not rota:
        return {"companhia_aerea": None, "origem": None, "destino": None}

    airline = rota.get("airline") or {}
    origin = rota.get("origin") or {}
    destination = rota.get("destination") or {}

    return {
        "companhia_aerea": {
            "nome": airline.get("name"),
            "iata": airline.get("iata"),
            "icao": airline.get("icao"),
            "pais": airline.get("country"),
        } if airline else None,
        "origem": {
            "iata": origin.get("iata_code"),
            "icao": origin.get("icao_code"),
            "cidade": origin.get("municipality"),
            "pais": origin.get("country_name"),
            "nome": origin.get("name"),
        } if origin else None,
        "destino": {
            "iata": destination.get("iata_code"),
            "icao": destination.get("icao_code"),
            "cidade": destination.get("municipality"),
            "pais": destination.get("country_name"),
            "nome": destination.get("name"),
        } if destination else None,
    }


async def enrich_flights(voos: list, max_enriquecer: int = 80) -> list:
    """
    Adiciona informações de rota aos primeiros N voos.

    Args:
        voos: lista de voos do OpenSky
        max_enriquecer: número máximo de voos a enriquecer (evita lentidão)
    """
    # Enriquecer apenas os primeiros N (com callsign válido)
    elegiveis = [v for v in voos if v.get("callsign")][:max_enriquecer]

    tarefas = [_buscar_rota(v["callsign"]) for v in elegiveis]
    resultados = await asyncio.gather(*tarefas)

    for voo, rota in zip(elegiveis, resultados):
        info = _formatar(rota)
        voo["companhia_aerea"] = info["companhia_aerea"]
        voo["origem"] = info["origem"]
        voo["destino"] = info["destino"]

    # Voos não enriquecidos recebem valores nulos
    for voo in voos:
        voo.setdefault("companhia_aerea", None)
        voo.setdefault("origem", None)
        voo.setdefault("destino", None)

    return voos