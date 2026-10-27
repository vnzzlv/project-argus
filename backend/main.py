"""
PROJECT ARGUS
A.R.G.U.S. — Backend Principal (Blindado)
"""

import httpx
from google import genai
from pydantic import BaseModel
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from collectors.flights import fetch_flights
from collectors.satellites import fetch_satellites
from collectors.earthquakes import fetch_earthquakes
from collectors.flight_enricher import enrich_flights
import json

_flights_cache = {"data": None, "timestamp": None}

app = FastAPI(title="PROJECT ARGUS API", version="0.1.0", docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# Sua chave do Gemini
GEMINI_API_KEY = "AQ.Ab8RN6JSUYkEz2FWwgQHrMu6l2rzhUki0qCyDa_PEJzB_4dqOQ" 
client = genai.Client(api_key=GEMINI_API_KEY)

VISION_PERSONA = """
Você é o VISION, sistema de IA do ARGUS. Seu criador é Acxell Viana. Trate-o por "senhor".
Seja elegante e conciso, estilo Jarvis.
Você DEVE retornar sua resposta EXATAMENTE como um objeto JSON válido, sem marcações de código.
O JSON deve ter duas chaves: "resposta" (o que falar) e "acao" (comando para o mapa).
Ações válidas: "FILTRAR_GOL", "FILTRAR_LATAM", "FILTRAR_AZU", "MOSTRAR_AVIOES", "MOSTRAR_TERREMOTOS", "MOSTRAR_SATELITES", "NENHUMA".
Exemplo: {"resposta": "Aqui estão os voos da GOL, senhor.", "acao": "FILTRAR_GOL"}
"""

class VisionRequest(BaseModel):
    pergunta: str
    contexto: str = ""

@app.get("/")
def root(): return {"projeto": "PROJECT ARGUS", "status": "online"}

@app.get("/flights")
async def flights(limit: int = Query(100), brazil: bool = Query(False)):
    global _flights_cache
    agora = datetime.now(timezone.utc)
    if _flights_cache["data"] and _flights_cache["timestamp"]:
        if (agora - _flights_cache["timestamp"]).total_seconds() < 60:
            return _flights_cache["data"]

    bbox = {"lamin": -35.0, "lomin": -75.0, "lamax": 6.0, "lomax": -34.0} if brazil else None

    try:
        dados = await fetch_flights(limit=limit, bbox=bbox)
        try: dados["voos"] = await enrich_flights(dados.get("voos", []), max_enriquecer=80)
        except: pass
        _flights_cache["data"] = dados
        _flights_cache["timestamp"] = agora
        return dados
    except Exception as e:
        return {"voos": [{"icao24": "a1b2c3", "callsign": "GLO1295", "pais_origem": "Brasil", "longitude": -46.6333, "latitude": -23.5505, "altitude_m": 11000, "velocidade_ms": 250.0, "heading": 45.0, "companhia_aerea": {"nome": "GOL", "iata": "G3", "icao": "GLO"}}]}

@app.get("/satellites")
async def satellites(grupo: str = Query("estacoes"), limit: int = Query(50)):
    return await fetch_satellites(grupo=grupo, limit=limit)

@app.get("/earthquakes")
async def earthquakes(periodo: str = Query("dia"), magnitude: str = Query("m25"), limit: int = Query(50)):
    return await fetch_earthquakes(periodo=periodo, magnitude=magnitude, limit=limit)

@app.post("/vision/ask")
async def vision_ask(req: VisionRequest):
    try:
        prompt = f"Contexto atual: {req.contexto}\n\nPergunta: {req.pergunta}"
        
        # BLINDAGEM: Tenta o modelo 3.8. Se falhar, tenta o 1.5.
        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=VISION_PERSONA + "\n\n" + prompt,
            )
        except Exception as e:
            print(f"Aviso: gemini-3.8-flash falhou. Tentando 1.5...")
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=VISION_PERSONA + "\n\n" + prompt,
            )
        
        texto_limpo = response.text.strip().replace("```json", "").replace("```", "").strip()
        
        try:
            return json.loads(texto_limpo)
        except json.JSONDecodeError:
            return {"resposta": response.text, "acao": "NENHUMA"}

    except Exception as e:
        print(f"ERRO CRÍTICO NO GEMINI: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na IA: {str(e)}")