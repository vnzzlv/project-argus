# 📊 RELATÓRIO DE DESENVOLVIMENTO — PROJECT ARGUS

**Projeto:** A.R.G.U.S. — Aggregated Reconnaissance and Global Unified System
**Subtítulo:** O Olho de Deus 2.0
**Autor:** Acxell Viana Pinto
**Início do desenvolvimento:** 05/10/2026
**Repositório:** https://github.com/vnzzlv/project-argus

---

## 1. Visão Geral

Este documento registra o processo de desenvolvimento do PROJECT ARGUS, incluindo decisões técnicas, erros encontrados e soluções aplicadas, servindo como base para o capítulo de Metodologia e Implementação do Trabalho de Conclusão de Curso.

---

## 2. Metodologia de Trabalho

O desenvolvimento segue um modelo iterativo-incremental, dividido em sessões. Cada sessão é registrada com:

- Objetivo
- Ferramentas utilizadas
- Erros e soluções
- Aprendizados
- Tempo gasto (estimado vs. real)

Todo o código é versionado via Git e hospedado no GitHub, com commits descritivos seguindo o padrão _Conventional Commits_.

---

## 3. Cronograma de Sessões

| Sessão | Data       | Objetivo                         | Status       | Tempo Estimado | Tempo Real  |
| ------ | ---------- | -------------------------------- | ------------ | -------------- | ----------- |
| 00     | 05/10/2026 | Planejamento e identidade visual | ✅ Concluída | —              | —           |
| 01     | 05/10/2026 | Instalação do ambiente           | ✅ Concluída | 40–60 min      | ~90 min     |
| 02     | 05/10/2026 | Conexão com GitHub               | ✅ Concluída | 15–20 min      | ~30 min     |
| 03     | 05/10/2026 | Estrutura de pastas + README     | ✅ Concluída | 15 min         | ~20 min     |
| 04     | 05/10/2026 | Backend Python (FastAPI)         | ✅ Concluída | 20–30 min      | [preencher] |
| 05     | —          | Coletor de voos (OpenSky)        | 🔜 Planejada | —              | —           |

---

## 4. Registro Detalhado de Erros

| #   | Sessão | Erro                                       | Causa                                                           | Solução Aplicada                                                     |
| --- | ------ | ------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| 01  | 01     | `0x80070659` (Python)                      | Instalação bloqueada por política do sistema Windows            | Executar instalador como Administrador + marcar "Add Python to PATH" |
| 02  | 01     | `$'\302\226d': command not found`          | Caractere invisível Unicode ao copiar/colar comando no Git Bash | Digitar comandos manualmente                                         |
| 03  | 01     | `cd: too many arguments`                   | Nome de usuário contém espaço (`acxell PC`)                     | Usar `~` para representar a home; usar aspas em caminhos com espaço  |
| 04  | 01     | `mkdir: Permission denied`                 | Comando executado em pasta protegida do sistema                 | Navegar até a pasta home antes de criar diretórios                   |
| 05  | 01     | `mkdir: File exists`                       | Tentativa de criar pasta já existente                           | Navegar corretamente com `cd ..` em vez de recriar                   |
| 06  | 02     | `User canceled device code authentication` | Autenticação OAuth cancelada no navegador                       | Repetir `git push`                                                   |
| 07  | 02     | `Password authentication is not supported` | GitHub aboliu autenticação por senha                            | Usar OAuth via navegador                                             |
| 08  | 02     | `unable to read askpass response`          | Git Bash falhou ao abrir janela de autenticação                 | Repetir comando — navegador abriu corretamente                       |
| 09  | 04     | `GET /favicon.ico 404 Not Found`           | Navegador busca ícone automaticamente                           | Comportamento esperado — será resolvido com logo SVG                 |

---

## 5. Stack Tecnológico Consolidado

### Backend

- **Python 3.14**
- **FastAPI 0.142.2** — framework web assíncrono
- **Uvicorn 0.54.0** — servidor ASGI
- **Pydantic 2.13.5** — validação de dados
- **Starlette 1.7.0** — base do FastAPI

### Frontend (a implementar)

- React 18+
- MapLibre GL JS / CesiumJS

### Infraestrutura

- Git + GitHub
- Ambiente virtual Python (`venv`)
- Pinokio (planejado para distribuição)

---

## 6. Aprendizados Relevantes para o TCC

### 6.1 Ambientes Virtuais

O uso de `venv` isola as dependências do projeto, evitando conflitos com o Python global do sistema. O arquivo `requirements.txt` garante a reprodutibilidade do ambiente — requisito importante para avaliação acadêmica.

### 6.2 FastAPI e Documentação Automática

O FastAPI gera automaticamente uma documentação interativa (Swagger UI) acessível em `/docs`, o que demonstra profissionalismo e facilita a avaliação da API por terceiros.

### 6.3 Autenticação GitHub

Desde 2021 o GitHub não aceita senha comum para operações Git via HTTPS, exigindo Personal Access Token (PAT) ou autenticação OAuth via navegador.

### 6.4 Caminhos com Espaço no Windows

Nomes de usuário com espaço (ex: `acxell PC`) exigem cuidado extra no Git Bash. Solução: usar `~` para representar a home ou colocar o caminho entre aspas.

---

## 7. Próximas Etapas

- Sessão 05: Coletor de voos em tempo real (OpenSky Network)
- Sessão 06: Coletor de satélites (N2YO / Celestrak)
- Sessão 07: Coletor de terremotos (USGS)
- Sessão 08: Frontend inicial (dashboard React + MapLibre)
- Sessão 09: Camadas visuais + HUD estilo ARGUS
- Sessão 10: Motor de alertas de anomalias
- Sessão 11: Empacotamento via Pinokio
- Sessão 12: Documentação final e vídeo demo

---

## 8. Observações

Este relatório é atualizado ao final de cada sessão e serve como fonte primária para o capítulo de Metodologia e Resultados do TCC.
