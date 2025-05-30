import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-select',
  imports: [ReactiveFormsModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css'
})
export class FormSelectComponent {
  @Input() options: string[] = [];
  @Input() selected: string | null = null;
  @Output() selectionChanged = new EventEmitter<string>();

  
  onChange(value: string) {
    this.selectionChanged.emit(value);
  }
}
