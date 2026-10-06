# 📊 RELATÓRIO DE DESENVOLVIMENTO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Tagline:** Cem olhos. Uma verdade.
**Autor:** Acxell Viana Pinto
**Início do desenvolvimento:** 05/10/2026
**Repositório:** https://github.com/vnzzlv/project-argus
**Stack principal:** Python 3.14 + FastAPI + React (futuro)

---

## 1. Visão Geral

Este documento registra o processo de desenvolvimento do PROJECT ARGUS, incluindo decisões técnicas, erros encontrados e soluções aplicadas. Serve como base para o capítulo de Metodologia e Implementação do Trabalho de Conclusão de Curso.

O ARGUS é um sistema de Inteligência de Fontes Abertas (OSINT) para visualização global em tempo real, agregando dados públicos de aviação, satélites, câmeras, navios, cabos submarinos, terremotos e outras fontes.

---

## 2. Metodologia de Trabalho

O desenvolvimento segue um modelo **iterativo-incremental**, dividido em sessões. Cada sessão é registrada com:

- Objetivo
- Ferramentas utilizadas
- Erros e soluções
- Aprendizados
- Tempo gasto (estimado vs. real)

Todo o código é versionado via **Git** e hospedado no **GitHub**, com commits descritivos seguindo o padrão _Conventional Commits_ (feat, fix, docs, chore).

---

## 3. Cronograma de Sessões

| Sessão | Data       | Objetivo                                    | Status       | Tempo Estimado | Tempo Real |
| ------ | ---------- | ------------------------------------------- | ------------ | -------------- | ---------- | --- | --- |
| 00     | 05/10/2026 | Planejamento e identidade visual            | ✅ Concluída | —              | —          |
| 01     | 05/10/2026 | Instalação do ambiente                      | ✅ Concluída | 40–60 min      | ~90 min    |
| 02     | 05/10/2026 | Conexão com GitHub                          | ✅ Concluída | 15–20 min      | ~30 min    |
| 03     | 05/10/2026 | Estrutura de pastas + README                | ✅ Concluída | 15 min         | ~20 min    |
| 04     | 05/10/2026 | Backend Python (FastAPI)                    | ✅ Concluída | 20–30 min      | ~25 min    |
| 05     | 05/10/2026 | Coletor de voos (OpenSky)                   | ✅ Concluída | 30–45 min      | 19 min     |
| 06     | 06/10/2026 | Coletor de satélites (Celestrak + Skyfield) | ✅ Concluída | 40–55 min      | 7 min      | —   | —   |
| 07     | —          | Coletor de terremotos (USGS)                | 🔜 Planejada | —              | —          |
| 08     | —          | Frontend inicial (React + MapLibre)         | 🔜 Planejada | —              | —          |
| 09     | —          | Camadas visuais + HUD estilo ARGUS          | 🔜 Planejada | —              | —          |
| 10     | —          | Motor de alertas de anomalias               | 🔜 Planejada | —              | —          |
| 11     | —          | Empacotamento via Pinokio                   | 🔜 Planejada | —              | —          |
| 12     | —          | Documentação final e vídeo demo             | 🔜 Planejada | —              | —          |

---

## 4. Registro Detalhado de Erros

| #   | Sessão | Erro                                                        | Causa                                                           | Solução Aplicada                                                     |
| --- | ------ | ----------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| 01  | 01     | `0x80070659` (Python)                                       | Instalação bloqueada por política do sistema Windows            | Executar instalador como Administrador + marcar "Add Python to PATH" |
| 02  | 01     | `$'\302\226d': command not found`                           | Caractere invisível Unicode ao copiar/colar comando no Git Bash | Digitar comandos manualmente                                         |
| 03  | 01     | `cd: too many arguments`                                    | Nome de usuário contém espaço (`acxell PC`)                     | Usar `~` para representar a home; usar aspas em caminhos com espaço  |
| 04  | 01     | `mkdir: Permission denied`                                  | Comando executado em pasta protegida do sistema                 | Navegar até a pasta home antes de criar diretórios                   |
| 05  | 01     | `mkdir: File exists`                                        | Tentativa de criar pasta já existente                           | Navegar corretamente com `cd ..` em vez de recriar                   |
| 06  | 02     | `User canceled device code authentication`                  | Autenticação OAuth cancelada no navegador                       | Repetir `git push`                                                   |
| 07  | 02     | `Password authentication is not supported`                  | GitHub aboliu autenticação por senha                            | Usar OAuth via navegador                                             |
| 08  | 02     | `unable to read askpass response`                           | Git Bash falhou ao abrir janela de autenticação                 | Repetir comando — navegador abriu corretamente                       |
| 09  | 04     | `GET /favicon.ico 404 Not Found`                            | Navegador busca ícone automaticamente                           | Comportamento esperado — será resolvido com logo SVG                 |
| 10  | 05     | `GET /.well-known/appspecific/com.chrome.devtools.json 404` | Chrome DevTools busca arquivo de debug                          | Inofensivo                                                           |

