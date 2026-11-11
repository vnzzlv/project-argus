# 📊 RELATÓRIO DE DESENVOLVIMENTO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Tagline:** Cem olhos. Uma verdade.
**Autor:** Acxell Viana Pinto
**Início do desenvolvimento:** 05/10/2026
**Repositório:** https://github.com/vnzzlv/project-argus
**Stack principal:** Python + FastAPI + React + CesiumJS (3D) + Three.js + Groq (IA)

---

## 1. Visão Geral

Este documento registra o processo de desenvolvimento do PROJECT ARGUS, incluindo decisões técnicas, erros encontrados e soluções aplicadas. Serve como base para o capítulo de Metodologia e Implementação do Trabalho de Conclusão de Curso.

O ARGUS é um sistema de Inteligência de Fontes Abertas (OSINT) para visualização global em tempo real, agregando dados públicos de aviação, satélites, terremotos e outras fontes em um dashboard 3D imersivo, controlado por uma Inteligência Artificial com voz neural.

---

## 2. Metodologia de Trabalho

O desenvolvimento segue um modelo **iterativo-incremental**, dividido em sessões. Cada sessão é registrada com: Objetivo, Ferramentas, Erros/Soluções, Aprendizados e Tempo.

Todo o código é versionado via **Git** e hospedado no **GitHub**, com commits descritivos. Foi criado um atalho no Git (`git sync`) para sincronizar continuamente o PC pessoal e o PC da escola.

---

## 3. Cronograma de Sessões

| Sessão  | Data          | Objetivo                                                      | Status       |
| ------- | ------------- | ------------------------------------------------------------- | ------------ |
| 00 a 10 | 05/10 a 24/10 | Fundação, coletores de dados, globo 3D e terremotos           | ✅ Concluída |
| 11      | 24/10/2026    | Implementação do Groq (IA) e Edge TTS (Voz Neural)            | ✅ Concluída |
| 12      | 26/10/2026    | Integração do J.A.R.V.I.S. (Mark-LVI) via Plugins             | ✅ Concluída |
| 13      | 26/10/2026    | Estudos de Exposição Online (Ngrok / Cloudflare)              | ✅ Concluída |
| 14      | 02/11/2026    | Otimização de Performance e Restauração de Dados de Voo       | ✅ Concluída |
| 15      | 02/11/2026    | Interface de Entrada (Chuva de Código Matrix + Orbe Three.js) | ✅ Concluída |

---

## 4. Registro Detalhado de Erros e Soluções

| #   | Sessão | Erro                           | Causa                                         | Solução Aplicada                                                     |
| --- | ------ | ------------------------------ | --------------------------------------------- | -------------------------------------------------------------------- |
| ... | ...    | (Erros anteriores)             | ...                                           | ...                                                                  |
| 17  | 11     | Erro 404 no Gemini (Models)    | Google desativou os modelos antigos           | Migração para a API do Groq (Llama 3.3)                              |
| 18  | 11     | Voz robótica                   | `SpeechSynthesis` nativo do navegador         | Uso do Edge TTS (`pt-BR-AntonioNeural`) no Backend                   |
| 19  | 12     | JARVIS não abria o ARGUS       | O Mark-LVI buscava um `.exe`, não um site     | Criação de um plugin Python (`abrir_argus.py`)                       |
| 20  | 15     | Imagem do Olho quebrada        | Links externos e falta do arquivo local       | Substituição por uma Intro com Chuva de Código e Orbe 3D em Three.js |
| 21  | 14     | Globo 3D demorava a renderizar | Bloqueio de carregamento e excesso de modelos | Carregamento em background e otimização do Cesium                    |

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
- **CesiumJS** (Globo 3D em alta resolução)
- **Three.js** (Orbe 3D na tela de introdução)
- **ESRI ArcGIS** (Mapas de satélite)

### Assistente Desktop (J.A.R.V.I.S.)

- **Mark-LVI** (Open Source)
- **Gemini API** (Google AI Studio)
- **Python Plugins** — Para interagir com o sistema e abrir o ARGUS

### Infraestrutura

- Git + GitHub
- **Ngrok / Cloudflare Tunnel** — Para exposição online segura (HTTPS).

---

## 6. Aprendizados Relevantes para o TCC

### 6.1 Arquitetura de Microsserviços e Integração

O projeto provou que é possível integrar um assistente de IA de Desktop (JARVIS) com uma aplicação Web distribuída (ARGUS). O JARVIS atua como um "acionador de comandos", abrindo o dashboard via web, demonstrando uma arquitetura moderna de sistemas.

### 6.2 Resiliência e Performance

A transição de imagens estáticas para um ambiente interativo (Matrix + Orbe 3D) exigiu otimizações no CesiumJS. O carregamento em segundo plano do mapa e a escolha de texturas mais leves garantiram que a experiência do usuário fosse fluida, mesmo em computadores com menos recursos.

### 6.3 Interface e Imersão (UX)

A introdução com Chuva de Código e a Orbe 3D (em Three.js) elevam drasticamente a percepção de valor do projeto. O ARGUS deixou de ser um "site de mapas" para se tornar um sistema de comando tático, digno de filmes de ficção científica.

---

## 7. Próximas Etapas

- Testar o link online no celular via Cloudflare Tunnel para a apresentação.
- Criar o roteiro de apresentação do TCC (o que falar enquanto o Jarvis e o ARGUS rodam).
- Gravar o vídeo demo de 3 minutos.
