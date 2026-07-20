import { CourseService } from 'src/app/service/course/course.service';
import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import { QuestionService } from 'src/app/service/question/question.service';
import { EnadeService } from 'src/app/service/enade/enade.service';
import { StudentService } from 'src/app/service/student/student.service';
import { EnadePorcentagemDTO } from 'src/app/interfaces/EnadePorcentagemDTO';
import { QuestionResultDTO } from 'src/app/interfaces/QuestionResultaDTO';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  course: string = '0';
  professor: string = '0';
  question: string = '0';
  enade: string = '0';
  student: string = '0';
  enadePorcentagemDTO: EnadePorcentagemDTO = { questoesFeitas: 0, questoesCorrect: 0 };
  questionResultDTO: QuestionResultDTO = { questoesFeitas: 0, questoesCorrect: 0 };

  constructor(
    private courseService: CourseService,
    private professorService: ProfessorService,
    private questionService: QuestionService,
    private enadeService: EnadeService,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.courseService.getCourseData().subscribe(data => {
      this.course = data;
    })
    this.professorService.getProfessorData().subscribe(data => {
      this.professor = data;
    })
    this.questionService.getQuestionData().subscribe(data => {
      this.question = data;
    })
    this.enadeService.getEnadeData().subscribe(data => {
      this.enade = data;
    })
    this.enadeService.getEnadePorcentagem().subscribe(data => {
      this.enadePorcentagemDTO = data;
      this.updateChartEnade();
    })
    this.questionService.getQuestionPorcentagem().subscribe(data => {
      this.questionResultDTO = data;
      this.updateChartQuestion();
    })
    this.studentService.getStudentData().subscribe(data => {
      this.student = data;
    })
  }


  chartEnade = {
    title: {
      text: 'Questões Enade',
      color: '#fff'
    },
    backgroundColor: '#56585D',
    data: [
      {
        type: 'pie',
        indexLabelPlacement: "inside",
        indexLabel: "{label}: {y}",
        dataPoints: [
          { label: 'Acertos', y: 0, color: '#4CAF50'},
          { label: 'Erros', y: 0, color: '#F44336' }
        ],
      },
    ],
  };

  updateChartEnade() {
    if(this.enadePorcentagemDTO.questoesFeitas) {
      this.chartEnade = {
        title: {
          text: 'Questões Enade',
          color: '#fff'
        },
        backgroundColor: '#56585D',
        data: [
          {
            type: 'pie',
            indexLabelPlacement: "inside",
            indexLabel: "{label}: {y}",
            dataPoints: [
              { label: 'Acertos', y: this.enadePorcentagemDTO.questoesCorrect, color: '#4CAF50' },
              { label: 'Erros', y: this.enadePorcentagemDTO.questoesFeitas - this.enadePorcentagemDTO.questoesCorrect, color: '#F44336' }
            ],
          },
        ],
      };
    }
  }

  chartQuestion = {
    title: {
      text: 'Questões',
      color: '#fff'
    },
    backgroundColor: '#56585D',
    data: [
      {
        type: 'pie',
        indexLabelPlacement: "inside",
        indexLabel: "{label}: {y}",
        dataPoints: [
          { label: 'Acertos', y: 0, color: '#4CAF50'},
          { label: 'Erros', y: 0, color: '#F44336' }
        ],
      },
    ],
  };

  updateChartQuestion() {
    if(this.questionResultDTO.questoesFeitas) {
      this.chartQuestion = {
        title: {
          text: 'Questões',
          color: '#fff'
        },
        backgroundColor: '#56585D',
        data: [
          {
            type: 'pie',
            indexLabelPlacement: "inside",
            indexLabel: "{label}: {y}",
            dataPoints: [
              { label: 'Acertos', y: this.questionResultDTO.questoesCorrect, color: '#4CAF50'},
              { label: 'Erros', y: this.questionResultDTO.questoesFeitas - this.questionResultDTO.questoesCorrect, color: '#F44336' }
            ],
          },
        ],
      };
    }
  }

}
