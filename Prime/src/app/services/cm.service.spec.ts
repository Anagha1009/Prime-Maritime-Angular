import { TestBed } from '@angular/core/testing';

import { CmService } from './cm.service';

describe('CmService', () => {
  let service: CmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
