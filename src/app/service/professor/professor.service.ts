import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Professor } from 'src/app/interfaces/professor';
import { BehaviorSubject, Observable } from 'rxjs';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private professorsSubject = new BehaviorSubject<Professor[]>([]);
  professors$ = this.professorsSubject.asObservable();

  constructor(
    private http: HttpClient,
    ) { }

  create(professor: Professor): void {
    this.http.post<Professor>(`${API}/professor`, professor).subscribe(novoProfessor => {
      let professorTemp: Professor[] = this.professorsSubject.getValue();
      professorTemp = [...professorTemp, novoProfessor];
      this.professorsSubject.next(professorTemp);
    });
  }

  update(id: string, professor: Professor):void {
    this.http.put<Professor>(`${API}/professor/${id}`, professor).subscribe(updateProfessor => {
      const professors = this.professorsSubject.getValue();
      const professorsResult = professors.map((t) => {
        if (t.id === updateProfessor.id) {
          return updateProfessor;
        }
        return t;
      });
      this.professorsSubject.next(professorsResult);
    });
  }

  getProfessor(id: number): Observable<any> {
    return this.http.get<Professor>(`${API}/professor/${id}`);
  }

  getPerfil(): Observable<Professor> {
    return this.http.get<Professor>(`${API}/professor/perfil`);
  }

  getAll(): void {
    this.http.get<Professor[]>(`${API}/professor`).subscribe(professors =>{
      this.professorsSubject.next(professors);
    })
  }

  deleteProfessor(professorId: number): void {
    this.http.delete<Professor>(`${API}/professor/${professorId}`).subscribe(() => {
      const professors = this.professorsSubject.getValue();
      const professorsResult = professors.filter(t => t.id !== professorId);
      this.professorsSubject.next(professorsResult);
    },
    (error) => {
      const professors = this.professorsSubject.getValue();
      const professorsResult = professors.filter(t => t.id !== professorId);
      this.professorsSubject.next(professorsResult);
    });
  }

  getProfessorData(): Observable<any> {
    return this.http.get(`${API}/professor/dados`);
  }

  getRanking(): Observable<any> {
    return this.http.get(`${API}/professor/ranking`);
  }

  updatePassword(newPassword: Professor) {
    this.http.post(`${API}/professor/updatePassword`, newPassword).subscribe(retorno => {
      console.log(retorno);
    });
  }
}
