import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageAdminComponent } from './login-page-admin.component';

describe('LoginPageAdminComponent', () => {
  let component: LoginPageAdminComponent;
  let fixture: ComponentFixture<LoginPageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
