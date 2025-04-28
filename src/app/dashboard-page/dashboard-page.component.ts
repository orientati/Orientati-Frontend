import { Component, HostListener } from '@angular/core';
import {CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CdkDropList,
    DragDropModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  sections = [
    { id: 1, width: 33, content: 'Sezione 1' },
    { id: 2, width: 34, content: 'Sezione 2' },
    { id: 3, width: 33, content: 'Sezione 3' }
  ];

  isResizing = false;
  activeSeparatorIndex: number | null = null;
  startX = 0;
  startWidths: number[] = [];

  startResize(event: MouseEvent, index: number) {
    this.isResizing = true;
    this.activeSeparatorIndex = index;
    this.startX = event.clientX;
    this.startWidths = this.sections.map(s => s.width);
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing || this.activeSeparatorIndex === null) return;

    const dx = event.clientX - this.startX;
    const percentDx = (dx / window.innerWidth) * 100;

    const leftSection = this.sections[this.activeSeparatorIndex];
    const rightSection = this.sections[this.activeSeparatorIndex + 1];

    if (leftSection && rightSection) {
      leftSection.width = Math.max(5, this.startWidths[this.activeSeparatorIndex] + percentDx);
      rightSection.width = Math.max(5, this.startWidths[this.activeSeparatorIndex + 1] - percentDx);
    }
  }

  @HostListener('window:mouseup')
  stopResize() {
    this.isResizing = false;
    this.activeSeparatorIndex = null;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }
}
