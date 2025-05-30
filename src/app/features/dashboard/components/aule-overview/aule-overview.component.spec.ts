import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuleOverviewComponent } from './aule-overview.component';

describe('AuleOverviewComponent', () => {
  let component: AuleOverviewComponent;
  let fixture: ComponentFixture<AuleOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuleOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
