import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { QuestionService } from 'src/app/service/question/question.service';
import { QuestionMultipleChoiceDTO } from 'src/app/interfaces/QuestionMultipleChoiceDTO';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    standalone: false
})
export class QuestionComponent implements OnInit {
  questions: QuestionMultipleChoiceDTO[] = [];
  questionsSubscription: Subscription = new Subscription;

  public dataSource!: MatTableDataSource<QuestionMultipleChoiceDTO>;
  public displayedColumns:string[] = ['id', 'statement', 'pointsEnum', 'acoes'];
  public pageSize=1;
  public length=5;

  constructor(
    private service: QuestionService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.service.getAll()
    this.questionsSubscription = this.service.questions$.subscribe(questions => {
      this.dataSource = new MatTableDataSource<QuestionMultipleChoiceDTO>(questions);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }

  deleteQuestion(courseId: number): void {
    if (courseId) {
      this.service.deleteQuestion(courseId);
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
