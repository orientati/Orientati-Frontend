import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormGenitoreComponent } from './login-form-genitore.component';

describe('LoginFormGenitoreComponent', () => {
  let component: LoginFormGenitoreComponent;
  let fixture: ComponentFixture<LoginFormGenitoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormGenitoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormGenitoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
