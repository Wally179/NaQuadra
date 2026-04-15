<div align="center">
  <h1>🏀 Na Quadra</h1>
  <p><strong>A Plataforma Definitiva de Acompanhamento da NBA</strong></p>
  <p>Arquitetura Monorepo Fullstack • Serverless Ready • Integração ESPN API Real-Time</p>

  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turborepo-2.0-EF4444?style=for-the-badge&logo=turborepo" alt="Turborepo" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql" alt="Postgres" />
</div>

<br />

## 📖 Sobre o Projeto

O **Na Quadra** transcende uma simples aplicação de notícias. Ele foi desenvolvido meticulosamente como um ecossistema de alta performance (Monorepo via Turborepo) que demonstra proficiência moderna de desenvolvimento Fullstack.

Seu objetivo é ser a ponte entre o entretenimento esportivo (NBA) e uma arquitetura robusta, servindo como uma peça chave de portfólio para perfis de Engenharia de Software Fullstack, aplicando padrões rigorosos de design de software, tipagem forte conectada do front ao back e provisionamento Serverless.

### 🌟 Principais Funcionalidades
- **Portal de Times e Atletas**: Integração agressiva com a *Core ESPN API*, mapeando numericamente Slugs flexíveis em dados de quadra (Salários, Altura, Envergadura e Status).
- **Scoreboard Real-Time**: Fitas estendidas que mostram jogos ao vivo (`AO VIVO`).
- **Resiliência e Fallback ("Graceful Degradation")**: Implementações robustas `try/catch`. Caso o servidor caia ou os limites de taxa excedam as cotas de nuvem gratuita, a aplicação é inteligente o suficiente para injetar instantaneamente bibliotecas Mockadas em React renderizadas via servidor sem causar danos à UX.
- **Padrão Proxy para Bypass de CORS**: Next.js App Router API funcionando como proxy backend pass-through para o NestJS.

---

## 🛠️ Tecnologias e Arquitetura

O ecossistema é mantido em sob a batuta de múltiplos workspaces dentro do mesmo repositório:

### Frontend (`apps/web`)
- **Next.js (App Router)** utilizando Sever e Client Components de forma equilibrada para maximizar SEO (ISR revalidation)
- **Tailwind-like design** customizado baseado em Tokens e CSS Modules de Alta performance
- **Tipagem rígida integrada** a partir de um workspace de biblioteca global (`@naquadra/types`)

### Backend (`apps/api`)
- **NestJS** atuando no padrão RESTful com suporte a Rate Limit, JWT e serializações DTO complexas
- **Serverless PostgreSQL (Neon)** via `TypeORM` para dados transacionais (Usuários, Relacionamentos)
- **Document NoSQL (MongoDB Atlas)** via `Mongoose` focado na renderização otimizada de dados estáticos do Glossário (Modelagem Híbrida de Banco).

---

## 🚀 Como Rodar o Projeto Localmente (Guia Passo-a-Passo)

O projeto foi configurado para ser o mais *"Plug and Play"* possível, minimizando longos setups.

### Pré-requisitos
- **Node.js** (v20+ recomendado)
- **PNPM** (Gerenciador de pacotes exigido pelos Workspaces do projeto)
- **Docker Compose** instalado localmente na máquina

### 1. Clonar e Instalar e Preparar
Baixe as dependências utilizando o cache otimizado:
```bash
git clone https://github.com/SeuUsuario/na-quadra.git
cd na-quadra
pnpm install
```

### 2. Configurar Variáveis de Ambiente
Temos um arquivo de exemplo preparado. Na pasta do backend (`apps/api`), crie o arquivo definitivo de variáveis e utilize a configuração padrão para *Local Dev*.
```bash
# Entre na pasta e copie o repositório de envs
cd apps/api
cp .env.example .env
```
*(Opcional: Caso deseje testar a plataforma "Offline", sem subir docker ou conectar DB, edite seu arquivo `.env` para apontar a variável `SKIP_DB=true`).*

### 3. Subir Contêiners de Bancos de Dados
De volta para a pasta raiz da aplicação (`na-quadra`), em seu Terminal rode o Docker em background para ligar instantaneamente o **Postgres 15** e **Mongo 7**:
```bash
docker-compose up -d
```

### 4. Rodar o Turborepo
Tudo pronto. Nossa orquestração permite que uma única linha ative todos os frontends, backends e checadores de rotas paralelamente:
```bash
npx turbo run dev
```

Abra o navegador e acesse a Magia Real-Time: **`http://localhost:3000`**!

---

## ☁️ Implantação e Nuvem (Deploy Serverless)

A arquitetura do Na Quadra não necessita de VMs complexas. Foram projetados Blueprints para facilitação Cloud nativa:
- **`render.yaml`**: Arquivo na raiz orienta a compilação gratuita do Worker Service no [Render](https://render.com).
- **`apps/web/vercel.json`**: Direciona o painel da Vercel para identificar o contexto correto de *Root Directory* no repositório Monorepo, ignorando compilações do backend.
- Os Bancos locais Dockerizados se substituem inteiramente pelas Connections Strings do *Neon DB Pool* e *MongoDB Atlas Fleet*.

---

*Desenhado visando um padrão de Excelência, Code-readability e Manutenção Fullstack Sustentável. 🚀*
