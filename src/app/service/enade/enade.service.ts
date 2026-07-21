import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Enade } from 'src/app/interfaces/Enade';
import { EnadeDTO } from 'src/app/interfaces/EnadeDTO';
import { EnadePorcentagemDTO } from 'src/app/interfaces/EnadePorcentagemDTO';
import { EnadeWithImage } from 'src/app/interfaces/EnadeWithImage';
import { environment } from 'src/environments/environment';
import { isServicoIndisponivel, SERVICO_INDISPONIVEL_MENSAGEM } from 'src/app/service/http-error.util';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class EnadeService {
  private enadeSubject = new BehaviorSubject<EnadeDTO[]>([]);
  enade$ = this.enadeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getEnade(enadeId: number): Observable<EnadeWithImage> {
    return this.http.get<EnadeWithImage>(`${API}/enade/${enadeId}`);
  }

  getAllEnade(): void {
    this.http.get<EnadeDTO[]>(`${API}/enade`).subscribe(
      enades => {
        this.enadeSubject.next(enades);
      },
      error => {
        if (error.status === 404) {
          this.toastr.error("Erro 404: Nenhuma questão encontrada.");
        } else if (!isServicoIndisponivel(error)) {
          this.toastr.error("Erro inesperado:", error);
        }
      }
    );
  }

  deleteEnade(enadeId: number): void {
    this.http.delete<Enade>(`${API}/enade/${enadeId}`).subscribe(() => {
      const enades = this.enadeSubject.getValue();
      const enadesResult = enades.filter(t => t.id !== enadeId);
      this.enadeSubject.next(enadesResult);
    },
    (error) => {
      const enades = this.enadeSubject.getValue();
      const enadesResult = enades.filter(t => t.id !== enadeId);
      this.enadeSubject.next(enadesResult);
    });
  }

  saveImages(files: FileList, newEnade: EnadeWithImage | EnadeWithImage[]): void {
    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('imageFile', files[i]);
      }
    }

    if (Array.isArray(newEnade)) {
      newEnade.forEach(enade => {
        Object.keys(enade).forEach(key => {
          if(enade[key] != '') {
            formData.append(key, enade[key]);
          }
        });
      });
    } else {
      Object.keys(newEnade).forEach(key => {
        if(newEnade[key] != '') {
          formData.append(key, newEnade[key]);
        }
      });
    }

    this.http.post<EnadeWithImage>(`${API}/enade/imagens`, formData).pipe(
      tap(newEnade => {
        let enadeTemp: EnadeDTO[] = this.enadeSubject.getValue();
        enadeTemp = [...enadeTemp, newEnade];
        this.enadeSubject.next(enadeTemp);
        this.toastr.success('Questão criada com sucesso!');
      }),
      catchError(error => {
        if (isServicoIndisponivel(error)) {
          this.toastr.error(SERVICO_INDISPONIVEL_MENSAGEM);
        } else {
          this.toastr.error('Erro ao criar pergunta:', error);
        }
        return throwError(error);
      })
    ).subscribe();
  }

  updateImages(files: FileList, id:number, newEnade: EnadeWithImage | EnadeWithImage[]): void {
    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('imageFile', files[i]);
      }
    }

    if (Array.isArray(newEnade)) {
      newEnade.forEach(enade => {
        Object.keys(enade).forEach(key => {
          if(enade[key] != '') {
            formData.append(key, enade[key]);
          }
        });
      });
    } else {
      Object.keys(newEnade).forEach(key => {
        if(newEnade[key] != '') {
          formData.append(key, newEnade[key]);
        }
      });
    }

    this.http.put<EnadeWithImage>(`${API}/enade/imagens/${id}`, formData).pipe(
      tap(updateEnade => {
        const currentEnade = this.enadeSubject.getValue();
        const enadeResult = currentEnade.map(t => (t.id == updateEnade.id ? updateEnade : t));
        this.enadeSubject.next(enadeResult);
        this.toastr.success('Questão atualizada com sucesso!');
      }),
      catchError(error => {
        if (isServicoIndisponivel(error)) {
          this.toastr.error(SERVICO_INDISPONIVEL_MENSAGEM);
        } else {
          this.toastr.error('Erro ao criar pergunta:', error);
        }
        return throwError(error);
      })
    ).subscribe();
  }

  createEnade(enade: any): void {
    this.http.post<Enade>(`${API}/enade`, enade).pipe(
      tap(newEnade => {
        this.enadeSubject.next([...this.enadeSubject.getValue(), newEnade]);
        this.toastr.success('Questão criada com sucesso!');
      }),
      catchError(error => {
        if (!isServicoIndisponivel(error)) {
          this.toastr.error('Erro ao criar pergunta:', error);
        }
        return throwError(error);
      })
    ).subscribe();
  }

  update(id: string, enade: Enade): void {
    this.http.put<Enade>(`${API}/enade/${id}`, enade).pipe(
      tap(updateEnade => {
        const currentEnade = this.enadeSubject.getValue();
        const enadeResult = currentEnade.map(t => (t.id === updateEnade.id ? updateEnade : t));
        this.enadeSubject.next([...enadeResult]);
        this.toastr.success('Questão atualizada com sucesso!');
      }),
      catchError(error => {
        if (!isServicoIndisponivel(error)) {
          this.toastr.error('Erro na atualização da pergunta:', error);
        }
        return throwError(error);
      })
    ).subscribe();
  }

  getEnadeData(): Observable<any>  {
    return this.http.get(`${API}/enade/dados`);
  }

  getEnadePorcentagem(): Observable<EnadePorcentagemDTO> {
    return this.http.get<EnadePorcentagemDTO>(`${API}/enade/resultados`);
  }
}
