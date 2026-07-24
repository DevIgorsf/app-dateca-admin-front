import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProvaAdminResumo } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-provas',
    templateUrl: './provas.component.html',
    styleUrls: ['./provas.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProvasComponent implements OnInit, OnDestroy {
  provas: ProvaAdminResumo[] = [];
  provasSubscription: Subscription = new Subscription;

  public dataSource!: MatTableDataSource<ProvaAdminResumo>;
  public displayedColumns: string[] = [
    'titulo', 'disciplina', 'dificuldade', 'status', 'visibilidade',
    'participantes', 'totalQuestoes', 'criadorNome', 'criadaEm', 'acoes'
  ];

  constructor(
    private service: ProvaService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.service.getAll();
    this.provasSubscription = this.service.provas$.subscribe(provas => {
      this.provas = provas;
      this.dataSource = new MatTableDataSource<ProvaAdminResumo>(provas);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.provasSubscription.unsubscribe();
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = valor.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
