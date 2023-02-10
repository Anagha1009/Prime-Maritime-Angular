import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [
    './landing.component.scss',
    // './../../../assets/vendor/animate.css/animate.min.css',
    // './../../../assets/vendor/aos/aos.css',
    // './../../../assets/vendor/bootstrap/css/bootstrap.min.css',
    // './../../../assets/vendor/bootstrap/css/bootstrap-grid.css',
    // './../../../assets/vendor/bootstrap-icons/bootstrap-icons.css',
    // './../../../assets/vendor/boxicons/css/boxicons.min.css',
    // './../../../assets/vendor/glightbox/css/glightbox.min.css',
    // './../../../assets/vendor/swiper/swiper-bundle.min.css',
    // './../../../assets/css/style.css',
  ],
})
export class LandingComponent implements OnInit {
  isquotation: boolean = true;
  bookingNo: string = '';
  isTracking: boolean = true;
  currentStep = 1;

  constructor(private _router: Router,private _bookingservice: BookingService) {}

  ngOnInit(): void {
    // this.loadJsFile([
    //   // 'assets/vendor/purecounter/purecounter_vanilla.js',
    //   // 'assets/vendor/aos/aos.js',
    //   // 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    //   // 'assets/vendor/glightbox/js/glightbox.min.js',
    //   // 'assets/vendor/isotope-layout/isotope.pkgd.min.js',
    //   // 'assets/vendor/swiper/swiper-bundle.min.js',
    //   // 'assets/vendor/waypoints/noframework.waypoints.js',
    //   // 'assets/vendor/php-email-form/validate.js',
    //   // 'assets/js/main.js',
    // ]);
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
    //this._router.navigate(['/home/track-booking'], { queryParams: { bookingNo: this.bookingNo } });
    if (this.bookingNo == '') {
      alert('Please enter booking no!');
    } else {
      var element = document.getElementById("openModalButton") as HTMLElement;
      element.click();
      // const url = this._router.serializeUrl(this._router.createUrlTree(
      //   ['/home/track-booking'], { queryParams: { bookingNo: this.bookingNo } }
      // ));
      //window.open(url, '_blank');
    }
  }

  Tracking() {
    console.log("in  tracking");
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
}
