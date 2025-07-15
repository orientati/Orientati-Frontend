import {Component, input, Input, SimpleChanges} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css'
})
export class FormInputComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() formSubmitted: boolean = false;

  private controlSub?: Subscription;

  ngOnInit(): void {
    this.subscribeToControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formSubmitted']) {
      this.checkErrorCondition();
    }
  }

  private subscribeToControl(): void {
    this.controlSub = this.control.statusChanges.subscribe(() => {
      this.checkErrorCondition();
    });
  }

  private checkErrorCondition(): void {
    if (this.control.invalid && this.formSubmitted) {
      console.log('Errore nel campo:', this.label);

    }
  }

  ngOnDestroy(): void {
    this.controlSub?.unsubscribe();
  }
}
