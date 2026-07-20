import { Component, Input } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';

@Component({
    selector: 'app-form-text-field',
    templateUrl: './form-text-field.component.html',
    styleUrls: ['./form-text-field.component.scss'],
    standalone: false
})
export class FormTextFieldComponent {
  @Input() text: string | undefined;
  @Input() control!: FormControl;
  @Input() placeholder: string = "";
  @Input() icon: string | undefined;
  @Input() type: string = "text";
}
