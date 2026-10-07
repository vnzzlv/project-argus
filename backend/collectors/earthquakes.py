"""
PROJECT ARGUS — Coletor de Terremotos
Fonte: USGS Earthquake Hazards Program (https://earthquake.usgs.gov)
Dados: terremotos globais em tempo real (feed oficial do governo americano).
"""

import httpx
from datetime import datetime, timezone

USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary"

# Períodos disponíveis no feed da USGS
PERIODOS = {
    "hora": "hour",
    "dia": "day",
    "semana": "week",
    "mes": "month",
}

# Magnitudes mínimas disponíveis
MAGNITUDES = {
    "significativos": "significant",
    "m45": "4.5",
    "m25": "2.5",
    "m10": "1.0",
    "todos": "all",
}


async def fetch_earthquakes(
    periodo: str = "dia",
    magnitude: str = "m25",
    limit: int = 50,
) -> dict:
    """
    Busca terremotos recentes da USGS.

    Args:
        periodo: hora | dia | semana | mes
        magnitude: significativos | m45 | m25 | m10 | todos
        limit: número máximo de terremotos a retornar
    """
    if periodo not in PERIODOS:
        raise ValueError(f"Período inválido. Use: {list(PERIODOS.keys())}")
    if magnitude not in MAGNITUDES:
        raise ValueError(f"Magnitude inválida. Use: {list(MAGNITUDES.keys())}")

    url = f"{USGS_URL}/{MAGNITUDES[magnitude]}_{PERIODOS[periodo]}.geojson"

    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()

    features = data.get("features", [])

    terremotos = []
    for f in features[:limit]:
        props = f.get("properties", {})
        coords = f.get("geometry", {}).get("coordinates", [None, None, None])

        terremotos.append({
            "id": f.get("id"),
            "magnitude": props.get("mag"),
            "local": props.get("place"),
            "longitude": coords[0],
            "latitude": coords[1],
            "profundidade_km": coords[2],
            "timestamp": props.get("time"),
            "url_detalhes": props.get("url"),
            "tsunami": props.get("tsunami", 0) == 1,
        })

    return {
        "fonte": "USGS Earthquake Hazards Program",
        "periodo": periodo,
        "magnitude_filtro": magnitude,
        "total_disponivel": len(features),
        "total_retornado": len(terremotos),
        "timestamp_consulta": datetime.now(timezone.utc).isoformat(),
        "terremotos": terremotos,
    }