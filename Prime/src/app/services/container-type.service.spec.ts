import { TestBed } from '@angular/core/testing';

import { ContainerTypeService } from './container-type.service';

describe('ContainerTypeService', () => {
  let service: ContainerTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
