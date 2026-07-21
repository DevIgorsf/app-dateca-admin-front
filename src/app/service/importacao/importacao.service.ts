import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ExamDraftReviewView,
  ImportJobStatusView,
  PublishResult,
  TERMINAL_STATUSES,
  UpdateExamDraftCommand,
  UploadImportResult,
} from 'src/app/interfaces/importacao';

const API = environment.ApiUrl;
const POLL_INTERVAL_MS = 2000;

@Injectable({ providedIn: 'root' })
export class ImportacaoService {

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<UploadImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadImportResult>(`${API}/importacao/provas`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getStatus(jobId: string): Observable<ImportJobStatusView> {
    return this.http.get<ImportJobStatusView>(`${API}/importacao/provas/${jobId}`);
  }

  /**
   * Faz polling do status até um estado terminal (AGUARDANDO_REVISAO, PUBLICADO, ERRO ou
   * CANCELADO). Os componentes só dependem deste Observable — trocar para push via WebSocket
   * no futuro é reimplementar só este método, sem tocar em quem o consome.
   */
  pollStatus(jobId: string): Observable<ImportJobStatusView> {
    return interval(POLL_INTERVAL_MS).pipe(
      switchMap(() => this.getStatus(jobId)),
      takeWhile((status) => !TERMINAL_STATUSES.includes(status.status), true),
    );
  }

  getDraft(jobId: string): Observable<ExamDraftReviewView> {
    return this.http.get<ExamDraftReviewView>(`${API}/importacao/provas/${jobId}/rascunho`);
  }

  updateDraft(jobId: string, command: UpdateExamDraftCommand): Observable<ExamDraftReviewView> {
    return this.http.put<ExamDraftReviewView>(`${API}/importacao/provas/${jobId}/rascunho`, command);
  }

  publish(jobId: string): Observable<PublishResult> {
    return this.http.post<PublishResult>(`${API}/importacao/provas/${jobId}/publicar`, {});
  }

  cancel(jobId: string): Observable<void> {
    return this.http.delete<void>(`${API}/importacao/provas/${jobId}`);
  }

  /**
   * As imagens do rascunho ficam atrás de autenticação, então não podem ser usadas direto num
   * `<img src>` (o navegador não envia o header Authorization nesse tipo de requisição). O
   * componente busca o blob via HttpClient (que passa pelo interceptor de auth) e cria um
   * object URL local para exibir.
   */
  getDraftImageBlob(jobId: string, imageId: string): Observable<Blob> {
    return this.http.get(`${API}/importacao/provas/${jobId}/rascunho/imagens/${imageId}`, { responseType: 'blob' });
  }
}
