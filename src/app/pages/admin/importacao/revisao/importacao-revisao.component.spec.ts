import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ImportacaoRevisaoComponent } from './importacao-revisao.component';

describe('ImportacaoRevisaoComponent', () => {
  let component: ImportacaoRevisaoComponent;
  let fixture: ComponentFixture<ImportacaoRevisaoComponent>;
  let httpMock: HttpTestingController;
  const API = environment.ApiUrl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportacaoRevisaoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ jobId: 'job-1' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacaoRevisaoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${API}/importacao/provas/job-1/rascunho`);
    req.flush({
      importJobId: 'job-1',
      title: 'Prova Teste',
      institution: 'Instituição X',
      year: 2025,
      edition: 'Ed 1',
      subjectArea: 'Geral',
      questions: [
        {
          id: 'q1',
          number: 1,
          statement: 'Enunciado 1',
          annulled: false,
          correctAlternativeLabel: 'A',
          sourcePageNumber: 1,
          needsReview: false,
          alternatives: [
            { id: 'a1', label: 'A', text: 'Alternativa A' },
            { id: 'a2', label: 'B', text: 'Alternativa B' },
          ],
          images: [],
        },
      ],
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load the draft', () => {
    expect(component).toBeTruthy();
    expect(component.carregando()).toBeFalse();
    expect(component.questoesArray.length).toBe(1);
    expect(component.metadataForm.value.title).toBe('Prova Teste');
  });

  it('prontaParaPublicar é true quando toda questão tem enunciado e 2+ alternativas', () => {
    expect(component.prontaParaPublicar).toBeTrue();
  });

  it('prontaParaPublicar é false após remover todas as questões', () => {
    component.removerQuestao(0);
    expect(component.prontaParaPublicar).toBeFalse();
  });

  it('publicar não chama o backend quando o rascunho não está pronto', () => {
    component.removerQuestao(0);
    component.publicar();
    expect(component.publicando()).toBeFalse();
    httpMock.expectNone(`${API}/importacao/provas/job-1/rascunho`);
  });
});
