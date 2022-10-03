import { TestBed } from '@angular/core/testing';

import { SRRService } from './srr.service';

describe('SRRService', () => {
  let service: SRRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SRRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
