import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackBookingComponent } from './track-booking.component';

describe('TrackBookingComponent', () => {
  let component: TrackBookingComponent;
  let fixture: ComponentFixture<TrackBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
