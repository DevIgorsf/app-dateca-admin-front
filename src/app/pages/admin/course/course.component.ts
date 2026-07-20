import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/interfaces/course';
import { CourseService } from 'src/app/service/course/course.service';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  coursesSubscription: Subscription = new Subscription;
  public dataSource!: MatTableDataSource<Course>;
  public displayedColumns:string[] = ['code', 'name', 'semester','professor.name', 'acoes'];
  public pageSize=1;
  public length=5;

  constructor(
    private service: CourseService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.service.getAll()
    this.coursesSubscription = this.service.courses$.subscribe(courses => {
      this.dataSource= new MatTableDataSource<Course>(courses);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }

  deleteCourse(courseId: number): void {
    if (courseId) {
      this.service.deleteCourse(courseId);
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
