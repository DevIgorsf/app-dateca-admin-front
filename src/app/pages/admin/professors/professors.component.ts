import { Component, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs';
import { Professor } from 'src/app/interfaces/professor';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-professors',
    templateUrl: './professors.component.html',
    styleUrls: ['./professors.component.scss'],
    standalone: false
})
export class ProfessorsComponent {
  professors: Professor[] = [];
  professorsSubscription: Subscription = new Subscription;

  public dataSource!: MatTableDataSource<Professor>;
  public displayedColumns:string[] = ['registrationNumber', 'name', 'email', 'acoes'];
  public pageSize=1;
  public length=5;

  constructor(
    private service: ProfessorService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.service.getAll()
    this.professorsSubscription = this.service.professors$.subscribe(professors => {
      this.dataSource= new MatTableDataSource<Professor>(professors);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }

  deleteProfessor(professorId: number): void {
    if (professorId) {
      this.service.deleteProfessor(professorId);
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
