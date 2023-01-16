import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.loadJsFile([
      // 'assets/vendor/purecounter/purecounter_vanilla.js',
      // 'assets/vendor/aos/aos.js',
      // 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
      // 'assets/vendor/glightbox/js/glightbox.min.js',
      // 'assets/vendor/isotope-layout/isotope.pkgd.min.js',
      // 'assets/vendor/swiper/swiper-bundle.min.js',
      // 'assets/vendor/waypoints/noframework.waypoints.js',
      // 'assets/vendor/php-email-form/validate.js',
      // 'assets/js/main.js',
    ]);
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
      // const url = this._router.serializeUrl(this._router.createUrlTree(
      //   ['/home/track-booking'], { queryParams: { bookingNo: this.bookingNo } }
      // ));
      //window.open(url, '_blank');
    }
  }
}
