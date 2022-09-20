import { TestBed } from '@angular/core/testing';

import { SrrService } from './srr.service';

describe('SrrService', () => {
  let service: SrrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
