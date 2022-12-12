import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmQuotationDetailsComponent } from './pm-quotation-details.component';

describe('PmQuotationDetailsComponent', () => {
  let component: PmQuotationDetailsComponent;
  let fixture: ComponentFixture<PmQuotationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmQuotationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmQuotationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
