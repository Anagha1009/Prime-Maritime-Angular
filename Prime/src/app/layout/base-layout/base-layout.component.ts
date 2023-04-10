import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
})
export class BaseLayoutComponent implements OnInit {
  isquotation: boolean = true;
  bookingNo: string = '';
  isTracking: boolean = true;
  currentStep = 1;
  user: any;
  isLoggedIn: boolean = false;
  ispreloader: boolean = true;
  isSticky: boolean = false;
  mobilenav: boolean = false;
  navbarmobile: boolean = false;

  constructor(
    private _router: Router,
    private _bookingservice: BookingService,
    private _loginService: LoginService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.ispreloader = false;
    }, 3000);

    this.user = this._loginService.userValue;
    if (this.user) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  public loadJsFile(url: any[]) {
    url.forEach((el) => {
      let node = document.createElement('script');
      node.src = el;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  redirectToHome() {
    if (this.user.roleCode == '1') {
      this._router.navigateByUrl('/home/rate-request/srr-list');
    } else if (this.user.roleCode == '3') {
      this._router.navigateByUrl('/home/depo/depo-dashboard');
    } else if (this.user.roleCode == '2') {
      this._router.navigateByUrl('/pm/dashboard');
    } else if (this.user.roleCode == '4') {
      this._router.navigateByUrl('/pm/dashboard');
    }
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
    console.log('in  tracking');
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
        console.log(JSON.stringify(res));
        if (res.ResponseCode == 200) {
          console.log('res' + res.Data);
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

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }

  clickmobilenav() {
    this.mobilenav = !this.mobilenav;
  }
}
