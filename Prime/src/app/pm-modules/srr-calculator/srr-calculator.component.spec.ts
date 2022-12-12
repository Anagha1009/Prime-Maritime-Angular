import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrrCalculatorComponent } from './srr-calculator.component';

describe('SrrCalculatorComponent', () => {
  let component: SrrCalculatorComponent;
  let fixture: ComponentFixture<SrrCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrrCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrrCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
