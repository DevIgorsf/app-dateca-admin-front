import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import { SidebarButtonService } from 'src/app/service/sidebar-button/sidebar-button.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavbarComponent {
  user$ = this.userService.retornaUsuario();
  professor: any;
  isDarkMode: boolean = false;

  constructor(
    private userService: UserService, 
    private router: Router,
    private professorService: ProfessorService,
    private sidebarButtonService: SidebarButtonService,
  ) {}

  ngOnInit(): void {
    const isDarkModeSession = sessionStorage.getItem('isDarkMode');
    if (isDarkModeSession !== null) {
      this.isDarkMode = isDarkModeSession === 'true';
      this.updateDarkMode();
    }

    this.professorService.getPerfil().subscribe((professor) => {
        this.professor = professor;
    });
  }

  onSlideToggleChange(event: any) {
    this.isDarkMode = event.checked;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.saveDarkModeState();
  }

  private updateDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  private saveDarkModeState() {
    sessionStorage.setItem('isDarkMode', this.isDarkMode.toString());
  }

  toggleSidebar() {
    this.sidebarButtonService.toggleSidebar();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

  getFirstName(fullName: string | undefined): string | undefined {
    if (!fullName) return undefined;
    const firstName = fullName.split(' ')[0];
    return firstName;
  }

}
