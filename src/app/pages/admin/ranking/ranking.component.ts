import { Component } from '@angular/core';
import { ProfessorService } from 'src/app/service/professor/professor.service';


@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.scss'],
    standalone: false
})
export class RankingComponent {

  rankingStudents: any[] = [];

  constructor(
    private service: ProfessorService,
  ) {}

  ngOnInit(): void {
    this.service.getRanking().subscribe(
      (response) => {
        this.rankingStudents = response;
      }
    )
  }

}
