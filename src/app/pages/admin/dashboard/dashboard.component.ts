import { CourseService } from 'src/app/service/course/course.service';
import { Component, OnInit, ChangeDetectionStrategy, effect, inject } from '@angular/core';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import { QuestionService } from 'src/app/service/question/question.service';
import { EnadeService } from 'src/app/service/enade/enade.service';
import { StudentService } from 'src/app/service/student/student.service';
import { ThemeService } from 'src/app/service/theme/theme.service';
import { EnadePorcentagemDTO } from 'src/app/interfaces/EnadePorcentagemDTO';
import { QuestionResultDTO } from 'src/app/interfaces/QuestionResultaDTO';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
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

  chartEnade = this.buildChart('Questões Enade', 0, 0);
  chartQuestion = this.buildChart('Questões', 0, 0);

  private readonly theme = inject(ThemeService);

  constructor(
    private courseService: CourseService,
    private professorService: ProfessorService,
    private questionService: QuestionService,
    private enadeService: EnadeService,
    private studentService: StudentService
  ) {
    // O CanvasJS desenha em <canvas>, então CSS não alcança o gráfico: as cores
    // precisam ser reinjetadas em JavaScript a cada troca de tema. Antes elas
    // eram fixas ('#56585D' de fundo, título branco), o que sumia no claro.
    effect(() => {
      this.theme.theme();
      this.updateChartEnade();
      this.updateChartQuestion();
    });
  }

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

  private updateChartEnade() {
    const { questoesFeitas, questoesCorrect } = this.enadePorcentagemDTO;
    this.chartEnade = this.buildChart('Questões Enade', questoesCorrect, questoesFeitas - questoesCorrect);
  }

  private updateChartQuestion() {
    const { questoesFeitas, questoesCorrect } = this.questionResultDTO;
    this.chartQuestion = this.buildChart('Questões', questoesCorrect, questoesFeitas - questoesCorrect);
  }

  /** Monta as opções do CanvasJS lendo as cores dos tokens CSS em vigor. */
  private buildChart(title: string, acertos: number, erros: number) {
    return {
      animationEnabled: true,
      backgroundColor: 'transparent',
      title: {
        text: title,
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Roboto, sans-serif',
        color: this.token('--app-text'),
      },
      data: [
        {
          type: 'pie',
          indexLabelPlacement: 'inside',
          indexLabel: '{label}: {y}',
          indexLabelFontColor: '#ffffff',
          indexLabelFontFamily: 'Roboto, sans-serif',
          dataPoints: [
            { label: 'Acertos', y: acertos, color: this.token('--app-success') },
            { label: 'Erros', y: erros, color: this.token('--app-danger') },
          ],
        },
      ],
    };
  }

  private token(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
}
