import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageGenitoreComponent } from './login-page-genitore.component';

describe('LoginPageGenitoreComponent', () => {
  let component: LoginPageGenitoreComponent;
  let fixture: ComponentFixture<LoginPageGenitoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageGenitoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageGenitoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
