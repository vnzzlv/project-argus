"""
PROJECT ARGUS
Backend Principal (Groq + Edge TTS)
"""

import httpx
import json
import os
import edge_tts
from groq import Groq
from pydantic import BaseModel
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from collectors.flights import fetch_flights
from collectors.satellites import fetch_satellites
from collectors.earthquakes import fetch_earthquakes
from collectors.flight_enricher import enrich_flights

app = FastAPI(title="PROJECT ARGUS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# ============ CONFIGURAÇÃO DO CÉREBRO (GROQ) ============
GROQ_API_KEY = "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" 
client = Groq(api_key=GROQ_API_KEY)

VISION_PERSONA = """
Você é o VISION, sistema de IA do ARGUS. Seu criador é Acxell Viana. Trate-o por "senhor".
Seja elegante e conciso, estilo Jarvis.
Você DEVE retornar sua resposta EXATAMENTE como um objeto JSON válido.
O JSON deve ter duas chaves: "resposta" (o que falar em português) e "acao" (comando para o mapa).
Ações válidas para "acao": "FILTRAR_GOL", "FILTRAR_LATAM", "FILTRAR_AZU", "MOSTRAR_AVIOES", "MOSTRAR_TERREMOTOS", "MOSTRAR_SATELITES", "NENHUMA".
Exemplo: {"resposta": "Aqui estão os voos da GOL, senhor.", "acao": "FILTRAR_GOL"}
"""

class VisionRequest(BaseModel):
    pergunta: str
    contexto: str = ""

class SpeakRequest(BaseModel):
    texto: str

@app.get("/")
def root(): return {"projeto": "PROJECT ARGUS", "status": "online"}

@app.get("/flights")
async def flights(limit: int = Query(100), brazil: bool = Query(False)):
    bbox = {"lamin": -35.0, "lomin": -75.0, "lamax": 6.0, "lomax": -34.0} if brazil else None
    try:
        dados = await fetch_flights(limit=limit, bbox=bbox)
        try: dados["voos"] = await enrich_flights(dados.get("voos", []), max_enriquecer=80)
        except: pass
        return dados
    except Exception as e:
        return {"voos": [{"icao24": "a1b2c3", "callsign": "GLO1295", "latitude": -23.5505, "longitude": -46.6333, "altitude_m": 11000, "velocidade_ms": 250, "heading": 45, "companhia_aerea": {"nome": "GOL", "icao": "GLO"}}]}

@app.get("/satellites")
async def satellites(grupo: str = Query("estacoes"), limit: int = Query(50)):
    return await fetch_satellites(grupo=grupo, limit=limit)

@app.get("/earthquakes")
async def earthquakes(periodo: str = Query("dia"), magnitude: str = Query("m25"), limit: int = Query(50)):
    return await fetch_earthquakes(periodo=periodo, magnitude=magnitude, limit=limit)

# ============ O CÉREBRO DO VISION ============
@app.post("/vision/ask")
async def vision_ask(req: VisionRequest):
    try:
        prompt = f"Contexto: {req.contexto}\n\nPergunta: {req.pergunta}"
        
        # MODELO ATUALIZADO: llama-3.3-70b-versatile
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": VISION_PERSONA},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            response_format={"type": "json_object"} 
        )
        
        texto_resposta = chat_completion.choices[0].message.content
        return json.loads(texto_resposta)

    except Exception as e:
        print(f"ERRO NO GROQ: {e}")
        return {"resposta": "Meus sistemas neurais estão sobrecarregados, senhor.", "acao": "NENHUMA"}

# ============ A VOZ DO VISION (EDGE TTS) ============
@app.post("/vision/speak")
async def vision_speak(req: SpeakRequest):
    try:
        voice = "pt-BR-AntonioNeural"
        output_file = "vision_voice.mp3"
        
        communicate = edge_tts.Communicate(req.texto, voice)
        await communicate.save(output_file)
        
        return FileResponse(output_file, media_type="audio/mpeg")
    except Exception as e:
        print(f"ERRO NO TTS: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar voz")