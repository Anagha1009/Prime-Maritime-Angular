import { TestBed } from '@angular/core/testing';

import { TestmapService } from './testmap.service';

describe('TestmapService', () => {
  let service: TestmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
