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

### ⏱️ Tempo gasto

- Estimado: 20–30 min
- Real: [55 min]

### ⏱️ Tempo gasto

- [preencher]
