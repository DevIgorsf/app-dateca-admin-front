import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ImportacaoService } from './importacao.service';

describe('ImportacaoService', () => {
  let service: ImportacaoService;
  let httpMock: HttpTestingController;
  const API = environment.ApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ImportacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('upload envia o arquivo como multipart/form-data via POST', () => {
    const file = new File(['conteudo'], 'prova.pdf', { type: 'application/pdf' });

    service.upload(file).subscribe();

    const req = httpMock.expectOne(`${API}/importacao/provas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({ importJobId: 'abc', status: 'PENDENTE' });
  });

  it('getStatus faz GET no endpoint de status', () => {
    service.getStatus('job-1').subscribe();
    const req = httpMock.expectOne(`${API}/importacao/provas/job-1`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 'job-1', status: 'PENDENTE', currentStep: null, errorMessage: null,
      publishedExamId: null, createdAt: '', updatedAt: '',
    });
  });

  it('getDraft faz GET no endpoint de rascunho', () => {
    service.getDraft('job-1').subscribe();
    const req = httpMock.expectOne(`${API}/importacao/provas/job-1/rascunho`);
    expect(req.request.method).toBe('GET');
    req.flush({
      importJobId: 'job-1', title: null, institution: null, year: null,
      edition: null, subjectArea: null, questions: [],
    });
  });

  it('updateDraft faz PUT com o comando informado', () => {
    const command = { title: 'Prova', institution: null, year: null, edition: null, subjectArea: null, questions: [] };

    service.updateDraft('job-1', command).subscribe();

    const req = httpMock.expectOne(`${API}/importacao/provas/job-1/rascunho`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(command);
    req.flush({ importJobId: 'job-1', ...command });
  });

  it('publish faz POST no endpoint de publicacao', () => {
    service.publish('job-1').subscribe();
    const req = httpMock.expectOne(`${API}/importacao/provas/job-1/publicar`);
    expect(req.request.method).toBe('POST');
    req.flush({ examId: 'exam-1' });
  });

  it('cancel faz DELETE no job', () => {
    service.cancel('job-1').subscribe();
    const req = httpMock.expectOne(`${API}/importacao/provas/job-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('getDraftImageBlob busca a imagem como blob', () => {
    service.getDraftImageBlob('job-1', 'img-1').subscribe();
    const req = httpMock.expectOne(`${API}/importacao/provas/job-1/rascunho/imagens/img-1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });
});
