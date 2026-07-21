import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/service/professor/professor.service';

/// A API devolve `{ student: { name, points } }`. A view trabalha com a linha
/// já achatada e com os dados de apresentação (posição, iniciais, cor) prontos,
/// para o template não precisar de lógica.
export interface RankingRow {
  position: number;
  name: string;
  points: number;
  initials: string;
  accent: string;
}

// Acentos dos tokens de tema usados nos avatares. A cor sai de um hash do nome
// para que o mesmo aluno mantenha a mesma cor entre carregamentos.
const AVATAR_ACCENTS = ['blue', 'violet', 'green', 'teal', 'amber', 'red'];

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RankingComponent implements OnInit {

  rows: RankingRow[] = [];

  /// As mesmas linhas do topo, na ordem visual do pódio: 2º, 1º, 3º.
  podium: RankingRow[] = [];

  loading = true;

  constructor(
    private service: ProfessorService,
  ) {}

  ngOnInit(): void {
    this.service.getRanking().subscribe({
      next: (response) => {
        this.rows = (response ?? []).map((item: any, index: number) => this.toRow(item, index + 1));
        this.podium = [this.rows[1], this.rows[0], this.rows[2]].filter((row) => !!row);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private toRow(item: any, position: number): RankingRow {
    const name: string = item?.student?.name ?? 'Aluno sem nome';

    return {
      position,
      name,
      points: item?.student?.points ?? 0,
      initials: this.initialsOf(name),
      accent: AVATAR_ACCENTS[this.hashOf(name) % AVATAR_ACCENTS.length],
    };
  }

  private initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return '?';
    }

    const first = parts[0].charAt(0);
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  private hashOf(value: string): number {
    let hash = 0;
    for (const char of value) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return hash;
  }

}
