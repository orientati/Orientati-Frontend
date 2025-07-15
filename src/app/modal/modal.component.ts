import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from "../shared/button/button.component";
import {FormInputComponent} from "../shared/components/forms/form-input/form-input.component";
import {FormSelectComponent} from "../shared/components/forms/form-select/form-select.component";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-modal',
    imports: [
        ButtonComponent,
        FormInputComponent,
        FormSelectComponent,
        ReactiveFormsModule
    ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title = 'Modale';
  @Input() isOpen = false;

  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
