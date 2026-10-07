# 📖 DIÁRIO DE BORDO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Tagline:** "Cem olhos. Uma verdade."
**Autor:** [Acxell Viana Pinto]
**Início:** 05/10/2026

---

## 📅 05/10/2026 — SESSÃO 00: Planejamento

### 🎯 Objetivo

Definir identidade, ferramentas e estrutura do projeto.

### ✅ Decisões tomadas

- Nome oficial: PROJECT ARGUS
- Cor-assinatura: ARGUS AMBER (#FFB020)
- Paleta dark definida
- Padrão de botões: EN + tradução PT-BR em cinza
- Ferramentas escolhidas: VS Code, Git, Node.js, Python, Pinokio

---

## 📅 05/10/2026 — SESSÃO 01: Instalação do Ambiente

### 🎯 Objetivo

Instalar e verificar Node.js, Python, extensões do VS Code e criar estrutura inicial.

### 🛠️ Ferramentas usadas

- Windows
- Git Bash
- VS Code
- Pinokio

### ✅ O que funcionou

- Git Bash: já instalado
- VS Code: já instalado
- Pinokio: já instalado
- Pasta do projeto criada em: /c/Users/acxell PC/project-argus
- Git inicializado com sucesso (commit 79e571f)

### ❌ Erros encontrados

| Erro                              | Causa                                        | Solução                                                              |
| --------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| 0x80070659 (Python)               | Instalação bloqueada por política do sistema | Executar instalador como Administrador + marcar "Add Python to PATH" |
| `$'\302\226d': command not found` | Caractere invisível ao copiar/colar comando  | Digitar comandos manualmente                                         |
| `cd: too many arguments`          | Nome de usuário contém espaço (`acxell PC`)  | Usar `~` para representar a pasta home                               |

### 💡 Aprendizado do dia

- No Windows, instaladores de ferramentas de desenvolvimento frequentemente exigem privilégios de administrador.
- Digitar comandos manualmente evita erros invisíveis.
- Caminhos com espaço precisam de cuidado extra no Git Bash.

### ➡️ Próximo passo

Sessão 02 — Criar repositório no GitHub e conectar o projeto.

---

## 📅 05/10/2026 — SESSÃO 02: Conexão com o GitHub

### 🎯 Objetivo

Criar repositório remoto no GitHub e conectar o projeto local.

### 🛠️ Ferramentas usadas

- Git Bash
- GitHub
- VS Code

### ✅ O que funcionou

- Repositório criado: https://github.com/vnzzlv/project-argus
- Remote `origin` configurado
- Branch renomeada de `master` para `main`
- Primeiro push realizado com sucesso
- URL pública (privada por enquanto): vnzzlv/projeto-argus

### ❌ Erros encontrados

| Erro                                       | Causa                                                                       | Solução                                               |
| ------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| `User canceled device code authentication` | Janela de autenticação foi cancelada                                        | Refazer o `git push`                                  |
| `Password authentication is not supported` | GitHub aboliu senha comum desde 2021                                        | Usar OAuth pelo navegador (que abriu automaticamente) |
| `unable to read askpass response`          | Git Bash não conseguiu abrir a janela de autenticação na primeira tentativa | Refazer o `git push`                                  |

### 💡 Aprendizado do dia

- GitHub só aceita Personal Access Token (PAT) ou OAuth pelo navegador.
- Quando der erro de autenticação, tentar o comando de novo costuma resolver.
- Sempre completar a autorização no navegador quando a janela abrir.

### ➡️ Próximo passo

Sessão 03 — Criar estrutura de pastas do projeto (backend + frontend).

---

## 📅 05/10/2026 — SESSÃO 03: Estrutura de Pastas + README

### 🎯 Objetivo

Criar estrutura base do projeto e README oficial.

### ✅ O que funcionou

- Pastas criadas: backend/, frontend/, brand/
- README.md criado com identidade visual do ARGUS
- Badges com cor ARGUS AMBER (#FFB020)
- Commit 469ab47 enviado ao GitHub

### 💡 Aprendizado do dia

- Git não rastreia pastas vazias — só arquivos. As pastas backend/, frontend/ e brand/ só aparecerão no GitHub quando tiverem arquivos dentro.
- README é a "capa" do projeto: primeira impressão para qualquer avaliador.

### ➡️ Próximo passo

## Sessão 04 — Inicializar o backend Python (FastAPI) com ambiente virtual.

## 📅 05/10/2026 — SESSÃO 04: Backend Python (FastAPI)

### 🎯 Objetivo

Inicializar o backend Python com FastAPI e ambiente virtual isolado.

### 🛠️ Ferramentas usadas

- Git Bash
- VS Code
- Python 3.14
- FastAPI 0.142.2
- Uvicorn 0.54.0

### ✅ O que funcionou

- Ambiente virtual criado em `backend/venv/`
- FastAPI + Uvicorn instalados (19 pacotes no total)
- `requirements.txt` gerado com todas as versões travadas
- Arquivo `main.py` criado com 2 endpoints (`/` e `/health`)
- Servidor rodou em `http://127.0.0.1:8000`
- Endpoint `/` retornou JSON de identificação do ARGUS
- Swagger UI funcionando em `http://127.0.0.1:8000/docs`

### ❌ Erros encontrados

| Erro                                 | Causa                                        | Solução                                                         |
| ------------------------------------ | -------------------------------------------- | --------------------------------------------------------------- |
| (nenhum erro técnico nesta sessão)   | —                                            | —                                                               |
| Log `GET /favicon.ico 404 Not Found` | Navegador busca ícone de aba automaticamente | Normal — será resolvido quando adicionarmos o logo SVG do ARGUS |

### 💡 Aprendizado do dia

- Ambiente virtual (`venv`) isola as dependências do projeto, evitando conflitos com o Python do sistema.
- FastAPI gera documentação Swagger automaticamente (`/docs`), recurso valioso para demonstrar a API no TCC.
- `pip freeze > requirements.txt` garante reprodutibilidade do ambiente — ponto importante para banca avaliadora.
- Python 3.14 roda perfeitamente com FastAPI 0.142.2.

### ➡️ Próximo passo

Sessão 05 — Primeiro coletor de dados: voos em tempo real via OpenSky Network.

---

## 📅 05/10/2026 — SESSÃO 05: Coletor de Voos (OpenSky Network)

### ⏱️ Cronologia

- **Pausa anterior (Sessão 04):** 16:36
- **Retomada (Sessão 05):** 21:36
- **Fim da Sessão 05:** 21:55
- **Duração real:** 19 minutos
- **Estimativa:** 30–45 minutos
- **Status:** ✅ Abaixo da estimativa

### 🎯 Objetivo

Implementar o primeiro coletor de dados reais do ARGUS: voos em tempo real.

### 🛠️ Ferramentas usadas

- FastAPI 0.142.2
- httpx 0.28.1
- OpenSky Network API (https://opensky-network.org)

### ✅ O que funcionou

- Biblioteca httpx instalada (0.28.1)
- Pasta collectors/ criada com **init**.py
- Coletor collectors/flights.py implementado
- Endpoint /flights funcionando globalmente
- Filtro por Brasil (bbox) funcionando
- Swagger UI atualizado automaticamente
- Testes bem-sucedidos:
  - Global: 8.664 aeronaves rastreadas / 5 retornadas
  - Brasil: 192 aeronaves rastreadas / 10 retornadas
  - Exemplos reais capturados: UAL2281 (United), TAM3674 (LATAM), GLO1295 (GOL), PSA Airlines

### ❌ Erros encontrados

| Erro                                                            | Causa                                       | Solução                |
| --------------------------------------------------------------- | ------------------------------------------- | ---------------------- |
| (nenhum erro técnico)                                           | —                                           | —                      |
| Log `GET /favicon.ico 404`                                      | Navegador busca ícone automaticamente       | Comportamento esperado |
| Log `GET /.well-known/appspecific/com.chrome.devtools.json 404` | Chrome DevTools procurando arquivo de debug | Inofensivo, ignorar    |

### 💡 Aprendizado do dia

- OpenSky Network é uma API pública, gratuita e sem autenticação — excelente fonte OSINT para TCCs.
- A API tem limite de requisições por hora sem autenticação; em produção, considerar cadastro gratuito.
- httpx é o equivalente assíncrono do requests, ideal para FastAPI.
- O parâmetro bbox permite filtro geográfico eficiente (usado para focar no Brasil).
- Uvicorn com --reload reinicia o servidor automaticamente ao salvar arquivos.

### ➡️ Próximo passo

Sessão 06 — Coletor de satélites (N2YO / Celestrak).

### 📊 Estatísticas da sessão

- Linhas de código adicionadas: ~75 (flights.py) + ~50 (main.py atualizado)
- Endpoints criados: 1 (/flights)
- Fontes de dados integradas: 1 (OpenSky Network)

---

## 📅 06/10/2026 — SESSÃO 06: Coletor de Satélites (Celestrak + Skyfield)

### ⏱️ Cronologia

- **Início:** 16:55
- **Fim:** 17:25
- **Duração real:** 30 minutos
- **Estimativa:** 40–55 minutos
- **Status:** ✅ Muito abaixo da estimativa

### 🎯 Objetivo

Implementar o segundo coletor de dados reais do ARGUS: satélites em tempo real.

### 🛠️ Ferramentas usadas

- FastAPI
- httpx
- Skyfield 1.55
- NumPy 2.5.3
- sgp4 2.27
- Celestrak (fonte de dados TLE)

### ✅ O que funcionou

- Biblioteca Skyfield instalada (com NumPy e SGP4)
- Coletor collectors/satellites.py implementado
- Endpoint /satellites funcionando
- Cálculo orbital local (SGP4) — não depende de API de terceiros para posições
- Testes bem-sucedidos:
  - Estações: 20 disponíveis / 5 retornadas (ISS ZARYA, CSS TIANHE, NAUKA, POISK)
  - Starlink: 10.670 disponíveis / 10 retornadas
  - Swagger atualizado com o novo endpoint

### ❌ Erros encontrados

| Erro                  | Causa | Solução |
| --------------------- | ----- | ------- |
| (nenhum erro técnico) | —     | —       |

### 💡 Aprendizado do dia

- Celestrak fornece dados TLE (Two-Line Elements) de forma gratuita, sem cadastro.
- Skyfield calcula as posições orbitais localmente usando o algoritmo SGP4 (padrão NORAD).
- Isso demonstra domínio técnico superior: não apenas consumimos API, calculamos órbitas.
- A primeira requisição demora mais porque baixa o arquivo de efemérides (~17 MB), mas depois fica em cache.

### ➡️ Próximo passo

## Sessão 07 — Coletor de terremotos (USGS).

## 📅 06/10/2026 — SESSÃO 07: Coletor de Terremotos (USGS)

### ⏱️ Cronologia

- **Início:** 17:25
- **Fim:** 17:40
- **Duração real:** 15 minutos
- **Estimativa:** 20–30 minutos
- **Status:** ✅ Abaixo da estimativa

### 🎯 Objetivo

Implementar o terceiro coletor de dados reais do ARGUS: terremotos globais.

### 🛠️ Ferramentas usadas

- FastAPI
- httpx
- USGS Earthquake Hazards Program (https://earthquake.usgs.gov)

### ✅ O que funcionou

- Coletor collectors/earthquakes.py implementado
- Endpoint /earthquakes funcionando
- Filtros por período (hora/dia/semana/mês) e magnitude funcionando
- Testes bem-sucedidos:
  - Significativos 24h: 1 evento (M5.5 Ilhas Aleutas)
  - M2.5+ 24h: 40 disponíveis / 20 retornados
  - M4.5+ 7 dias: 116 disponíveis / 15 retornados
  - Eventos globais: Alasca, Havaí, Fiji, Rússia, Indonésia, Chile, Papua Nova Guiné, Irã, Tonga
- Swagger agora com 5 endpoints

### ❌ Erros encontrados

| Erro                  | Causa | Solução |
| --------------------- | ----- | ------- |
| (nenhum erro técnico) | —     | —       |

### 💡 Aprendizado do dia

- A USGS é a fonte oficial global de dados sísmicos — usar essa fonte no TCC dá credibilidade.
- A API da USGS não exige autenticação e não tem limite de requisições.
- 3º coletor implementado com sucesso — o padrão de arquitetura (collectors + endpoints) está se mostrando escalável.

### ➡️ Próximo passo

Sessão 08 — Coletor de câmeras públicas (Windy Webcams) OU início do frontend.

### 📊 Estatísticas da sessão

- Linhas de código adicionadas: ~90 (satellites.py) + ~30 (main.py)
- Endpoints criados: 1 (/satellites)
- Fontes de dados integradas: 2 (Celestrak + cálculo Skyfield)
- Satélites rastreados: 10.690+ (20 estações + 10.670 Starlink)

### ⏱️ Tempo gasto ao decorrer de todo o projeto

- [preencher]
