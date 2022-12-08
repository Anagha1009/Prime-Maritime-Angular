import { TestBed } from '@angular/core/testing';

import { LoadListService } from './load-list.service';

describe('LoadListService', () => {
  let service: LoadListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
