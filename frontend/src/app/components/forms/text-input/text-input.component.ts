import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})

// component integrates with Angular forms
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';

  // inject dependency only from current component (local injector)
  constructor(@Self() public ngControl: NgControl) {
    // component sets itself as the valueAccessor for the NgControl.
    // This establishes a connection between the custom form control and the Angular forms API.
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  // Access and convert input to a form control
  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
