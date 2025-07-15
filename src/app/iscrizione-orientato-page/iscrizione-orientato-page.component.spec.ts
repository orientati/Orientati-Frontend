import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IscrizioneOrientatoPageComponent } from './iscrizione-orientato-page.component';

describe('IscrizioneOrientatoPageComponent', () => {
  let component: IscrizioneOrientatoPageComponent;
  let fixture: ComponentFixture<IscrizioneOrientatoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IscrizioneOrientatoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IscrizioneOrientatoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
