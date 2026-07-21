import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from './service/theme/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'app-dateca-admin-front';

  // Instanciado já na raiz para que o tema valha também nas telas sem navbar
  // (login), e não apenas depois que o shell administrativo carrega.
  private readonly theme = inject(ThemeService);
}
