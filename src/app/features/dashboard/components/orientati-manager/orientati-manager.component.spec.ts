import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientatiManagerComponent } from './orientati-manager.component';

describe('OrientatiManagerComponent', () => {
  let component: OrientatiManagerComponent;
  let fixture: ComponentFixture<OrientatiManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrientatiManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientatiManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
