import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vallauri-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vallauri.input.component.html',
  styleUrls: ['./vallauri.input.component.css'],
})
export class VallauriInputComponent {
  @Input({ required: true }) placeholder = '';
  @Input({ required: true }) type = 'text';
  value = '';

  @Output() valueChange = new EventEmitter<string>();

  onValueChange() {
    this.valueChange.emit(this.value);
  }
}
