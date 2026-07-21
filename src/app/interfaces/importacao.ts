export type ImportStatus =
  | 'PENDENTE'
  | 'EXTRAINDO_TEXTO'
  | 'EXTRAINDO_IA'
  | 'AGUARDANDO_REVISAO'
  | 'PUBLICADO'
  | 'ERRO'
  | 'CANCELADO';

export const TERMINAL_STATUSES: ImportStatus[] = ['AGUARDANDO_REVISAO', 'PUBLICADO', 'ERRO', 'CANCELADO'];

export interface UploadImportResult {
  importJobId: string;
  status: ImportStatus;
}

export interface ImportJobStatusView {
  id: string;
  status: ImportStatus;
  currentStep: string | null;
  errorMessage: string | null;
  publishedExamId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AlternativeDraftView {
  id: string;
  label: string;
  text: string;
}

export interface QuestionImageView {
  id: string;
  contentType: string;
}

export interface QuestionDraftView {
  id: string;
  number: number | null;
  statement: string;
  annulled: boolean;
  correctAlternativeLabel: string | null;
  sourcePageNumber: number | null;
  needsReview: boolean;
  alternatives: AlternativeDraftView[];
  images: QuestionImageView[];
}

export interface ExamDraftReviewView {
  importJobId: string;
  title: string | null;
  institution: string | null;
  year: number | null;
  edition: string | null;
  subjectArea: string | null;
  questions: QuestionDraftView[];
}

export interface UpdateAlternativeDraftCommand {
  label: string;
  text: string;
}

export interface UpdateQuestionDraftCommand {
  number: number | null;
  statement: string;
  annulled: boolean;
  correctAlternativeLabel: string | null;
  sourcePageNumber: number | null;
  alternatives: UpdateAlternativeDraftCommand[];
}

export interface UpdateExamDraftCommand {
  title: string;
  institution: string | null;
  year: number | null;
  edition: string | null;
  subjectArea: string | null;
  questions: UpdateQuestionDraftCommand[];
}

export interface PublishResult {
  examId: string;
}
