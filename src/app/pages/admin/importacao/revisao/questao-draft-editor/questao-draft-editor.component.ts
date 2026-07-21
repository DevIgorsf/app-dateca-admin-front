import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { QuestionImageView } from 'src/app/interfaces/importacao';
import { ImportacaoService } from 'src/app/service/importacao/importacao.service';

const PROXIMAS_LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface ImagemCarregada {
  id: string;
  url: string;
}

@Component({
  selector: 'app-questao-draft-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './questao-draft-editor.component.html',
  styleUrls: ['./questao-draft-editor.component.scss'],
})
export class QuestaoDraftEditorComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) questionGroup!: FormGroup;
  @Input() images: QuestionImageView[] = [];
  @Input({ required: true }) jobId!: string;
  @Input() indice = 0;
  @Output() remover = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly importacaoService = inject(ImportacaoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly imagensCarregadas = signal<ImagemCarregada[]>([]);
  private objectUrls: string[] = [];

  get alternatives(): FormArray {
    return this.questionGroup.get('alternatives') as FormArray;
  }

  get alternativeGroups(): FormGroup[] {
    return this.alternatives.controls as FormGroup[];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.carregarImagens();
    }
  }

  ngOnDestroy(): void {
    this.liberarObjectUrls();
  }

  adicionarAlternativa(): void {
    const usadas = this.alternativeGroups.map((grupo) => grupo.get('label')?.value);
    const proximaLetra = PROXIMAS_LETRAS.find((letra) => !usadas.includes(letra)) ?? '';
    this.alternatives.push(this.fb.group({
      label: [proximaLetra, Validators.required],
      text: ['', Validators.required],
    }));
  }

  removerAlternativa(index: number): void {
    this.alternatives.removeAt(index);
  }

  removerQuestao(): void {
    this.remover.emit();
  }

  private carregarImagens(): void {
    this.liberarObjectUrls();
    this.imagensCarregadas.set([]);

    for (const image of this.images) {
      this.importacaoService.getDraftImageBlob(this.jobId, image.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((blob) => {
          const url = URL.createObjectURL(blob);
          this.objectUrls.push(url);
          this.imagensCarregadas.update((atual) => [...atual, { id: image.id, url }]);
        });
    }
  }

  private liberarObjectUrls(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls = [];
  }
}
