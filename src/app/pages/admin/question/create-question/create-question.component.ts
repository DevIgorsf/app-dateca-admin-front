import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionMultipleChoiceWithImage } from 'src/app/interfaces/QuestionMultipleChoiceWithImage';
import { Course } from 'src/app/interfaces/course';
import { PointsEnum } from 'src/app/interfaces/pointsEnum';
import { CourseService } from 'src/app/service/course/course.service';
import { QuestionService } from 'src/app/service/question/question.service';

@Component({
    selector: 'app-create-question',
    templateUrl: './create-question.component.html',
    styleUrls: ['./create-question.component.scss'],
    standalone: false
})
export class CreateQuestionComponent implements OnInit {
  points!: string[];
  coursesSubscription: Subscription = new Subscription();
  courses!: Course[];
  name: string = '';
  file!: FileList;
  images: any[] = [];
  preview!: string;
  validado: boolean = false;

  formulario: FormGroup;
  
  @Input() items: any[] = [];
  slideIndex: number = 0;
  slideOffset: string = '0';

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
      images: [''],
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
    this.questionService.getQuestion(questionId).subscribe((question: QuestionMultipleChoiceWithImage) => {
      this.fillFormWithQuestionData(question);
      if(question.images) {
        this.images = question.images.map(response => {
          return 'data:image/jpeg;base64,' + response.imagem;
        });
      }
    });
  }

  fillFormWithQuestionData(question: QuestionMultipleChoiceWithImage) {
    this.formulario.patchValue({
      id: question.id,
      statement: question.statement,
      pointsEnum: question.pointsEnum,
      course: question.course.id,
      images: question.images,
      correctAnswer: question.correctAnswer,
      alternativeA: question.alternativeA,
      alternativeB: question.alternativeB,
      alternativeC: question.alternativeC,
      alternativeD: question.alternativeD,
      alternativeE: question.alternativeE,
    });
  }
  
  async createQuestion() {
    const newQuestion = this.formulario.value;

    if(this.formulario.valid) {
      if (this.file) {
        if(!newQuestion.id) {
          this.questionService.saveImages(this.file, newQuestion);
        }
        else {
          this.questionService.updateImages(this.file, newQuestion.id, newQuestion);
        }
      } else {
        if(!newQuestion.id) {
          await this.questionService.create(newQuestion);
        } else {
          await this.questionService.update(newQuestion.id, newQuestion);
        }
      }
    }

    this.router.navigate(['/admin/questao']);
  }

  cancelar() {
    this.router.navigate(['/admin/questao']);
  }

  habilitarBotao(): string {
    return this.formulario.valid ? 'form-button-adicionar' : 'form-button-cancelar';
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

  

  goToSlide(index: number): void {
    this.slideIndex = index;
  }
  prevSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
      this.updateSlideOffset();
    } else {
      this.slideIndex = this.images.length - 1;
      this.updateSlideOffset();
    }
  }

  nextSlide(): void {
    if (this.slideIndex < this.images.length - 1) {
      this.slideIndex++;
      this.updateSlideOffset();
    } else {
      this.slideIndex = 0;
      this.updateSlideOffset();
    }
  }

  updateSlideOffset(): void {
    this.slideOffset = `-${this.slideIndex * 100}%`;
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


}
