import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { ProvaAdminDetalhe, ProvaQuestaoAdmin, ProvaRankingItem } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';

type EstadoProva =
  | { status: 'carregando' }
  | { status: 'erro' }
  | { status: 'ok'; prova: ProvaAdminDetalhe };

// Metais atribuídos às três primeiras posições; do 4º em diante fica só o número.
const MEDALHAS: Record<number, string> = { 1: 'ouro', 2: 'prata', 3: 'bronze' };

@Component({
    selector: 'app-prova-detalhe',
    templateUrl: './prova-detalhe.component.html',
    styleUrls: ['./prova-detalhe.component.scss'],
    standalone: false
})
export class ProvaDetalheComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProvaService);
  private readonly toastr = inject(ToastrService);

  // Reage ao parâmetro da rota. O switchMap cancela automaticamente a
  // requisição anterior se o id mudar, evitando requisições duplicadas.
  private readonly estado = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap((id): Observable<EstadoProva> => {
        if (!id) {
          return of({ status: 'erro' });
        }
        return this.service.getDetalhe(id).pipe(
          map(prova => ({
            status: 'ok' as const,
            prova: {
              ...prova,
              questoes: prova.questoes
                ?? (prova as { questions?: ProvaQuestaoAdmin[] }).questions
                ?? [],
            },
          })),
          catchError(() => {
            this.toastr.error('Não foi possível carregar a prova.');
            return of<EstadoProva>({ status: 'erro' });
          }),
          startWith<EstadoProva>({ status: 'carregando' }),
        );
      }),
    ),
    { initialValue: { status: 'carregando' } as EstadoProva },
  );

  readonly carregando = computed(() => this.estado().status === 'carregando');
  readonly erro = computed(() => this.estado().status === 'erro');
  readonly prova = computed(() => {
    const estado = this.estado();
    return estado.status === 'ok' ? estado.prova : undefined;
  });

  // Ranking da prova, ordenado pelo total de acertos (definido no backend).
  // Reage ao mesmo id da rota; falha silenciosa devolve lista vazia para não
  // atrapalhar a exibição do restante do detalhe.
  private readonly rankingSignal = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap((id): Observable<ProvaRankingItem[]> => {
        if (!id) {
          return of<ProvaRankingItem[]>([]);
        }
        return this.service.getRanking(id).pipe(
          catchError(() => of<ProvaRankingItem[]>([])),
        );
      }),
    ),
    { initialValue: [] as ProvaRankingItem[] },
  );

  readonly ranking = computed(() => this.rankingSignal());

  statusClass(status: string): string {
    switch (status) {
      case 'Ativo': return 'status--ativo';
      case 'Agendado': return 'status--agendado';
      case 'Encerrado': return 'status--encerrado';
      default: return 'status--rascunho';
    }
  }

  visibilidadeLabel(visibilidade: string): string {
    switch (visibilidade) {
      case 'TODOS': return 'Todos';
      case 'AMIGOS': return 'Amigos';
      case 'GRUPO': return 'Grupo';
      default: return visibilidade;
    }
  }

  alternativas(questao: ProvaAdminDetalhe['questoes'][number]): { letra: string; texto: string }[] {
    return [
      { letra: 'A', texto: questao.alternativeA },
      { letra: 'B', texto: questao.alternativeB },
      { letra: 'C', texto: questao.alternativeC },
      { letra: 'D', texto: questao.alternativeD },
      { letra: 'E', texto: questao.alternativeE },
    ].filter(alt => alt.texto != null && alt.texto.trim() !== '');
  }

  ehCorreta(questao: ProvaAdminDetalhe['questoes'][number], letra: string): boolean {
    return questao.correctAnswer != null
      && questao.correctAnswer.toUpperCase() === letra.toUpperCase();
  }

  medalha(posicao: number): string | null {
    return MEDALHAS[posicao] ?? null;
  }

  iniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (!partes.length) {
      return '?';
    }
    const primeira = partes[0].charAt(0);
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
    return (primeira + ultima).toUpperCase();
  }
}
