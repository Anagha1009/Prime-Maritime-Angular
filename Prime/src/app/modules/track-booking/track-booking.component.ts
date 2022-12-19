import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-track-booking',
  templateUrl: './track-booking.component.html',
  styleUrls: ['./track-booking.component.scss'],
})
export class TrackBookingComponent implements OnInit {

  bookingNO: string = '';
  isTracking: boolean = true;
  currentStep = 1;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _bookingservice: BookingService
  ) { }

  ngOnInit(): void {

    this._activatedRoute.queryParams.subscribe(params => {
      this.bookingNO = params['bookingNo'];
    });

    this.getTrackingDetail();
  }


  Tracking() {

    const steps = Array.from(document.getElementsByClassName('step'));
    const progess = document.getElementsByClassName('progress-bar');
    const icon = document.getElementsByClassName('train');

    Array.from(steps).forEach((step, index) => {
      let stepNum = index + 1;

      if (stepNum === this.currentStep + 1) {
        step.classList.add('is-active');
      }
      else {
        step.classList.remove('is-active');
      }

      if (stepNum <= this.currentStep) {
        progess[index].classList.add('progress-bar--success');
        icon[index].classList.toggle('mystyle');
      }
    });

  }

  getTrackingDetail() {
    this._bookingservice.getTrackingDetail(this.bookingNO).subscribe((res: any) => {
      console.log(JSON.stringify(res));
      if (res.ResponseCode == 200) {
        console.log("res" + res.Data)
        if (res.Data == 0) {
          this.isTracking = false;
        }
        else {
          this.isTracking = true;
          this.currentStep = res.Data;
          this.Tracking();
        }
      }
      else{
        this.isTracking = false;
      }
    })
  }
}
