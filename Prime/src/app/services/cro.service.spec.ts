import { TestBed } from '@angular/core/testing';

import { CroService } from './cro.service';

describe('CroService', () => {
  let service: CroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
