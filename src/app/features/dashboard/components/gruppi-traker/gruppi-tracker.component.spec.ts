import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruppiTrakerComponent } from './gruppi-tracker.component';

describe('GruppiTrakerComponent', () => {
  let component: GruppiTrakerComponent;
  let fixture: ComponentFixture<GruppiTrakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruppiTrakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruppiTrakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
