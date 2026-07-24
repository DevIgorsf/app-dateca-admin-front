import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from 'src/app/interfaces/student';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  students$ = this.studentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getAll(): void {
    this.http.get<Student[]>(`${API}/aluno`).subscribe(students => {
      this.studentsSubject.next(students);
    });
  }

  getStudentData(): Observable<any>  {
    return this.http.get(`${API}/aluno/dados`);
  }
}
