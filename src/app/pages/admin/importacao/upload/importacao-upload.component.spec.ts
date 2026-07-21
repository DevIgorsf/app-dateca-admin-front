import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ImportacaoUploadComponent } from './importacao-upload.component';

describe('ImportacaoUploadComponent', () => {
  let component: ImportacaoUploadComponent;
  let fixture: ComponentFixture<ImportacaoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportacaoUploadComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacaoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('inicia na fase ociosa', () => {
    expect(component.fase()).toBe('ocioso');
  });

  it('rejeita arquivo que não é PDF', () => {
    const file = new File(['conteudo'], 'prova.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const dataTransfer = { files: [file] } as unknown as DataTransfer;

    component.onDrop({ preventDefault: () => {}, dataTransfer } as unknown as DragEvent);

    expect(component.fase()).toBe('erro');
    expect(component.erro()).toContain('PDF');
  });

  it('rejeita arquivo maior que 20MB', () => {
    const conteudoGrande = new Uint8Array(21 * 1024 * 1024);
    const file = new File([conteudoGrande], 'prova.pdf', { type: 'application/pdf' });
    const dataTransfer = { files: [file] } as unknown as DataTransfer;

    component.onDrop({ preventDefault: () => {}, dataTransfer } as unknown as DragEvent);

    expect(component.fase()).toBe('erro');
    expect(component.erro()).toContain('20MB');
  });

  it('tentarNovamente volta ao estado ocioso', () => {
    component.erro.set('algum erro');
    component.fase.set('erro');

    component.tentarNovamente();

    expect(component.fase()).toBe('ocioso');
    expect(component.erro()).toBeNull();
  });
});
