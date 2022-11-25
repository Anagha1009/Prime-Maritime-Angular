import { TestBed } from '@angular/core/testing';

import { DetentionService } from './detention.service';

describe('DetentionService', () => {
  let service: DetentionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetentionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