---

## 5. Stack Tecnológico Consolidado

### Backend

- **Python 3.14**
- **FastAPI 0.142.2** — framework web assíncrono
- **Uvicorn 0.54.0** — servidor ASGI
- **Pydantic 2.13.5** — validação de dados
- **Starlette 1.7.0** — base do FastAPI
- **httpx 0.28.1** — cliente HTTP assíncrono
- **httpcore 1.0.9** — núcleo HTTP
- **certifi 2026.7.22** — certificados SSL
- **Skyfield 1.55** — cálculo orbital (SGP4)
- **NumPy 2.5.3** — computação numérica
- **sgp4 2.27** — propagação orbital (padrão NORAD)
- **jplephem 2.24** — efemérides planetárias

### Frontend (a implementar)

- React 18+
- MapLibre GL JS / CesiumJS
- Vite

### Infraestrutura

- Git + GitHub
- Ambiente virtual Python (`venv`)
- Pinokio (planejado para distribuição 1-clique)

---

## 6. Registro de Decisões Técnicas

| Decisão                                  | Justificativa                                                                                                        | Data       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Nome PROJECT ARGUS**                   | Referência a Argos Panoptes (mitologia grega, cem olhos). Original, defensável academicamente.                       | 05/10/2026 |
| **Cor-assinatura ARGUS AMBER (#FFB020)** | Traduz o "olho flamejante", diferencia de projetos cyberpunk genéricos (azul/roxo)                                   | 05/10/2026 |
| **Python + FastAPI**                     | Framework moderno, assíncrono, com documentação automática (Swagger). Ideal para APIs que consomem múltiplas fontes. | 05/10/2026 |
| **httpx em vez de requests**             | httpx suporta async nativo, alinhado com FastAPI                                                                     | 05/10/2026 |
| **OpenSky Network**                      | API pública, gratuita, sem autenticação obrigatória                                                                  | 05/10/2026 |
| **Pasta collectors/**                    | Separação de responsabilidades: cada fonte de dados tem seu próprio módulo                                           | 05/10/2026 |

---

## 7. Aprendizados Relevantes para o TCC

### 7.1 Ambientes Virtuais

O uso de `venv` isola as dependências do projeto, evitando conflitos com o Python global do sistema. O arquivo `requirements.txt` garante a reprodutibilidade do ambiente — requisito importante para avaliação acadêmica.

### 7.2 FastAPI e Documentação Automática

O FastAPI gera automaticamente uma documentação interativa (Swagger UI) acessível em `/docs`, o que demonstra profissionalismo e facilita a avaliação da API por terceiros.

### 7.3 Autenticação GitHub

Desde 2021 o GitHub não aceita senha comum para operações Git via HTTPS, exigindo Personal Access Token (PAT) ou autenticação OAuth via navegador.

### 7.4 Caminhos com Espaço no Windows

Nomes de usuário com espaço (ex: `acxell PC`) exigem cuidado extra no Git Bash. Solução: usar `~` para representar a home ou colocar o caminho entre aspas.

### 7.5 APIs Abertas e OSINT

A OpenSky Network demonstrou que é possível obter dados globais em tempo real de forma gratuita e legal. Isso valida a viabilidade técnica do ARGUS como projeto de OSINT.

### 7.6 Filtros Geográficos (bbox)

O parâmetro `bbox` (bounding box) permite filtrar dados por área geográfica, essencial para análises regionais (ex: apenas voos sobre o Brasil).

---

## 8. Estatísticas do Projeto

| Métrica                       | Valor                          |
| ----------------------------- | ------------------------------ |
| Total de sessões concluídas   | 6 (00 a 05)                    |
| Total de commits no GitHub    | 5                              |
| Total de arquivos versionados | 6                              |
| Fontes de dados integradas    | 1 (OpenSky Network)            |
| Endpoints da API              | 3 (`/`, `/health`, `/flights`) |
| Aeronaves rastreadas (global) | ~8.664                         |
| Aeronaves sobre o Brasil      | ~192                           |

---

## 9. Próximas Etapas

- ✅ Sessão 05: Coletor de voos em tempo real (OpenSky Network)
- ✅ Sessão 06: Coletor de satélites (Celestrak + Skyfield)
- 🔜 Sessão 07: Coletor de terremotos (USGS)
- 🔜 Sessão 08: Frontend inicial (dashboard React + MapLibre)
- 🔜 Sessão 09: Camadas visuais + HUD estilo ARGUS
- 🔜 Sessão 10: Motor de alertas de anomalias
- 🔜 Sessão 11: Empacotamento via Pinokio
- 🔜 Sessão 12: Documentação final e vídeo demo

---

## 10. Observações Finais

Este relatório é atualizado ao final de cada sessão e serve como fonte primária para o capítulo de Metodologia e Resultados do TCC. Todo o código-fonte está disponível no repositório oficial, com histórico completo de commits.

**Última atualização:** 05/10/2026 às 21:55
**Próxima atualização prevista:** após Sessão 06
