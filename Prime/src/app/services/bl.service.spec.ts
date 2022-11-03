import { TestBed } from '@angular/core/testing';

import { BlService } from './bl.service';

describe('BlService', () => {
  let service: BlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
