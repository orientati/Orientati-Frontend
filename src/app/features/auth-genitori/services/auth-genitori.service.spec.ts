import { TestBed } from '@angular/core/testing';

import { AuthGenitoriService } from './auth-genitori.service';

describe('AuthGenitoriService', () => {
  let service: AuthGenitoriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGenitoriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
