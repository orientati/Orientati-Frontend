import { TestBed } from '@angular/core/testing';

import { IscrizioneRagazzoService } from './iscrizione-ragazzo.service';

describe('IscrizioneRagazzoService', () => {
  let service: IscrizioneRagazzoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IscrizioneRagazzoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
