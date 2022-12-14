import { TestBed } from '@angular/core/testing';

import { TdrService } from './tdr.service';

describe('TdrService', () => {
  let service: TdrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TdrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
