# 📊 RELATÓRIO DE DESENVOLVIMENTO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Tagline:** Cem olhos. Uma verdade.
**Autor:** Acxell Viana Pinto
**Início do desenvolvimento:** 05/10/2026
**Repositório:** https://github.com/vnzzlv/project-argus
**Stack principal:** Python + FastAPI + React + CesiumJS (3D)

---

## 1. Visão Geral

Este documento registra o processo de desenvolvimento do PROJECT ARGUS, incluindo decisões técnicas, erros encontrados e soluções aplicadas. Serve como base para o capítulo de Metodologia e Implementação do Trabalho de Conclusão de Curso.

O ARGUS é um sistema de Inteligência de Fontes Abertas (OSINT) para visualização global em tempo real, agregando dados públicos de aviação, satélites, terremotos e outras fontes em um dashboard 3D imersivo.

---

## 2. Metodologia de Trabalho

O desenvolvimento segue um modelo **iterativo-incremental**, dividido em sessões. Cada sessão é registrada com: Objetivo, Ferramentas, Erros/Soluções, Aprendizados e Tempo.

Todo o código é versionado via **Git** e hospedado no **GitHub**, com commits descritivos. Para garantir a sincronização contínua entre o PC de casa e o PC da escola, foi criado um atalho personalizado no Git (`git sync`), que automatiza o `pull`, `add`, `commit` e `push`.

---

## 3. Cronograma de Sessões

| Sessão | Data       | Objetivo                                         | Status       | Tempo Estimado | Tempo Real |
| ------ | ---------- | ------------------------------------------------ | ------------ | -------------- | ---------- |
| 00     | 05/10/2026 | Planejamento e identidade visual                 | ✅ Concluída | —              | —          |
| 01     | 05/10/2026 | Instalação do ambiente                           | ✅ Concluída | 40–60 min      | ~90 min    |
| 02     | 05/10/2026 | Conexão com GitHub                               | ✅ Concluída | 15–20 min      | ~30 min    |
| 03     | 05/10/2026 | Estrutura de pastas + README                     | ✅ Concluída | 15 min         | ~20 min    |
| 04     | 05/10/2026 | Backend Python (FastAPI)                         | ✅ Concluída | 20–30 min      | ~25 min    |
| 05     | 05/10/2026 | Coletor de voos (OpenSky)                        | ✅ Concluída | 30–45 min      | 19 min     |
| 06     | 06/10/2026 | Coletor de satélites (Celestrak + Skyfield)      | ✅ Concluída | 40–55 min      | 7 min      |
| 07     | 06/10/2026 | Coletor de terremotos (USGS)                     | ✅ Concluída | 20–30 min      | ~10 min    |
| 08     | 06/10/2026 | Frontend 2D (React + MapLibre)                   | ✅ Concluída | 45–60 min      | ~50 min    |
| 08.1   | 20/10/2026 | Setup do Frontend 3D (CesiumJS)                  | ✅ Concluída | 30 min         | ~20 min    |
| 08.2   | 20/10/2026 | Mapas realistas e labels (ESRI)                  | ✅ Concluída | 20 min         | ~15 min    |
| 08.3   | 21/10/2026 | Resolução de ambiente no PC da escola (uv)       | ✅ Concluída | 40 min         | ~60 min    |
| 08.4   | 21/10/2026 | Contorno de bloqueio de porta (WinError 10013)   | ✅ Concluída | 10 min         | ~5 min     |
| 08.5   | 23/10/2026 | Voos em tempo real no globo 3D                   | ✅ Concluída | 40 min         | ~30 min    |
| 08.6   | 23/10/2026 | Origem, Destino e Companhia (adsbdb)             | ✅ Concluída | 40 min         | ~25 min    |
| 08.7   | 23/10/2026 | Cores por Companhia e Popups                     | ✅ Concluída | 20 min         | ~15 min    |
| 08.8   | 23/10/2026 | Modelos 3D e Rastro Atrás do Avião               | ✅ Concluída | 30 min         | ~20 min    |
| 08.8.1 | 23/10/2026 | Correção da Rotação do Modelo 3D (Eixo X)        | ✅ Concluída | 10 min         | ~5 min     |
| 09     | 24/10/2026 | Inserir satélites orbitando em 3D no globo       | ✅ Concluída | 40 min         | ~45 min    |
| 09.1   | 24/10/2026 | Cores dos satélites por operadora + Fallback     | ✅ Concluída | 30 min         | ~25 min    |
| 10     | 24/10/2026 | Terremotos no Globo 3D (Círculos Pulsantes)      | ✅ Concluída | 30 min         | ~20 min    |
| 11     | 24/10/2026 | O Despertar do VISION e Intro Cinematográfica    | ✅ Concluída | 60 min         | ~45 min    |
| 11.1   | 24/10/2026 | Autenticação OAuth2 na OpenSky (Fim do Erro 429) | ✅ Concluída | 30 min         | ~15 min    |

