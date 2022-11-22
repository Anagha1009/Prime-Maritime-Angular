import { TestBed } from '@angular/core/testing';

import { DepoService } from './depo.service';

describe('DepoService', () => {
  let service: DepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
