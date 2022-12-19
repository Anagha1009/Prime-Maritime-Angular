import { TestBed } from '@angular/core/testing';

import { SrrReportService } from './srr-report.service';

describe('SrrReportService', () => {
  let service: SrrReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrrReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
