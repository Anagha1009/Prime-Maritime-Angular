import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmBookingListComponent } from './pm-booking-list.component';

describe('PmBookingListComponent', () => {
  let component: PmBookingListComponent;
  let fixture: ComponentFixture<PmBookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmBookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
