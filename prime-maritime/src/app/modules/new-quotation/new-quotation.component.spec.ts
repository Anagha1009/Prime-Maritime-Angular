import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuotationComponent } from './new-quotation.component';

describe('NewQuotationComponent', () => {
  let component: NewQuotationComponent;
  let fixture: ComponentFixture<NewQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
