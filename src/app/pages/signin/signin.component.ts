import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ThemeService } from 'src/app/service/theme/theme.service';
import { isServicoIndisponivel, SERVICO_INDISPONIVEL_MENSAGEM } from 'src/app/service/http-error.util';


@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SigninComponent implements OnInit {

  login = '';
  password = '';

  // O login não tem navbar, então precisa do próprio controle de tema — caso
  // contrário só dá para trocar depois de entrar no sistema.
  private readonly themeService = inject(ThemeService);
  readonly isDarkMode = this.themeService.theme;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  toggleTheme() {
    this.themeService.toggle();
  }

  logIn() {
    this.authService.autenticar(this.login, this.password).subscribe(
      () => {
        this.router.navigate(['admin/dashboard']);
      },
      (error) => {
        if (isServicoIndisponivel(error)) {
          this.toastr.error(SERVICO_INDISPONIVEL_MENSAGEM);
        } else if (error.status === 403) {
          this.toastr.error('Acesso negado. Verifique suas credenciais.');
        } else {
          this.toastr.error(error.message);
        }
      }
    );
  }
}