---

## 4. Registro Detalhado de Erros e Soluções

| #   | Sessão | Erro                                       | Causa                                                          | Solução Aplicada                                          |
| --- | ------ | ------------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------- |
| 01  | 01     | `0x80070659` (Python)                      | Instalação bloqueada por política do Windows                   | Executar instalador como Administrador                    |
| 02  | 01     | `$'\302\226d': command not found`          | Caractere invisível Unicode no Git Bash                        | Digitar comandos manualmente                              |
| 03  | 01     | `cd: too many arguments`                   | Nome de usuário com espaço (`acxell PC`)                       | Usar `~` ou aspas nos caminhos                            |
| 04  | 02     | `Password authentication is not supported` | GitHub aboliu senhas comuns                                    | Autenticação via OAuth (navegador/celular)                |
| 05  | 08     | Erro de CORS no Globo 3D                   | Porta 5174 não estava na lista do backend                      | Adicionar portas 5173 e 5174 no CORS                      |
| 06  | 08     | `Worker failed to load` (Vite)             | Incompatibilidade de Web Workers (Vite vs MapLibre)            | Configurar `worker: { format: 'es' }` no Vite             |
| 07  | 08     | `API KEY REQUIRED` no mapa                 | CartoDB passou a exigir chave                                  | Troca para ESRI World Imagery (gratuito)                  |
| 08  | 08.3   | Falha de compilação C++ no PC da escola    | Python 3.15 sem binários prontos                               | Instalar Python 3.12 isolado via `uv`                     |
| 09  | 08.4   | `WinError 10013`                           | Firewall bloqueou a porta 8000                                 | Rodar servidor na porta 8080                              |
| 10  | 08.8.1 | Avião voando "de lado"                     | Modelo 3D original aponta para o Eixo Leste                    | Subtrair 90º (`heading - 90`) na orientação               |
| 11  | 09     | `502 Bad Gateway` (OpenSky)                | Limite de requisições da API pública atingido (bloqueio de IP) | Implementação de Cache (60s) e Fallback com dados locais  |
| 12  | 09     | Modelo 3D do satélite não carrega          | Navegador bloqueia download de modelos `.glb` de certas redes  | Troca de modelo 3D por pontos coloridos (Radar Blips/HUD) |
| 13  | 11.1   | `429 Too Many Requests` (OpenSky)          | A OpenSky mudou as regras e não aceita mais Basic Auth         | Migração para OAuth2 (Client ID e Client Secret)          |
| 14  | 11     | Microfone bloqueado no navegador           | Navegadores exigem interação do usuário para liberar áudio     | Criação da Intro da Orbe (clique libera mic e áudio)      |

---

## 5. Stack Tecnológico Consolidado

### Backend

- **Python 3.14** (Casa) / **Python 3.12** (Escola via `uv`)
- **FastAPI 0.142.2** — framework web assíncrono
- **Uvicorn 0.54.0** — servidor ASGI
- **Pydantic 2.13.5** — validação de dados
- **httpx 0.28.1** — cliente HTTP assíncrono
- **Skyfield 1.55 / NumPy / SGP4** — cálculo orbital de satélites
- **adsbdb API** — integração de dados de rotas aéreas

### Frontend

- **React 19** + **Vite 8**
- **MapLibre GL JS** (Visão 2D)
- **CesiumJS** (Visão 3D Orbital)
- **ESRI ArcGIS** (Camada de satélite com labels)
- **Web Speech API** (Síntese de voz e reconhecimento de fala para o VISION)

### Infraestrutura

- Git + GitHub (Sincronização entre múltiplos PCs)
- Ambiente virtual Python (`venv` / `uv`)
- OpenSky OAuth2 (Autenticação segura para a API de voos)

---

## 6. Registro de Decisões Técnicas

