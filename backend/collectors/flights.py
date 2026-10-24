"""
PROJECT ARGUS — Coletor de Voos (Autenticação OAuth2)
Fonte: OpenSky Network (https://opensky-network.org)
"""

import httpx
from datetime import datetime, timezone
from typing import Optional

OPENSKY_URL = "https://opensky-network.org/api/states/all"
TOKEN_URL = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
TIMEOUT = 30.0

# ============ SUAS CREDENCIAIS OPENSKY ============
CLIENT_ID = "acxell-api-client"
CLIENT_SECRET = "BsDPtwzjB6chqgHIwhZB77PFbXlqB4LU"

# Cache do token para não pedir um novo a cada requisição
_token_cache = {"access_token": None, "expires_at": 0}


async def get_access_token() -> Optional[str]:
    """Obtém um token de acesso usando OAuth2 Client Credentials."""
    agora = datetime.now(timezone.utc).timestamp()
    
    # Se o token ainda for válido, retorna ele (evita requisições desnecessárias)
    if _token_cache["access_token"] and agora < _token_cache["expires_at"]:
        return _token_cache["access_token"]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                TOKEN_URL,
                data={
                    "grant_type": "client_credentials",
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Guarda o token e calcula quando ele expira (com margem de 60s)
            _token_cache["access_token"] = data["access_token"]
            _token_cache["expires_at"] = agora + data.get("expires_in", 1800) - 60 
            return data["access_token"]
    except Exception as e:
        print(f"Erro ao obter token OAuth2: {e}")
        return None


async def fetch_flights(limit: int = 100, bbox: Optional[dict] = None) -> dict:
    """
    Busca voos em tempo real da OpenSky Network.
    """
    params = {}
    if bbox:
        params.update(bbox)

    token = await get_access_token()
    
    # Se conseguiu o token, coloca no cabeçalho (Header)
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        response = await client.get(OPENSKY_URL, params=params, headers=headers)
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
        "fonte": "OpenSky Network (OAuth2)",
        "total_disponivel": len(states),
        "total_retornado": len(flights),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "voos": flights,
    }