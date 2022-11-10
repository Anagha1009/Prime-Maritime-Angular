import { TestBed } from '@angular/core/testing';

import { ErService } from './er.service';

describe('ErService', () => {
  let service: ErService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
