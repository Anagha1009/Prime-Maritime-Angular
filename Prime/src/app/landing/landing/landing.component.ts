import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isquotation: boolean = true;
  bookingNo: string = '';
  isTracking: boolean = true;
  currentStep = 1;
  user: any;
  isLoggedIn: boolean = false;
  ispreloader: boolean = true;

  constructor(
    private _router: Router,
    private _bookingservice: BookingService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.ispreloader = false;
    }, 3000);
  }

  public loadJsFile(url: any[]) {
    url.forEach((el) => {
      let node = document.createElement('script');
      node.src = el;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  getTracking() {
    if (this.bookingNo == '') {
      alert('Please enter booking no!');
    } else {
      var element = document.getElementById('openModalButton') as HTMLElement;
      element.click();
    }
  }

  Tracking() {
    const steps = Array.from(document.getElementsByClassName('step'));
    const progess = document.getElementsByClassName('progress-bar');
    const icon = document.getElementsByClassName('train');

    Array.from(steps).forEach((step, index) => {
      let stepNum = index + 1;

      if (stepNum === this.currentStep + 1) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }

      if (stepNum <= this.currentStep) {
        progess[index].classList.add('progress-bar--success');
        icon[index].classList.toggle('mystyle');
      }
    });
  }

  getTrackingDetail() {
    this._bookingservice
      .getTrackingDetail(this.bookingNo)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          if (res.Data == 0) {
            this.isTracking = false;
          } else {
            this.isTracking = true;
            this.currentStep = res.Data;
            this.Tracking();
          }
        } else {
          this.isTracking = false;
        }
      });
  }
}
