// ============================================================
// Na Quadra — Database Seed: Articles (MongoDB)
// Sample articles seeded into MongoDB at startup
// ============================================================

export interface ArticleSeedData {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage: string | null;
  author: { id: string; name: string; avatar?: string };
  category: 'news' | 'analysis' | 'feature' | 'explainer';
  tags: string[];
  relatedTeams: string[];
  relatedPlayers: string[];
  source: 'editorial' | 'espn-ingested';
  status: 'published' | 'draft';
  publishedAt: Date;
  readTimeMinutes: number;
  glossaryTerms: string[];
}

export const ARTICLES_SEED: ArticleSeedData[] = [
  {
    slug: 'thunder-domina-conferencia-oeste-2026',
    title: 'Thunder domina corrida pela liderança no Oeste',
    subtitle: 'SGA mantém números de MVP e OKC se consolida como favorito',
    content: `O Oklahoma City Thunder vem consolidando uma temporada histórica na NBA 2025-26. Com Shai Gilgeous-Alexander liderando a equipe em média de 31.2 pontos por jogo, a franquia de Oklahoma City se posiciona como a principal favorita ao título no Oeste.

A combinação de SGA com Jalen Williams e Chet Holmgren tem sido devastadora para os adversários. O Thunder possui a melhor eficiência ofensiva da liga e uma das três melhores defesas, um equilíbrio que poucos times conseguem manter ao longo de 82 jogos.

O técnico Mark Daigneault tem recebido elogios pela forma como gerencia as rotações e mantém o time saudável para os Playoffs. Com uma campanha que pode ultrapassar 60 vitórias, o Thunder está redefinindo o padrão de excelência na conferência Oeste.`,
    coverImage: null,
    author: { id: 'editor-1', name: 'Na Quadra Editorial' },
    category: 'analysis',
    tags: ['Thunder', 'SGA', 'MVP', 'Oeste', 'Playoffs'],
    relatedTeams: ['okc'],
    relatedPlayers: ['shai-gilgeous-alexander'],
    source: 'editorial',
    status: 'published',
    publishedAt: new Date('2026-04-10T14:00:00Z'),
    readTimeMinutes: 4,
    glossaryTerms: ['ppg', 'mvp', 'playoffs'],
  },
  {
    slug: 'wembanyama-transformando-spurs-2026',
    title: 'Wembanyama está transformando o futuro dos Spurs',
    subtitle: 'O fenômeno francês lidera a liga em tocos pelo segundo ano consecutivo',
    content: `Victor Wembanyama, em sua segunda temporada na NBA, continua quebrando paradigmas sobre o que é possível para um jogador de 2,24m. O pivô francês lidera a liga em tocos com impressionantes 3.6 por jogo e já faz parte das conversas de All-NBA First Team.

Sua habilidade de arremessar de 3 pontos (35.1%) combinada com sua presença defensiva dominante faz dele um jogador único na história do basquete. Pop, em sua possível última temporada, tem o prazer de moldar o jogador que pode definir a próxima década da NBA.

Os Spurs, embora ainda em reconstrução, mostram sinais claros de que o futuro é brilhante. A base formada por Wembanyama, junto com as escolhas de draft acumuladas, posiciona San Antonio para uma nova era de competitividade.`,
    coverImage: null,
    author: { id: 'editor-1', name: 'Na Quadra Editorial' },
    category: 'feature',
    tags: ['Wembanyama', 'Spurs', 'Rookie', 'Draft', 'Defesa'],
    relatedTeams: ['sas'],
    relatedPlayers: ['victor-wembanyama'],
    source: 'editorial',
    status: 'published',
    publishedAt: new Date('2026-04-08T10:00:00Z'),
    readTimeMinutes: 5,
    glossaryTerms: ['pivo', 'three-pct', 'draft'],
  },
  {
    slug: 'celtics-buscam-bi-campeonato',
    title: 'Celtics em busca do bicampeonato: o que mudou',
    subtitle: 'Boston tem a melhor campanha do Leste e busca repetir 2024',
    content: `Os Boston Celtics continuam dominando a conferência Leste com uma campanha de 58-24. A dupla Jayson Tatum e Jaylen Brown mostra uma maturidade que só o título pode trazer, e o time de Joe Mazzulla joga um basquete altamente eficiente.

A adição de profundidade no banco de reservas tem sido crucial. Diferente da temporada do título, onde a dependência dos titulares era maior, este Celtics de 2025-26 tem uma rotação de 9 jogadores que podem contribuir em noites diferentes.

A pergunta que os Playoffs responderão: o Celtics tem a mesma "fome" de um time que já conquistou o troféu? A história da NBA mostra que repetir é significativamente mais difícil que conquistar o primeiro título.`,
    coverImage: null,
    author: { id: 'editor-1', name: 'Na Quadra Editorial' },
    category: 'analysis',
    tags: ['Celtics', 'Tatum', 'Brown', 'Leste', 'Playoffs', 'Título'],
    relatedTeams: ['bos'],
    relatedPlayers: ['jayson-tatum'],
    source: 'editorial',
    status: 'published',
    publishedAt: new Date('2026-04-12T08:00:00Z'),
    readTimeMinutes: 4,
    glossaryTerms: ['playoffs', 'sixth-man'],
  },
  {
    slug: 'guia-iniciante-posicoes-nba',
    title: 'Guia do Iniciante: As 5 posições do basquete',
    subtitle: 'Entenda cada posição e o que cada jogador faz em quadra',
    content: `Se você está começando a acompanhar a NBA, uma das primeiras coisas a entender são as 5 posições tradicionais do basquete. Embora a NBA moderna tenha borrado muitas dessas linhas, entender a base é fundamental.

**Armador (PG)**: O "maestro" da equipe. Controla o ritmo, distribui a bola e geralmente é o menor e mais rápido. Exemplos: Stephen Curry, SGA.

**Ala-Armador (SG)**: Focado em pontuação e arremessos de longa distância. Historicamente, Michael Jordan é o maior SG de todos os tempos.

**Ala (SF)**: A posição mais versátil. Precisa fazer de tudo: defender, pontuar, rebotear. LeBron James joga como SF.

**Ala-Pivô (PF)**: Força e rebotes. Na NBA atual, muitos PFs arremessam de 3 pontos, como Giannis Antetokounmpo.

**Pivô (C)**: O mais alto, ancora a defesa, protege o aro. Nikola Jokić revolucionou a posição com seu passe.`,
    coverImage: null,
    author: { id: 'editor-1', name: 'Na Quadra Editorial' },
    category: 'explainer',
    tags: ['Guia', 'Iniciante', 'Posições', 'Basquete'],
    relatedTeams: [],
    relatedPlayers: [],
    source: 'editorial',
    status: 'published',
    publishedAt: new Date('2026-04-05T12:00:00Z'),
    readTimeMinutes: 6,
    glossaryTerms: ['armador', 'ala-armador', 'ala', 'ala-pivo', 'pivo'],
  },
  {
    slug: 'jokic-triplice-coroa-estadisticas',
    title: 'Jokić caminha para a tríplice coroa estatística',
    subtitle: 'Sérvio pode se tornar o primeiro jogador desde 1962 a liderar em 3 categorias',
    content: `Nikola Jokić está tendo mais uma temporada absurda. O pivô do Denver Nuggets está entre os líderes da liga em pontos, rebotes e assistências simultaneamente — algo que não acontece desde Oscar Robertson em 1961-62.

Com médias de 26.5 pontos, 12.8 rebotes e 9.2 assistências, o sérvio continua redefinindo o que um pivô pode fazer na NBA. Seu QI de basquete, frequentemente comparado ao de Magic Johnson, permite que ele orquestre a ofensiva dos Nuggets de formas que nenhum outro big man consegue.

A eficiência é o que torna seus números ainda mais impressionantes. Com 57.9% de aproveitamento dos arremessos, Jokić não apenas produz volume — ele produz com qualidade absurda.`,
    coverImage: null,
    author: { id: 'editor-1', name: 'Na Quadra Editorial' },
    category: 'news',
    tags: ['Jokić', 'Nuggets', 'MVP', 'Triple-Double', 'Stats'],
    relatedTeams: ['den'],
    relatedPlayers: ['nikola-jokic'],
    source: 'editorial',
    status: 'published',
    publishedAt: new Date('2026-04-14T16:00:00Z'),
    readTimeMinutes: 4,
    glossaryTerms: ['triple-double', 'ppg', 'rpg', 'apg', 'fg-pct'],
  },
];
