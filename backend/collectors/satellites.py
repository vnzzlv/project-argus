"""
PROJECT ARGUS — Coletor de Satélites
Fonte: Celestrak (TLE) + Skyfield (cálculo orbital local)
Dados: posições de satélites em tempo real, calculadas na máquina local.
"""

import httpx
from datetime import datetime, timezone
from skyfield.api import load, EarthSatellite, wgs84

CELESTRAK_URL = "https://celestrak.org/NORAD/elements/gp.php"

GRUPOS = {
    "estacoes": "stations",       # ISS e estações espaciais
    "starlink": "starlink",       # Constelação Starlink
    "gps": "gps-ops",             # GPS operacional
    "geo": "geo",                 # Satélites geoestacionários
    "cientificos": "science",     # Satélites científicos
}

# Cache da timescale (download único, reutilizado)
_ts = None


def _get_timescale():
    """Carrega a timescale do Skyfield (baixa dados na primeira vez)."""
    global _ts
    if _ts is None:
        _ts = load.timescale()
    return _ts


async def _fetch_tle(group: str) -> list:
    """Baixa dados TLE do Celestrak para um grupo específico."""
    params = {"GROUP": group, "FORMAT": "TLE"}
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(CELESTRAK_URL, params=params)
        r.raise_for_status()
        return r.text.strip().splitlines()


def _parse_tle(lines: list) -> list:
    """Converte linhas TLE (3 por satélite) em objetos EarthSatellite."""
    sats = []
    for i in range(0, len(lines) - 2, 3):
        name = lines[i].strip()
        l1 = lines[i + 1].strip()
        l2 = lines[i + 2].strip()
        if l1.startswith("1 ") and l2.startswith("2 "):
            try:
                sats.append(EarthSatellite(l1, l2, name))
            except Exception:
                continue
    return sats


async def fetch_satellites(grupo: str = "estacoes", limit: int = 50) -> dict:
    """
    Busca satélites de um grupo e calcula posições atuais.

    Args:
        grupo: estacoes | starlink | gps | geo | cientificos
        limit: número máximo de satélites a retornar
    """
    if grupo not in GRUPOS:
        raise ValueError(f"Grupo inválido. Use: {list(GRUPOS.keys())}")

    celestrak_group = GRUPOS[grupo]
    lines = await _fetch_tle(celestrak_group)
    sats = _parse_tle(lines)

    ts = _get_timescale()
    t = ts.now()

    resultado = []
    for sat in sats[:limit]:
        try:
            geocentric = sat.at(t)
            subpoint = wgs84.subpoint(geocentric)
            resultado.append({
                "nome": sat.name,
                "norad_id": sat.model.satnum,
                "latitude": round(subpoint.latitude.degrees, 4),
                "longitude": round(subpoint.longitude.degrees, 4),
                "altitude_km": round(subpoint.elevation.km, 2),
            })
        except Exception:
            continue

    return {
        "fonte": "Celestrak + Skyfield",
        "grupo": grupo,
        "total_disponivel": len(sats),
        "total_retornado": len(resultado),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "satelites": resultado,
    }