| Decisão                       | Justificativa                                                                                                                            | Data       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Nome PROJECT ARGUS**        | Referência a Argos Panoptes (cem olhos). Original e defensável.                                                                          | 05/10/2026 |
| **Cor ARGUS AMBER (#FFB020)** | Traduz o "olho flamejante" e diferencia de projetos genéricos.                                                                           | 05/10/2026 |
| **Uso do CesiumJS**           | Melhor biblioteca open-source para globo 3D e modelos `.glb`.                                                                            | 20/10/2026 |
| **Enriquecimento via adsbdb** | API gratuita que fornece companhia, origem e destino sem chave.                                                                          | 23/10/2026 |
| **Modelos 3D coloridos**      | Baixar 200 modelos diferentes travaria o navegador. A solução foi usar um modelo base e aplicar cores da companhia via `ColorBlendMode`. | 23/10/2026 |
| **Satélites como pontos**     | Modelos 3D `.glb` falhavam por bloqueio de rede. Pontos coloridos (Radar) garantem visibilidade e performance.                           | 24/10/2026 |
| **Terremotos como círculos**  | Círculos vermelhos com tamanho dinâmico (`magnitude * 4`) permitem leitura visual imediata da intensidade sísmica.                       | 24/10/2026 |
| **Intro Cinematográfica**     | Resolve o bloqueio de áudio/microfone dos navegadores (exige clique) e cria uma experiência imersiva estilo Tony Stark.                  | 24/10/2026 |

---

## 7. Aprendizados Relevantes para o TCC

### 7.1 Ambientes Virtuais e Portabilidade

A experiência no PC da escola mostrou a importância de ambientes isolados. O uso do `uv` permitiu instalar o Python 3.12 e todas as dependências sem precisar de permissões de administrador, garantindo que o projeto rode em qualquer máquina.

### 7.2 Visualização Geoespacial 3D

No CesiumJS, modelos 3D padrão (`.glb`) frequentemente têm seu eixo frontal no Leste (X), enquanto dados de aviação usam o Norte (Y). A conversão matemática (`heading - 90`) foi essencial para alinhar a física do voo à representação visual.

### 7.3 Resiliência de Software e Segurança de APIs

A dependência de APIs públicas (como OpenSky) exige planejamento de contingência. A migração de Basic Auth para OAuth2 resolveu problemas de limite de requisições (Rate Limit) e garantiu a estabilidade do sistema. Além disso, a criação do Fallback (Plano B) provou-se vital para que o sistema nunca fique sem dados na tela durante uma demonstração.

### 7.4 Design de Interface e Interação por Voz

A Web Speech API permite criar comandos de voz sem bibliotecas externas, mas exige lidar com as políticas de segurança dos navegadores (bloqueio de áudio automático). A solução de "Boot Screen" interativa (Orbe do Jarvis) contornou isso de forma elegante, unindo UX (Experiência do Usuário) e requisitos técnicos.

---

## 8. Estatísticas do Projeto

| Métrica                     | Valor                                                         |
| --------------------------- | ------------------------------------------------------------- |
| Total de sessões concluídas | 24 (00 a 11.1)                                                |
| Total de commits no GitHub  | 15+                                                           |
| Fontes de dados integradas  | 4 (OpenSky, Celestrak, USGS, adsbdb)                          |
| Endpoints da API            | 5 (`/`, `/health`, `/flights`, `/satellites`, `/earthquakes`) |
| Aeronaves no globo          | 200+ (dados reais via OAuth2)                                 |
| Satélites no globo          | 50 (coloridos por operadora)                                  |
| Terremotos no globo         | 100 (últimas 24h, magnitude 2.5+)                             |
| Comandos de voz do VISION   | 5+ ("Modo Viana", "Trilha 2", "Volume 50%", etc.)             |

---

## 9. Próximas Etapas

- ✅ Sessão 11.1: VISION implementado, intro cinematográfica e OpenSky via OAuth2.
- 🔜 Sessão 12: Configuração de acesso remoto via Ngrok (Celular).
- 🔜 Sessão 13: Documentação final do TCC e vídeo de demonstração.

---

## 10. Observações Finais

Este relatório é atualizado ao final de cada sessão e serve como fonte primária para o capítulo de Metodologia e Resultados do TCC. Todo o código-fonte está disponível no repositório oficial, com histórico completo de commits.

**Última atualização:** 24/10/2026
**Próxima atualização prevista:** após Sessão 12 (Acesso Remoto)
