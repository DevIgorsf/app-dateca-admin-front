import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EnadeDTO } from 'src/app/interfaces/EnadeDTO';
import { EnadeService } from 'src/app/service/enade/enade.service';

@Component({
    selector: 'app-enade',
    templateUrl: './enade.component.html',
    styleUrls: ['./enade.component.scss'],
    standalone: false
})
export class EnadeComponent implements OnInit, OnDestroy {
  enades: EnadeDTO[] = [];
  enadesSubscription: Subscription = new Subscription;

  public dataSource!: MatTableDataSource<EnadeDTO>;
  public displayedColumns:string[] = ['year','number', 'statement', 'pointsEnum', 'acoes'];
  public pageSize=1;
  public length=5;

  constructor(
    private service: EnadeService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getEnades();
    this.enadesSubscription = this.service.enade$.subscribe(enades => {
      this.updateDataSource(enades);
    });
  }

  ngOnDestroy(): void {
    this.enadesSubscription.unsubscribe();
  }
  
  getEnades(): void {
    if (this.enadesSubscription) {
      this.enadesSubscription.unsubscribe();
    }
    this.service.getAllEnade();
  }
  
  updateDataSource(enades: EnadeDTO[]): void {
    this.enades = enades;
    this.dataSource = new MatTableDataSource<EnadeDTO>(this.enades);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  deleteEnade(courseId: number): void {
    if (courseId) {
      this.service.deleteEnade(courseId);
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

