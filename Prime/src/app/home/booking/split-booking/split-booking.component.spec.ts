import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBookingComponent } from './split-booking.component';

describe('SplitBookingComponent', () => {
  let component: SplitBookingComponent;
  let fixture: ComponentFixture<SplitBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
