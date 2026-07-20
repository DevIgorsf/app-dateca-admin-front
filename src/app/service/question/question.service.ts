import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { QuestionMultipleChoiceDTO } from 'src/app/interfaces/QuestionMultipleChoiceDTO';
import { QuestionMultipleChoiceWithImage } from 'src/app/interfaces/QuestionMultipleChoiceWithImage';
import { QuestionResultDTO } from 'src/app/interfaces/QuestionResultaDTO';
import { QuestionMultipleChoice } from 'src/app/interfaces/questionMultipleChoice';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsSubject = new BehaviorSubject<QuestionMultipleChoiceDTO[]>([]);
  questions$ = this.questionsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
    ) { }

  getQuestion(id: number): Observable<QuestionMultipleChoiceWithImage> {
    return this.http.get<QuestionMultipleChoiceWithImage>(`${API}/questao/${id}`);
  }

  getAll(): void {
    this.http.get<QuestionMultipleChoiceDTO[]>(`${API}/questao`).subscribe(
      questions => {
        this.questionsSubject.next(questions);
      },
      error => {
        if (error.status === 404) {
          this.toastr.error("Erro 404: Nenhuma questão encontrada.");
        } else {
          this.toastr.error("Erro inesperado:", error);
        }
      }
    );
  }

  create(question: any): void {
    this.http.post<QuestionMultipleChoiceDTO>(`${API}/questao`, question).pipe(
      tap(newQuestion => {
        this.questionsSubject.next([...this.questionsSubject.getValue(), newQuestion]);
      }),
      catchError(error => {
        console.error('Erro ao criar pergunta:', error);

        return throwError(error);
      })
    ).subscribe();
  }

  updateImages(files: FileList, id:number, newQuestion: QuestionMultipleChoiceWithImage | QuestionMultipleChoiceWithImage[]): void {
    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('imageFile', files[i]);
      }
    }

    if (Array.isArray(newQuestion)) {
      newQuestion.forEach(question => {
        Object.keys(question).forEach(key => {
          if(question[key] != '') {
            formData.append(key, question[key]);
          }
        });
      });
    } else {
      Object.keys(newQuestion).forEach(key => {
        if(newQuestion[key] != '') {
          formData.append(key, newQuestion[key]);
        }
      });
    }

    this.http.put<QuestionMultipleChoiceWithImage>(`${API}/questao/imagens/${id}`, formData).pipe(
      tap(updateQuestion => {
        const currentQuestion = this.questionsSubject.getValue();
        const questionResult = currentQuestion.map(t => (t.id == updateQuestion.id ? updateQuestion : t));
        this.questionsSubject.next(questionResult);
        this.toastr.success('Questão atualizada com sucesso!');
      }),
      catchError(error => {
        this.toastr.error('Erro ao criar pergunta:', error);
        return throwError(error);
      })
    ).subscribe();
  }

  update(id: string, question: QuestionMultipleChoice): void {
    this.http.put<QuestionMultipleChoiceDTO>(`${API}/questao/${id}`, question).pipe(
      tap(updateQuestion => {
        const currentQuestionList = this.questionsSubject.getValue();
        const updatedQuestions = currentQuestionList.map((t) => {
          if (t.id === updateQuestion.id) {
            return updateQuestion;
          }
          return t;
        });
        this.questionsSubject.next(updatedQuestions);
      }),
      catchError(error => {
        this.toastr.error(`Erro na atualização da pergunta: ${error.message}`);
        return throwError(error);
      })
    ).subscribe();
  }

  saveImages(files: FileList, newQuestion: QuestionMultipleChoiceWithImage | QuestionMultipleChoiceWithImage[]): void {
    const formData = new FormData();

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('imageFile', files[i]);
      }
    }

    if (Array.isArray(newQuestion)) {
      newQuestion.forEach(question => {
        Object.keys(question).forEach(key => {
          if(question[key] != '') {
            formData.append(key, question[key]);
          }
        });
      });
    } else {
      Object.keys(newQuestion).forEach(key => {
        if(newQuestion[key] != '') {
          formData.append(key, newQuestion[key]);
        }
      });
    }

    this.http.post<QuestionMultipleChoiceDTO>(`${API}/questao/imagens`, formData).subscribe(newQuestion => {
      let questionTemp: QuestionMultipleChoiceDTO[] = this.questionsSubject.getValue();
      questionTemp = [...questionTemp, newQuestion];
      this.questionsSubject.next(questionTemp);
    });
  }

  getQuestionData(): Observable<any>  {
    return this.http.get(`${API}/questao/dados`);
  }

  deleteQuestion(questionId: number): void {
    this.http.delete<QuestionMultipleChoice>(`${API}/questao/${questionId}`).subscribe(() => {
      const questions = this.questionsSubject.getValue();
      const questionsResult = questions.filter(t => t.id !== questionId);
      this.questionsSubject.next(questionsResult);
    },
    (error) => {
      const questions = this.questionsSubject.getValue();
      const questionsResult = questions.filter(t => t.id !== questionId);
      this.questionsSubject.next(questionsResult);
    });
  }

  getQuestionPorcentagem(): Observable<QuestionResultDTO> {
    return this.http.get<QuestionResultDTO>(`${API}/questao/resultados`);
  }
}
