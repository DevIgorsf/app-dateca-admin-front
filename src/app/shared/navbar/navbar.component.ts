import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { ProfessorService } from 'src/app/service/professor/professor.service';
import { SidebarButtonService } from 'src/app/service/sidebar-button/sidebar-button.service';
import { ThemeService } from 'src/app/service/theme/theme.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavbarComponent implements OnInit {
  user$ = this.userService.retornaUsuario();
  professor: any;

  // A navbar é `fixed-top` e precisa começar onde a sidebar termina; antes o
  // recuo era fixo em 244px e deixava uma faixa vazia com a sidebar recolhida.
  sidebarExpanded: boolean = true;

  private readonly themeService = inject(ThemeService);
  readonly isDarkMode = this.themeService.theme;

  constructor(
    private userService: UserService,
    private router: Router,
    private professorService: ProfessorService,
    private sidebarButtonService: SidebarButtonService,
  ) {}

  ngOnInit(): void {
    this.sidebarButtonService.sidebarExpanded$.subscribe((expanded) => {
      this.sidebarExpanded = expanded;
    });

    this.professorService.getPerfil().subscribe((professor) => {
        this.professor = professor;
    });
  }

  toggleTheme() {
    this.themeService.toggle();
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
