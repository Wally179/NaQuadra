import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Code, Server, AppWindow } from 'lucide-react';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Sobre o Projeto',
  description: 'Na Quadra é um portfólio técnico fullstack com Next.js, NestJS, AWS e arquitetura serverless.',
};

const TECH_STACK = [
  { emoji: '⚛️', name: 'Next.js 16', role: 'App Router + SSR/SSG' },
  { emoji: '🔷', name: 'TypeScript', role: 'Type-safety end-to-end' },
  { emoji: '💚', name: 'Node.js', role: 'Runtime backend' },
  { emoji: '🏛️', name: 'NestJS', role: 'API REST modular' },
  { emoji: '🐬', name: 'MySQL', role: 'Dados relacionais (users, teams)' },
  { emoji: '🍃', name: 'MongoDB', role: 'Artigos e conteúdo dinâmico' },
  { emoji: '⚡', name: 'DynamoDB', role: 'Scores em tempo real' },
  { emoji: '☁️', name: 'AWS Lambda', role: 'Workers serverless' },
  { emoji: '📬', name: 'AWS SQS', role: 'Fila de eventos/mensageria' },
  { emoji: '📢', name: 'AWS SNS', role: 'Notificações push' },
  { emoji: '🪣', name: 'AWS S3', role: 'Assets e mídia' },
  { emoji: '⚙️', name: 'GitHub Actions', role: 'CI/CD automatizado' },
  { emoji: '🌀', name: 'Turborepo', role: 'Monorepo management' },
  { emoji: '🎨', name: 'CSS Modules', role: 'Design system sem framewk.' },
];

const FEATURES = [
  {
    icon: '🏀',
    title: 'Scoreboard em Tempo Real',
    desc: 'Jogos ao vivo com integração à API da ESPN. Um Lambda worker consome o feed da API a cada 30s, publica via SQS e atualiza o DynamoDB. O frontend faz polling inteligente com cache de edge (CDN) para minimizar latência.',
    tags: ['Lambda', 'SQS', 'DynamoDB', 'ESPN API'],
  },
  {
    icon: '📰',
    title: 'Feed de Notícias com Multi-fonte',
    desc: 'NestJS com arquitetura modular (Module/Service/Repository). Artigos vêm de múltiplas fontes (RSS, API, CMS) e são normalizados e persistidos no MongoDB. Suporta publicação interna por editores.',
    tags: ['NestJS', 'MongoDB', 'RSS Ingestion'],
  },
  {
    icon: '📚',
    title: 'Glossário Educativo',
    desc: 'Camada de educação para fãs iniciantes. Termos explicados em português, com busca full-text e filtros por dificuldade. Uma das diferenciações do produto e argumento de negócio para retenção de usuários.',
    tags: ['MongoDB', 'Full-text search'],
  },
  {
    icon: '🔔',
    title: 'Notificações Inteligentes',
    desc: 'Usuários se inscrevem em times favoritos. Um Lambda consome eventos de jogo do SQS e publica notificações via SNS para os assinantes, com suporte a WebPush e e-mail.',
    tags: ['Lambda', 'SNS', 'SQS', 'WebPush'],
  },
  {
    icon: '🔐',
    title: 'Auth com JWT + Refresh Token',
    desc: 'Autenticação stateless com JWT de curta duração e refresh tokens rotativos armazenados de forma segura. Roles de usuário (fan, editor, admin) controlam acesso à API com Guards do NestJS.',
    tags: ['JWT', 'NestJS Guards', 'MySQL'],
  },
  {
    icon: '📊',
    title: 'Migração de Legado → Serverless',
    desc: 'Demonstra a migração gradual de um monolito NestJS para uma arquitetura de microserviços/serverless na AWS. Primeiro os workers independentes migram para Lambda, preservando a API core estável.',
    tags: ['Node.js', 'Lambda', 'Strangler Fig Pattern'],
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🏗️</span>
        <h1 className={styles.heroTitle}>Sobre o Na Quadra</h1>
        <p className={styles.heroSubtitle}>
          Um portfólio técnico fullstack construído intencionalmente para demonstrar arquitetura moderna,
          integração com AWS, e domínio de Node.js/React em escala.
        </p>
      </div>

      {/* Tech Stack */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <AppWindow className={styles.sectionIcon} />
          Stack Tecnológico
        </h2>
        <div className={styles.techGrid}>
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className={styles.techCard}>
              <span className={styles.techEmoji}>{tech.emoji}</span>
              <span className={styles.techName}>{tech.name}</span>
              <span className={styles.techRole}>{tech.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Code className={styles.sectionIcon} />
          Arquitetura Frontend
        </h2>
        <div className={styles.archDiagram}>
          <pre className={styles.archCode}>{`
  ┌─────────────────────────────────────────────────────────┐
  │                    CLIENTE (Browser)                     │
  │  Next.js 16 · App Router · SSR/SSG · CSS Modules        │
  └──────────────────────┬──────────────────────────────────┘
                         │ HTTPS
  ┌──────────────────────▼──────────────────────────────────┐
  │                   AWS CloudFront (CDN)                   │
  └──────────────────────┬──────────────────────────────────┘
                         │
  ┌──────────────────────▼──────────────────────────────────┐
  │               NestJS API (apps/api)                      │
  │  Auth · Teams · Players · Articles · Standings           │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
  │  │  MySQL   │ │ MongoDB  │ │DynamoDB  │                 │
  │  │ (users)  │ │(articles)│ │(scores)  │                 │
  │  └──────────┘ └──────────┘ └──────────┘                 │
  └──────────┬────────────────────────┬────────────────────-┘
             │ publica eventos        │
  ┌──────────▼──────────┐  ┌─────────▼─────────────────────┐
  │     AWS SQS         │  │        AWS SNS                 │
  │  game-events-queue  │  │  notificações para usuários    │
  └──────────┬──────────┘  └────────────────────────────────┘
             │ consome
  ┌──────────▼──────────────────────────────────────────────┐
  │                  AWS Lambda Workers                       │
  │  score-sync · news-ingestion · notification-dispatch     │
  │                ↕ ESPN API / RSS Feeds                    │
  └─────────────────────────────────────────────────────────┘
  `}</pre>
        </div>
      </section>

      {/* Features */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Database className={styles.sectionIcon} />
          Funcionalidades Técnicas
        </h2>
        <div className={styles.featuresList}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureItem}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureTags}>
                  {f.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          <Server className={styles.sectionIcon} />
          Backend e Integração (BFF)
        </h2>
        <p className={styles.ctaText}>
          Este projeto é um portfólio vivo. O código-fonte está disponível no GitHub,
          incluindo CI/CD, testes, infraestrutura AWS e arquitetura de produção.
        </p>
        <div className={styles.ctaLinks}>
          <a
            href="https://github.com/Wally179"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaLink} ${styles.ctaPrimary}`}
          >
            GitHub →
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaLink} ${styles.ctaSecondary}`}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
