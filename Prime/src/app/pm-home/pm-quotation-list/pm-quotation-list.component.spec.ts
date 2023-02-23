import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmQuotationListComponent } from './pm-quotation-list.component';

describe('PmQuotationListComponent', () => {
  let component: PmQuotationListComponent;
  let fixture: ComponentFixture<PmQuotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmQuotationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmQuotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
