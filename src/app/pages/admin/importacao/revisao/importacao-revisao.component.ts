import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImportacaoService } from 'src/app/service/importacao/importacao.service';
import {
  AlternativeDraftView,
  ExamDraftReviewView,
  QuestionDraftView,
  QuestionImageView,
  UpdateExamDraftCommand,
} from 'src/app/interfaces/importacao';
import { QuestaoDraftEditorComponent } from './questao-draft-editor/questao-draft-editor.component';

@Component({
  selector: 'app-importacao-revisao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    QuestaoDraftEditorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './importacao-revisao.component.html',
  styleUrls: ['./importacao-revisao.component.scss'],
})
export class ImportacaoRevisaoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly importacaoService = inject(ImportacaoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly carregando = signal(true);
  readonly salvando = signal(false);
  readonly publicando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly publicado = signal<string | null>(null);

  jobId!: string;
  metadataForm!: FormGroup;
  questoesForm!: FormArray;
  private imagensPorQuestao = new Map<string, QuestionImageView[]>();

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId')!;

    this.metadataForm = this.fb.group({
      title: ['', Validators.required],
      institution: [''],
      year: [null],
      edition: [''],
      subjectArea: [''],
    });
    this.questoesForm = this.fb.array([]);

    this.importacaoService.getDraft(this.jobId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (draft) => this.preencherFormulario(draft),
        error: () => {
          this.erro.set('Não foi possível carregar o rascunho desta importação.');
          this.carregando.set(false);
        },
      });
  }

  get questoesArray(): FormGroup[] {
    return this.questoesForm.controls as FormGroup[];
  }

  get prontaParaPublicar(): boolean {
    if (this.questoesArray.length === 0) {
      return false;
    }
    return this.questoesArray.every((questao) => {
      const alternatives = questao.get('alternatives') as FormArray;
      const enunciadoPreenchido = !!(questao.get('statement')?.value ?? '').trim();
      const alternativasValidas = alternatives.controls
        .filter((alternativa) => !!(alternativa.get('text')?.value ?? '').trim()).length >= 2;
      return enunciadoPreenchido && alternativasValidas;
    });
  }

  imagensDaQuestao(questionId: string): QuestionImageView[] {
    return this.imagensPorQuestao.get(questionId) ?? [];
  }

  removerQuestao(index: number): void {
    this.questoesForm.removeAt(index);
  }

  salvarRascunho(): void {
    this.salvando.set(true);
    this.erro.set(null);
    this.importacaoService.updateDraft(this.jobId, this.montarComando())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.salvando.set(false),
        error: () => {
          this.salvando.set(false);
          this.erro.set('Não foi possível salvar as alterações do rascunho.');
        },
      });
  }

  publicar(): void {
    if (!this.prontaParaPublicar) {
      return;
    }
    this.publicando.set(true);
    this.erro.set(null);

    this.importacaoService.updateDraft(this.jobId, this.montarComando())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.confirmarPublicacao(),
        error: () => {
          this.publicando.set(false);
          this.erro.set('Não foi possível salvar as alterações antes de publicar.');
        },
      });
  }

  voltarParaImportacao(): void {
    this.router.navigate(['/admin/importacao']);
  }

  private confirmarPublicacao(): void {
    this.importacaoService.publish(this.jobId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultado) => {
          this.publicando.set(false);
          this.publicado.set(resultado.examId);
        },
        error: () => {
          this.publicando.set(false);
          this.erro.set('Não foi possível publicar a prova.');
        },
      });
  }

  private preencherFormulario(draft: ExamDraftReviewView): void {
    this.metadataForm.patchValue({
      title: draft.title,
      institution: draft.institution,
      year: draft.year,
      edition: draft.edition,
      subjectArea: draft.subjectArea,
    });

    this.questoesForm.clear();
    this.imagensPorQuestao.clear();
    draft.questions.forEach((questao) => {
      this.imagensPorQuestao.set(questao.id, questao.images);
      this.questoesForm.push(this.criarQuestaoGroup(questao));
    });

    this.carregando.set(false);
  }

  private criarQuestaoGroup(questao: QuestionDraftView): FormGroup {
    return this.fb.group({
      id: [questao.id],
      number: [questao.number],
      statement: [questao.statement, Validators.required],
      annulled: [questao.annulled],
      correctAlternativeLabel: [questao.correctAlternativeLabel],
      sourcePageNumber: [questao.sourcePageNumber],
      needsReview: [questao.needsReview],
      alternatives: this.fb.array(questao.alternatives.map((alternativa) => this.criarAlternativaGroup(alternativa))),
    });
  }

  private criarAlternativaGroup(alternativa?: AlternativeDraftView): FormGroup {
    return this.fb.group({
      label: [alternativa?.label ?? '', Validators.required],
      text: [alternativa?.text ?? '', Validators.required],
    });
  }

  private montarComando(): UpdateExamDraftCommand {
    const metadata = this.metadataForm.value;
    return {
      title: metadata.title,
      institution: metadata.institution || null,
      year: metadata.year || null,
      edition: metadata.edition || null,
      subjectArea: metadata.subjectArea || null,
      questions: this.questoesArray.map((questao) => ({
        number: questao.get('number')?.value,
        statement: questao.get('statement')?.value,
        annulled: questao.get('annulled')?.value,
        correctAlternativeLabel: questao.get('annulled')?.value ? null : questao.get('correctAlternativeLabel')?.value,
        sourcePageNumber: questao.get('sourcePageNumber')?.value,
        alternatives: (questao.get('alternatives') as FormArray).controls.map((alternativa) => ({
          label: alternativa.get('label')?.value,
          text: alternativa.get('text')?.value,
        })),
      })),
    };
  }
}
