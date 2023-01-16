import { TestBed } from '@angular/core/testing';

import { LinerService } from './liner.service';

describe('LinerService', () => {
  let service: LinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
