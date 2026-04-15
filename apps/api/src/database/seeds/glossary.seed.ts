// ============================================================
// Na Quadra — Database Seed: Glossary (MongoDB)
// Complete NBA glossary in Portuguese
// ============================================================

export interface GlossarySeedEntry {
  slug: string;
  term: string;
  shortDefinition: string;
  fullDefinition?: string;
  category: 'plays' | 'positions' | 'stats' | 'rules' | 'culture' | 'competition';
  relatedTerms: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const GLOSSARY_SEED: GlossarySeedEntry[] = [
  // ── Positions ──
  { slug: 'armador', term: 'Armador (PG)', shortDefinition: 'Point Guard — o cérebro da equipe. Organiza as jogadas, distribui a bola e controla o ritmo do jogo.', category: 'positions', difficulty: 'beginner', relatedTerms: ['ala-armador', 'playmaker'] },
  { slug: 'ala-armador', term: 'Ala-Armador (SG)', shortDefinition: 'Shooting Guard — focado em pontuação. Normalmente é um bom arremessador de longa distância e pontuador versátil.', category: 'positions', difficulty: 'beginner', relatedTerms: ['armador', 'ala'] },
  { slug: 'ala', term: 'Ala (SF)', shortDefinition: 'Small Forward — a posição mais versátil. Joga bem dos dois lados da quadra, combinando altura com habilidade de arremesso e drible.', category: 'positions', difficulty: 'beginner', relatedTerms: ['ala-armador', 'ala-pivo'] },
  { slug: 'ala-pivo', term: 'Ala-Pivô (PF)', shortDefinition: 'Power Forward — joga perto do garrafão, pega rebotes e faz jogadas de força. Na NBA moderna, muitos também arremessam de 3 pontos.', category: 'positions', difficulty: 'beginner', relatedTerms: ['ala', 'pivo'] },
  { slug: 'pivo', term: 'Pivô (C)', shortDefinition: 'Center — o jogador mais alto, ancora a defesa, protege o aro e domina o garrafão. Pilar defensivo da equipe.', category: 'positions', difficulty: 'beginner', relatedTerms: ['ala-pivo', 'rim-protector'] },

  // ── Stats ──
  { slug: 'ppg', term: 'PPG (Pontos por Jogo)', shortDefinition: 'Points Per Game — média de pontos que um jogador marca por partida. Uma das estatísticas mais citadas no basquete.', category: 'stats', difficulty: 'beginner', relatedTerms: ['rpg', 'apg', 'eficiencia'] },
  { slug: 'rpg', term: 'RPG (Rebotes por Jogo)', shortDefinition: 'Rebounds Per Game — média de rebotes (bolas recuperadas após arremessos errados) por partida.', category: 'stats', difficulty: 'beginner', relatedTerms: ['ppg', 'rebote-ofensivo', 'rebote-defensivo'] },
  { slug: 'apg', term: 'APG (Assistências por Jogo)', shortDefinition: 'Assists Per Game — média de passes que resultam diretamente em cestas. Indica visão de jogo e capacidade de distribuição.', category: 'stats', difficulty: 'beginner', relatedTerms: ['ppg', 'playmaker'] },
  { slug: 'per', term: 'PER (Player Efficiency Rating)', shortDefinition: 'Índice que resume a produtividade de um jogador em um único número. Média da liga é 15.0.', category: 'stats', difficulty: 'advanced', relatedTerms: ['ppg', 'eficiencia', 'true-shooting'] },
  { slug: 'true-shooting', term: 'True Shooting % (TS%)', shortDefinition: 'Percentual que mede eficiência real de pontuação, considerando arremessos de 2, 3 pontos e lances livres.', category: 'stats', difficulty: 'advanced', relatedTerms: ['per', 'eficiencia', 'fg-pct'] },
  { slug: 'fg-pct', term: 'FG% (Field Goal %)', shortDefinition: 'Percentual de arremessos convertidos — cestas feitas divididas por tentativas. Não diferencia 2 e 3 pontos.', category: 'stats', difficulty: 'beginner', relatedTerms: ['true-shooting', 'three-pct'] },
  { slug: 'three-pct', term: '3P% (Three Point %)', shortDefinition: 'Percentual de acerto de arremessos de 3 pontos. Crucial na NBA moderna, onde o jogo é cada vez mais "perimetral".', category: 'stats', difficulty: 'beginner', relatedTerms: ['fg-pct', 'spacing'] },
  { slug: 'double-double', term: 'Double-Double', shortDefinition: 'Quando um jogador atinge dois dígitos (10+) em duas categorias diferentes na mesma partida (ex: 20 pts + 10 reb).', category: 'stats', difficulty: 'beginner', relatedTerms: ['triple-double', 'ppg', 'rpg'] },
  { slug: 'triple-double', term: 'Triple-Double', shortDefinition: 'Quando um jogador atinge dígitos duplos (10+) em três categorias. Feito raro que mostra versatilidade absoluta.', category: 'stats', difficulty: 'intermediate', relatedTerms: ['double-double', 'quadruple-double'] },

  // ── Competition ──
  { slug: 'temporada-regular', term: 'Temporada Regular', shortDefinition: 'Fase principal da NBA com 82 jogos por time (outubro a abril). Os melhores se classificam para os Playoffs.', category: 'competition', difficulty: 'beginner', relatedTerms: ['playoffs', 'play-in'] },
  { slug: 'playoffs', term: 'Playoffs', shortDefinition: 'Pós-temporada eliminatória com 16 times. Séries melhor-de-7 jogos até as Finais da NBA. Onde lendas são feitas.', category: 'competition', difficulty: 'beginner', relatedTerms: ['temporada-regular', 'play-in', 'finals'] },
  { slug: 'play-in', term: 'Play-In Tournament', shortDefinition: 'Torneio entre times classificados entre 7º e 10º lugar para disputar as duas últimas vagas dos Playoffs de cada conferência.', category: 'competition', difficulty: 'intermediate', relatedTerms: ['playoffs', 'temporada-regular'] },
  { slug: 'finals', term: 'Finals (Finais da NBA)', shortDefinition: 'A grande final. O campeão do Leste enfrenta o campeão do Oeste em uma série melhor-de-7 pelo título da NBA.', category: 'competition', difficulty: 'beginner', relatedTerms: ['playoffs', 'mvp-finals'] },
  { slug: 'draft', term: 'Draft', shortDefinition: 'Seleção anual de novos jogadores (geralmente universitários). Times escolhem em ordem inversa ao recorde da temporada anterior.', category: 'competition', difficulty: 'intermediate', relatedTerms: ['lottery', 'pick', 'bust'] },
  { slug: 'all-star', term: 'All-Star Game', shortDefinition: 'Jogo de exibição dos melhores 24 jogadores, realizado em fevereiro. Inclui competições de enterradas e arremessos de 3.', category: 'competition', difficulty: 'beginner', relatedTerms: ['mvp', 'all-nba'] },
  { slug: 'mvp', term: 'MVP (Most Valuable Player)', shortDefinition: 'Prêmio para o jogador mais valioso da temporada regular. O reconhecimento individual mais prestigiado na NBA.', category: 'competition', difficulty: 'beginner', relatedTerms: ['all-star', 'all-nba', 'dpoy'] },

  // ── Plays ──
  { slug: 'pick-and-roll', term: 'Pick-and-Roll', shortDefinition: 'Jogada básica: um jogador faz um bloqueio (pick/screen) para o armador e depois corta em direção à cesta (roll). A jogada mais executada na NBA.', category: 'plays', difficulty: 'intermediate', relatedTerms: ['screen', 'alley-oop'] },
  { slug: 'alley-oop', term: 'Alley-Oop', shortDefinition: 'Passe alto para um jogador que pega a bola no ar e enterra direto na cesta. Espetacular e eletrizante.', category: 'plays', difficulty: 'beginner', relatedTerms: ['enterrada', 'pick-and-roll'] },
  { slug: 'fast-break', term: 'Fast Break (Contra-ataque)', shortDefinition: 'Ataque rápido em transição, aproveitando a defesa adversária desorganizada. Velocidade é a arma.', category: 'plays', difficulty: 'beginner', relatedTerms: ['cherry-picking'] },
  { slug: 'iso', term: 'Isolamento (ISO)', shortDefinition: 'Jogada onde um atacante joga 1 contra 1, sem bloqueios. Usado por estrelas dominantes para criar suas próprias oportunidades.', category: 'plays', difficulty: 'intermediate', relatedTerms: ['mismatch', 'pull-up'] },
  { slug: 'spacing', term: 'Spacing', shortDefinition: 'Conceito tático: espalhar os jogadores pela quadra para criar espaço. Essencial na NBA moderna baseada em arremessos de 3.', category: 'plays', difficulty: 'intermediate', relatedTerms: ['three-pct', 'stretch-five'] },

  // ── Rules ──
  { slug: 'falta-pessoal', term: 'Falta Pessoal', shortDefinition: 'Contato ilegal com o adversário. Cada jogador pode cometer 6 antes de ser expulso. Times acumulam faltas por período.', category: 'rules', difficulty: 'beginner', relatedTerms: ['falta-tecnica', 'lance-livre'] },
  { slug: 'falta-tecnica', term: 'Falta Técnica', shortDefinition: 'Punição por conduta antidesportiva (reclamar, gestos, atrasar jogo). 2 técnicas = expulsão automática.', category: 'rules', difficulty: 'intermediate', relatedTerms: ['falta-pessoal', 'falta-flagrante'] },
  { slug: 'shot-clock', term: 'Shot Clock (Relógio de Posse)', shortDefinition: 'Cada time tem 24 segundos para arremessar. Reseta a 14 segundos em rebotes ofensivos. Garante ritmo ao jogo.', category: 'rules', difficulty: 'beginner', relatedTerms: ['violacao', 'posse-de-bola'] },
  { slug: 'travelling', term: 'Travelling (Andou)', shortDefinition: 'Violação cometida quando o jogador se move com a bola sem driblá-la. Resulta em troca de posse.', category: 'rules', difficulty: 'beginner', relatedTerms: ['double-dribble', 'violacao'] },

  // ── Culture ──
  { slug: 'goat', term: 'GOAT (Greatest of All Time)', shortDefinition: 'O maior de todos os tempos. Debate eterno entre LeBron James e Michael Jordan, com menções a Kareem, Magic e outros.', category: 'culture', difficulty: 'beginner', relatedTerms: ['mvp', 'dynasty'] },
  { slug: 'dynasty', term: 'Dynasty (Dinastia)', shortDefinition: 'Time que domina a liga por vários anos consecutivos. Exemplos: Jordan\'s Bulls, Curry\'s Warriors, Magic\'s Lakers.', category: 'culture', difficulty: 'intermediate', relatedTerms: ['goat', 'superteam'] },
  { slug: 'sixth-man', term: 'Sixth Man (Sexto Homem)', shortDefinition: 'O melhor jogador do banco de reservas. Primeiro a entrar e traz energia imediata. Tem prêmio próprio: 6MOTY.', category: 'culture', difficulty: 'intermediate', relatedTerms: ['banco-de-reservas', 'rotacao'] },
  { slug: 'clutch', term: 'Clutch', shortDefinition: 'Jogador ou momento decisivo nos últimos minutos. "Clutch player" = jogador que brilha sob pressão máxima.', category: 'culture', difficulty: 'beginner', relatedTerms: ['game-winner', 'buzzer-beater'] },
  { slug: 'buzzer-beater', term: 'Buzzer Beater', shortDefinition: 'Arremesso que entra na cesta exatamente quando o tempo se esgota (buzina toca). Momentos icônicos da história do basquete.', category: 'culture', difficulty: 'beginner', relatedTerms: ['clutch', 'game-winner'] },
];
