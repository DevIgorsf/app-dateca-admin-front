import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImportacaoService } from 'src/app/service/importacao/importacao.service';

type UploadFase = 'ocioso' | 'enviando' | 'processando' | 'erro';

const TAMANHO_MAXIMO_BYTES = 20 * 1024 * 1024;

@Component({
  selector: 'app-importacao-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './importacao-upload.component.html',
  styleUrls: ['./importacao-upload.component.scss'],
})
export class ImportacaoUploadComponent {
  private readonly importacaoService = inject(ImportacaoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly fase = signal<UploadFase>('ocioso');
  readonly arquivoNome = signal<string | null>(null);
  readonly progresso = signal(0);
  readonly etapaAtual = signal<string | null>(null);
  readonly erro = signal<string | null>(null);
  readonly arrastando = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastando.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.arrastando.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastando.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.iniciarUpload(file);
    }
  }

  onFileSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.iniciarUpload(file);
    }
    input.value = '';
  }

  tentarNovamente(): void {
    this.fase.set('ocioso');
    this.erro.set(null);
    this.arquivoNome.set(null);
    this.progresso.set(0);
    this.etapaAtual.set(null);
  }

  private iniciarUpload(file: File): void {
    const erroValidacao = this.validarArquivo(file);
    if (erroValidacao) {
      this.erro.set(erroValidacao);
      this.fase.set('erro');
      return;
    }

    this.erro.set(null);
    this.arquivoNome.set(file.name);
    this.fase.set('enviando');
    this.progresso.set(0);

    this.importacaoService.upload(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progresso.set(Math.round((100 * event.loaded) / event.total));
          } else if (event.type === HttpEventType.Response && event.body) {
            this.fase.set('processando');
            this.acompanharProcessamento(event.body.importJobId);
          }
        },
        error: () => {
          this.erro.set('Não foi possível enviar o arquivo. Tente novamente.');
          this.fase.set('erro');
        },
      });
  }

  private validarArquivo(file: File): string | null {
    const pareceSerPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!pareceSerPdf) {
      return 'Envie um arquivo PDF.';
    }
    if (file.size > TAMANHO_MAXIMO_BYTES) {
      return 'O arquivo excede o tamanho máximo de 20MB.';
    }
    return null;
  }

  private acompanharProcessamento(jobId: string): void {
    this.importacaoService.pollStatus(jobId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (status) => {
          this.etapaAtual.set(status.currentStep);
          if (status.status === 'AGUARDANDO_REVISAO') {
            this.router.navigate(['/admin/importacao', jobId, 'revisao']);
          } else if (status.status === 'ERRO' || status.status === 'CANCELADO') {
            this.erro.set(status.errorMessage ?? 'Falha ao processar a prova.');
            this.fase.set('erro');
          }
        },
        error: () => {
          this.erro.set('Não foi possível consultar o status da importação.');
          this.fase.set('erro');
        },
      });
  }
}
