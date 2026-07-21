import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/** Cores de acento disponíveis; mapeiam para os tokens `--app-accent-*`. */
export type CardAccent = 'blue' | 'green' | 'amber' | 'violet' | 'teal' | 'red' | 'gold';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CardComponent {
  @Input() title: string | undefined;
  @Input() conteudo: string | undefined;
  @Input() icon: string | undefined;

  /**
   * Antes a cor vinha de um `style="color: #..."` no template do dashboard,
   * com hex fixo — ilegível no tema claro. Agora o card escolhe um token, que
   * já tem valor próprio para cada tema.
   */
  @Input() accent: CardAccent = 'blue';
}
