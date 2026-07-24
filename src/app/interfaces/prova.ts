export type ProvaStatus = 'Rascunho' | 'Agendado' | 'Ativo' | 'Encerrado';
export type ProvaVisibilidade = 'TODOS' | 'AMIGOS' | 'GRUPO';

/** Itens de GET /prova/admin */
export interface ProvaAdminResumo {
  id: string;
  titulo: string;
  disciplina: string;
  dificuldade: string;
  status: ProvaStatus;
  publicada: boolean;
  visibilidade: ProvaVisibilidade;
  participantes: number;
  totalQuestoes: number;
  criadorId: string;
  criadorNome: string;
  dataAbertura: string | null;
  dataEncerramento: string | null;
  criadaEm: string;
}

export interface ProvaQuestaoAdmin {
  id: string;
  statement: string;
  alternativeA: string;
  alternativeB: string;
  alternativeC: string;
  alternativeD: string;
  alternativeE: string;
  correctAnswer: string | null;
  comment: string | null;
  ordem: number;
}

/** Retorno de GET /prova/admin/:id */
export interface ProvaAdminDetalhe {
  id: string;
  titulo: string;
  descricao: string | null;
  disciplina: string;
  dificuldade: string;
  capaUrl: string | null;
  status: ProvaStatus;
  publicada: boolean;
  visibilidade: ProvaVisibilidade;
  participantes: number;
  rankingDisponivel: boolean;
  dataAbertura: string | null;
  horaAbertura: string | null;
  dataEncerramento: string | null;
  maxParticipantes: number | null;
  criadorId: string;
  criadorNome: string;
  criadaEm: string;
  questoes: ProvaQuestaoAdmin[];
}
