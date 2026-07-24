import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProvaAdminDetalhe, ProvaAdminResumo, ProvaRankingItem } from 'src/app/interfaces/prova';
import { environment } from 'src/environments/environment';
import { isServicoIndisponivel } from 'src/app/service/http-error.util';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProvaService {

  private provasSubject = new BehaviorSubject<ProvaAdminResumo[]>([]);
  provas$ = this.provasSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getAll(): void {
    this.http.get<ProvaAdminResumo[]>(`${API}/prova/admin`).subscribe(
      provas => {
        this.provasSubject.next(provas);
      },
      error => {
        if (!isServicoIndisponivel(error)) {
          this.toastr.error('Não foi possível carregar as provas.');
        }
      }
    );
  }

  getDetalhe(id: string): Observable<ProvaAdminDetalhe> {
    return this.http.get<ProvaAdminDetalhe>(`${API}/prova/admin/${id}`);
  }

  /** Ranking da prova ordenado pelo total de questões respondidas corretamente. */
  getRanking(id: string): Observable<ProvaRankingItem[]> {
    return this.http.get<ProvaRankingItem[]>(`${API}/prova/admin/${id}/ranking`);
  }
}
