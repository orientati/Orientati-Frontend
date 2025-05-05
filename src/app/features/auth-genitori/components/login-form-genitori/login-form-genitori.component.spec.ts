import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormGenitoriComponent } from './login-form-genitori.component';

describe('LoginFormGenitoriComponent', () => {
  let component: LoginFormGenitoriComponent;
  let fixture: ComponentFixture<LoginFormGenitoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormGenitoriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormGenitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
