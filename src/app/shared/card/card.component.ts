import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
}
