import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { Course } from 'src/app/interfaces/course';
import { PointsEnum } from 'src/app/interfaces/pointsEnum';
import { Question } from 'src/app/interfaces/question';
import { QuestionMultipleChoice } from 'src/app/interfaces/questionMultipleChoice';
import { CourseService } from 'src/app/service/course/course.service';
import { QuestionService } from 'src/app/service/question/question.service';

//interface PointsEnum {
//  value: string;
//  description: string;
//}

type EnumKeys<T> = Extract<keyof T, string>;

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  points!: string[];
  coursesSubscription: Subscription = new Subscription();
  file!: FileList;
  images: any[] = [];
  preview!: string;
  courses!: Course[];
  name: string = '';
  validado: boolean = false;
  
  @Input() items: any[] = [];
  slideIndex: number = 0;
  slideOffset: string = '0';

  goToSlide(index: number): void {
    this.slideIndex = index;
  }
  prevSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
      this.updateSlideOffset();
    } else {
      // Se estiver na primeira imagem, volte para a última
      this.slideIndex = this.images.length - 1;
      this.updateSlideOffset();
    }
  }

  nextSlide(): void {
    if (this.slideIndex < this.images.length - 1) {
      this.slideIndex++;
      this.updateSlideOffset();
    } else {
      // Se estiver na última imagem, volte para a primeira
      this.slideIndex = 0;
      this.updateSlideOffset();
    }
  }

  updateSlideOffset(): void {
    this.slideOffset = `-${this.slideIndex * 100}%`;
  }

  formulario: FormGroup;

  constructor(
    private questionService: QuestionService,
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formulario = this.formBuilder.group({
      id: [''],
      statement: ['', Validators.required],
      pointsEnum: [''],
      course: [''],
      idImages: [''],
      correctAnswer: ['', Validators.required],
      alternativeA: ['', Validators.required],
      alternativeB: ['', Validators.required],
      alternativeC: ['', Validators.required],
      alternativeD: ['', Validators.required],
      alternativeE: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const questionId = params['id'];
      if (questionId) {
        this.loadQuestionToEdit(questionId);
      }
    });
    this.points = Object.values(PointsEnum);
    this.courseService.getCourseByProfessor();
    this.coursesSubscription = this.courseService.courses$.subscribe((courses) => {
      this.courses = courses;
    });
    
  }

  loadQuestionToEdit(questionId: number) {
    this.questionService.getQuestion(questionId).subscribe((question: QuestionMultipleChoice) => {
      this.fillFormWithQuestionData(question);
      if(question.idImages != null && question.idImages.length > 0) {
        const imageObservables = question.idImages.map(imageId => {
          return this.questionService.getImages(imageId);
        });
        forkJoin(imageObservables).subscribe(
          (responses: any[]) => {
            this.images = responses.map(response => {
              return 'data:image/jpeg;base64,' + response.imagem;
            });
          },
          error => {
            console.error('Erro ao carregar imagens:', error);
          }
        );
      }
    });
  }

  fillFormWithQuestionData(question: QuestionMultipleChoice) {
    this.formulario.patchValue({
      id: question.id,
      statement: question.statement,
      pointsEnum: question.pointsEnum,
      course: question.course.id,
      idImages: question.idImages,
      correctAnswer: question.correctAnswer,
      alternativeA: question.alternativeA,
      alternativeB: question.alternativeB,
      alternativeC: question.alternativeC,
      alternativeD: question.alternativeD,
      alternativeE: question.alternativeE,
    });
  }

  handleFile(event: any): void {
    this.file = event?.target?.files;
    if (this.file && this.file.length > 0) {
      this.images = [];
      for (let i = 0; i < this.file.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target?.result as string);
        };
        reader.readAsDataURL(this.file[i]);
      }
    } else {
      this.images = [];
    }
  }
  
  async createQuestion() {
    if (this.file && this.formulario.valid) {
      const newQuestion = this.formulario.value;
      this.questionService.saveImages(this.file, newQuestion);
      this.router.navigate(['/admin/questao']);
    } else {
        if (this.formulario.valid) {
          const newQuestion = this.formulario.value;
    
          console.log(newQuestion)
          if(!newQuestion.id) {
            this.questionService.create(newQuestion);
            this.router.navigate(['/admin/questao']);
          } else {
            await this.questionService.update(newQuestion.id, newQuestion);
            this.router.navigate(['/admin/questao']);
          }
        }
    }
  }

  cancelar() {
    this.router.navigate(['/admin/questao']);
  }

  habilitarBotao(): string {
    return this.formulario.valid ? 'botao-salvar' : 'botao-desabilitado';
  }

  campoValidado(campoAtual: string): string {
    const control = this.formulario.get(campoAtual);
    if (control?.errors && control?.touched) {
      this.validado = false;
      return 'form-item input-invalido';
    } else {
      this.validado = true;
      return 'form-item';
    }
  }

}
