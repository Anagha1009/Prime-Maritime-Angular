import { TestBed } from '@angular/core/testing';

import { DoService } from './do.service';

describe('DoService', () => {
  let service: DoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
