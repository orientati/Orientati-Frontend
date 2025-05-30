import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label!: string;
  @Input() icon!: string;

  @Output() click = new EventEmitter<void>();

  onClick(): void {
    this.click.emit();
  }
}
