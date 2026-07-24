import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProvaAdminDetalhe } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';

@Component({
    selector: 'app-prova-detalhe',
    templateUrl: './prova-detalhe.component.html',
    styleUrls: ['./prova-detalhe.component.scss'],
    standalone: false
})
export class ProvaDetalheComponent implements OnInit {
  prova?: ProvaAdminDetalhe;
  carregando = true;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private service: ProvaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.service.getDetalhe(id).subscribe({
      next: prova => {
        this.prova = prova;
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
        this.toastr.error('Não foi possível carregar a prova.');
      }
    });
  }

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
}
