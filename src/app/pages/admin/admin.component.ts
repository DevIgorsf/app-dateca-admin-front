import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SidebarButtonService } from 'src/app/service/sidebar-button/sidebar-button.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminComponent implements OnInit {
  sidebarExpanded: boolean = true;

  constructor(private sidebarService: SidebarButtonService) {}

  ngOnInit(): void {
    this.sidebarService.sidebarExpanded$.subscribe(expanded => {
      this.sidebarExpanded = expanded;
    });
  }

}
