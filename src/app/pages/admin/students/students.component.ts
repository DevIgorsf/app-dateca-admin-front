import { Component, ViewChild, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/interfaces/student';
import { StudentService } from 'src/app/service/student/student.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class StudentsComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  studentsSubscription: Subscription = new Subscription;

  public dataSource!: MatTableDataSource<Student>;
  public displayedColumns: string[] = ['registrationNumber', 'name', 'email', 'phone', 'semester'];

  constructor(
    private service: StudentService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.service.getAll();
    this.studentsSubscription = this.service.students$.subscribe(students => {
      this.dataSource = new MatTableDataSource<Student>(students);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    this.studentsSubscription.unsubscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
