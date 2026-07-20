import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SidebarButtonService } from 'src/app/service/sidebar-button/sidebar-button.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SidebarComponent implements OnInit {
  sidebarExpanded: boolean = true;

  constructor(private sidebarService: SidebarButtonService) {}

  ngOnInit(): void {
    this.sidebarService.sidebarExpanded$.subscribe(expanded => {
      this.sidebarExpanded = expanded;
    });
  }

}
