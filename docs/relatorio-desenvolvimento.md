# 📊 RELATÓRIO DE DESENVOLVIMENTO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Tagline:** Cem olhos. Uma verdade.
**Autor:** Acxell Viana Pinto
**Início do desenvolvimento:** 05/10/2026
**Repositório:** https://github.com/vnzzlv/project-argus
**Stack principal:** Python + FastAPI + React + CesiumJS (3D) + Mark-LVI (IA Desktop)

---

## 1. Visão Geral

(Manter o texto original...)

## 2. Metodologia de Trabalho

(Manter o texto original...)

## 3. Cronograma de Sessões

| Sessão | Data       | Objetivo                                          | Status       |
| ------ | ---------- | ------------------------------------------------- | ------------ |
| ...    | ...        | (Sessões anteriores)                              | ✅ Concluída |
| 11     | 24/10/2026 | Implementação do Groq (Cérebro) e Edge TTS (Voz)  | ✅ Concluída |
| 12     | 26/10/2026 | Integração do J.A.R.V.I.S. (Mark-LVI) via Plugins | ✅ Concluída |
| 13     | 26/10/2026 | Estudos de Exposição Online (Ngrok / Cloudflare)  | ✅ Concluída |

---

## 4. Registro Detalhado de Erros e Soluções

| #   | Sessão | Erro                        | Causa                                     | Solução Aplicada                                                  |
| --- | ------ | --------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| ... | ...    | (Erros anteriores)          | ...                                       | ...                                                               |
| 13  | 11     | Erro 404 no Gemini (Models) | Google desativou os modelos antigos       | Migração para a API do Groq (Llama 3.3)                           |
| 14  | 11     | Voz robótica                | `SpeechSynthesis` nativo do navegador     | Uso do Edge TTS (`pt-BR-AntonioNeural`) no Backend                |
| 15  | 12     | JARVIS não abria o ARGUS    | O Mark-LVI buscava um `.exe`, não um site | Criação de um plugin Python (`abrir_argus.py`) e um atalho `.bat` |
| 16  | 13     | Ngrok bloqueou 2º túnel     | Limite da versão gratuita (1 túnel)       | Estudo de alternativas como Cloudflare Tunnel                     |

---

## 5. Stack Tecnológico Consolidado

### Backend (ARGUS)

- **Python 3.12 / 3.14**
- **FastAPI** e **Uvicorn**
- **Groq API (Llama 3.3)** — Inteligência Artificial ultrarrápida e gratuita
- **Edge TTS** — Síntese de voz neural da Microsoft (Gratuita)
- **Skyfield / adsbdb / OpenSky** — Dados de satélites, voos e rotas

### Frontend (ARGUS)

- **React 19** + **Vite**
- **CesiumJS** (Globo 3D)
- **ESRI ArcGIS** (Mapas de satélite)

### Assistente Desktop (J.A.R.V.I.S.)

- **Mark-LVI** (Open Source)
- **Gemini API** (Google AI Studio)
- **Python Plugins** — Para interagir com o sistema e abrir o ARGUS

### Infraestrutura

- Git + GitHub
- **Ngrok / Cloudflare Tunnel** — Para exposição online segura (HTTPS) e acesso via celular.

---

## 6. Aprendizados Relevantes para o TCC

### 6.1 Arquitetura de Microsserviços e Integração

O projeto provou que é possível integrar um assistente de IA de Desktop (JARVIS) com uma aplicação Web distribuída (ARGUS). O JARVIS atua como um "acionador de comandos", abrindo o dashboard via web, o que demonstra uma arquitetura moderna de sistemas.

### 6.2 Resiliência de APIs e Custos

A descontinuação de modelos de IA (Gemini) e os limites de APIs gratuitas (Ngrok) ensinaram a importância de ter planos B. A migração para o Groq e o estudo de túneis alternativos (Cloudflare) garantem que o TCC não fique refém de uma única tecnologia.

### 6.3 Experiência do Usuário (UX)

A transição de um simples "chat" para uma voz neural (Edge TTS) e um holograma 3D (Mark-LVI) eleva drasticamente a imersão. O ARGUS deixou de ser um site e passou a ser uma experiência de "Olho de Deus".

---

## 7. Próximas Etapas (Para a Escola)

- Finalizar a configuração do Cloudflare Tunnel para expor o ARGUS online.
- Integrar o link online ao plugin do JARVIS.
- Testar o acesso via celular na rede da escola.
- Preparar o roteiro da apresentação final.
