import {Component} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-form-select',
  imports: [ReactiveFormsModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css'
})
export class FormSelectComponent {
  @Input() options: any[] = [];
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() formSubmitted: boolean = false;


  @Output() selectionChanged = new EventEmitter<string>();

  isOpen = false;


  onChange(value: string) {
    this.selectionChanged.emit(value);
  }
}

