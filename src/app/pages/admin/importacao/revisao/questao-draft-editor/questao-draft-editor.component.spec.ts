import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QuestaoDraftEditorComponent } from './questao-draft-editor.component';

describe('QuestaoDraftEditorComponent', () => {
  let component: QuestaoDraftEditorComponent;
  let fixture: ComponentFixture<QuestaoDraftEditorComponent>;
  let httpMock: HttpTestingController;

  function criarQuestionGroup(): FormGroup {
    const fb = new FormBuilder();
    return fb.group({
      id: ['q1'],
      number: [1],
      statement: ['Enunciado'],
      annulled: [false],
      correctAlternativeLabel: ['A'],
      sourcePageNumber: [1],
      needsReview: [false],
      alternatives: fb.array([
        fb.group({ label: ['A'], text: ['Alternativa A'] }),
        fb.group({ label: ['B'], text: ['Alternativa B'] }),
      ]),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestaoDraftEditorComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestaoDraftEditorComponent);
    component = fixture.componentInstance;
    component.questionGroup = criarQuestionGroup();
    component.images = [];
    component.jobId = 'job-1';
    fixture.detectChanges();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adicionarAlternativa adiciona uma nova alternativa com a próxima letra livre', () => {
    component.adicionarAlternativa();
    expect(component.alternativeGroups.length).toBe(3);
    expect(component.alternativeGroups[2].get('label')?.value).toBe('C');
  });

  it('removerAlternativa remove a alternativa no índice informado', () => {
    component.removerAlternativa(0);
    expect(component.alternativeGroups.length).toBe(1);
    expect(component.alternativeGroups[0].get('label')?.value).toBe('B');
  });

  it('removerQuestao emite o evento remover', () => {
    let emitido = false;
    component.remover.subscribe(() => (emitido = true));
    component.removerQuestao();
    expect(emitido).toBeTrue();
  });
});
