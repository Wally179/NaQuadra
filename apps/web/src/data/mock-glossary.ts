// ============================================================
// Na Quadra — Mock Data: Glossary NBA
// ============================================================

import type { GlossaryEntry } from '@naquadra/types';

export const MOCK_GLOSSARY: GlossaryEntry[] = [
  // === COMPETITION ===
  { id: 'g1', term: 'Playoffs', slug: 'playoffs', category: 'competition', difficulty: 'beginner', shortDefinition: 'A fase eliminatória da NBA que acontece após a temporada regular. Os 16 melhores times disputam séries de melhor de 7 jogos até as Finais.', relatedTerms: ['seed', 'play-in', 'best-of-seven'] },
  { id: 'g2', term: 'Play-In', slug: 'play-in', category: 'competition', difficulty: 'beginner', shortDefinition: 'Mini-torneio entre os times classificados entre 7º e 10º lugar de cada conferência para definir as últimas vagas nos Playoffs.', relatedTerms: ['playoffs', 'seed'] },
  { id: 'g3', term: 'Seed', slug: 'seed', category: 'competition', difficulty: 'beginner', shortDefinition: 'A posição do time na classificação da sua conferência. O seed #1 é o melhor time e tem vantagem de mando de quadra nos Playoffs.', relatedTerms: ['playoffs', 'conferencia'] },
  { id: 'g4', term: 'Conferência', slug: 'conferencia', category: 'competition', difficulty: 'beginner', shortDefinition: 'A NBA é dividida em duas conferências: Leste e Oeste, cada uma com 15 times. Os Playoffs são disputados dentro de cada conferência até as Finais.', relatedTerms: ['divisao', 'playoffs'] },
  { id: 'g5', term: 'Divisão', slug: 'divisao', category: 'competition', difficulty: 'beginner', shortDefinition: 'Cada conferência é dividida em 3 divisões com 5 times cada. São agrupamentos geográficos que definem alguns confrontos da temporada regular.', relatedTerms: ['conferencia'] },
  { id: 'g6', term: 'Draft', slug: 'draft', category: 'competition', difficulty: 'intermediate', shortDefinition: 'Evento anual onde os times selecionam jovens jogadores. Os piores times da temporada anterior escolhem primeiro, incentivando a paridade.', relatedTerms: ['lottery', 'calouro'] },
  { id: 'g7', term: 'Lottery', slug: 'lottery', category: 'competition', difficulty: 'intermediate', shortDefinition: 'Sorteio que define a ordem de escolha do Draft para os times que não se classificaram para os Playoffs. Evita que times percam de propósito.', relatedTerms: ['draft'] },
  { id: 'g8', term: 'Trade Deadline', slug: 'trade-deadline', category: 'competition', difficulty: 'intermediate', shortDefinition: 'Data limite para trocas de jogadores durante a temporada. Após essa data, os elencos ficam praticamente congelados até o fim da temporada.', relatedTerms: ['trade'] },
  { id: 'g9', term: 'Best of Seven', slug: 'best-of-seven', category: 'competition', difficulty: 'beginner', shortDefinition: 'Formato das séries dos Playoffs: ganha o time que vencer 4 jogos primeiro, podendo durar de 4 a 7 jogos.', relatedTerms: ['playoffs'] },

  // === POSITIONS ===
  { id: 'g10', term: 'Armador (PG)', slug: 'armador', category: 'positions', difficulty: 'beginner', shortDefinition: 'Point Guard — o "cérebro" do time. Organiza as jogadas, distribui a bola e geralmente é o menor e mais rápido jogador da equipe.', relatedTerms: ['ala-armador', 'base'] },
  { id: 'g11', term: 'Ala-Armador (SG)', slug: 'ala-armador', category: 'positions', difficulty: 'beginner', shortDefinition: 'Shooting Guard — focado em pontuação. Normalmente é um bom arremessador de longa distância e pontuador versátil.', relatedTerms: ['armador', 'ala'] },
  { id: 'g12', term: 'Ala (SF)', slug: 'ala', category: 'positions', difficulty: 'beginner', shortDefinition: 'Small Forward — a posição mais versátil. Joga bem dos dois lados da quadra, combinando altura com habilidade de arremesso e drible.', relatedTerms: ['ala-armador', 'ala-pivo'] },
  { id: 'g13', term: 'Ala-Pivô (PF)', slug: 'ala-pivo', category: 'positions', difficulty: 'beginner', shortDefinition: 'Power Forward — joga perto do garrafão, pega rebotes e faz jogadas de força. Na NBA moderna, muitos também arremessam de 3 pontos.', relatedTerms: ['ala', 'pivo'] },
  { id: 'g14', term: 'Pivô (C)', slug: 'pivo', category: 'positions', difficulty: 'beginner', shortDefinition: 'Center — geralmente o mais alto do time. Domina o garrafão, bloqueia arremessos, pega rebotes e marca presença defensiva.', relatedTerms: ['ala-pivo'] },

  // === STATS ===
  { id: 'g15', term: 'Triplo-Duplo', slug: 'triplo-duplo', category: 'stats', difficulty: 'beginner', shortDefinition: 'Quando um jogador registra 10+ em três categorias estatísticas (ex: 10+ pontos, 10+ rebotes, 10+ assistências) em um único jogo.', relatedTerms: ['duplo-duplo'] },
  { id: 'g16', term: 'Duplo-Duplo', slug: 'duplo-duplo', category: 'stats', difficulty: 'beginner', shortDefinition: 'Quando um jogador registra 10+ em duas categorias estatísticas (ex: 20 pontos e 10 rebotes) em um único jogo.', relatedTerms: ['triplo-duplo'] },
  { id: 'g17', term: 'PER', slug: 'per', category: 'stats', difficulty: 'advanced', shortDefinition: 'Player Efficiency Rating — métrica que resume a contribuição total de um jogador em um único número. A média da liga é 15.', relatedTerms: ['true-shooting'] },
  { id: 'g18', term: 'True Shooting %', slug: 'true-shooting', category: 'stats', difficulty: 'advanced', shortDefinition: 'Mede a eficiência real de arremesso, levando em conta cestas de 2, 3 pontos e lances livres. Mais preciso que o FG% simples.', relatedTerms: ['per', 'usage-rate'] },
  { id: 'g19', term: 'Usage Rate', slug: 'usage-rate', category: 'stats', difficulty: 'advanced', shortDefinition: 'Porcentagem das posses de bola do time que terminam com uma ação do jogador (arremesso, lance livre ou turnover).', relatedTerms: ['true-shooting'] },

  // === PLAYS ===
  { id: 'g20', term: 'Pick and Roll', slug: 'pick-and-roll', category: 'plays', difficulty: 'intermediate', shortDefinition: 'Jogada onde um jogador faz um bloqueio (pick/screen) para o companheiro com a bola, depois rola em direção à cesta para receber o passe.', relatedTerms: ['screen', 'alley-oop'] },
  { id: 'g21', term: 'Alley-oop', slug: 'alley-oop', category: 'plays', difficulty: 'beginner', shortDefinition: 'Jogada espetacular onde um jogador joga a bola próxima à cesta e o companheiro finaliza com uma enterrada no ar.', relatedTerms: ['enterrada'] },
  { id: 'g22', term: 'Crossover', slug: 'crossover', category: 'plays', difficulty: 'beginner', shortDefinition: 'Movimento de drible onde o jogador troca a bola rapidamente de uma mão para outra, mudando de direção para passar pelo marcador.', relatedTerms: [] },

  // === RULES ===
  { id: 'g23', term: 'Falta Técnica', slug: 'falta-tecnica', category: 'rules', difficulty: 'beginner', shortDefinition: 'Penalidade por conduta antidesportiva (reclamar com o árbitro, provocar etc). Duas faltas técnicas no mesmo jogo resultam em expulsão.', relatedTerms: ['falta-flagrante'] },
  { id: 'g24', term: 'Violação de 24 Segundos', slug: 'shot-clock', category: 'rules', difficulty: 'beginner', shortDefinition: 'Cada time tem 24 segundos para fazer um arremesso que toque o aro. Se não conseguir, a posse passa para o adversário.', relatedTerms: [] },

  // === CULTURE ===
  { id: 'g25', term: 'Clutch', slug: 'clutch', category: 'culture', difficulty: 'beginner', shortDefinition: 'Quando um jogador faz jogadas decisivas nos momentos mais importantes do jogo, especialmente nos últimos minutos. "LeBron foi clutch no 4º quarto."', relatedTerms: [] },
  { id: 'g26', term: 'Franchise Player', slug: 'franchise-player', category: 'culture', difficulty: 'intermediate', shortDefinition: 'O jogador mais importante de um time, aquele que define a identidade e o futuro da franquia. Exemplo: Curry no Warriors.', relatedTerms: [] },
];
