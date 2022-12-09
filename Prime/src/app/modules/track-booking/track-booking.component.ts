import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-track-booking',
  templateUrl: './track-booking.component.html',
  styleUrls: ['./track-booking.component.scss'],
})
export class TrackBookingComponent implements OnInit {
  @ViewChild('step1') step1: ElementRef;
  @ViewChild('step2') step2: ElementRef;
  @ViewChild('step3') step3: ElementRef;
  @ViewChild('step4') step4: ElementRef;
  @ViewChild('step5') step5: ElementRef;
  @ViewChild('step6') step6: ElementRef;
  @ViewChild('p1') p1: ElementRef;
  @ViewChild('p2') p2: ElementRef;
  @ViewChild('p3') p3: ElementRef;
  @ViewChild('p4') p4: ElementRef;
  @ViewChild('p5') p5: ElementRef;
  @ViewChild('icon1') icon1: ElementRef;
  @ViewChild('icon2') icon2: ElementRef;
  @ViewChild('icon3') icon3: ElementRef;
  @ViewChild('icon4') icon4: ElementRef;
  @ViewChild('icon5') icon5: ElementRef;
  step: string = 'step1';

  constructor() {}

  ngOnInit(): void {}

  next() {
    if (this.step === 'step1') {
      this.step = 'step2';

      this.step1.nativeElement.classList.remove('is-active');
      this.step2.nativeElement.classList.add('is-active');
      this.p1.nativeElement.classList.add('progress-bar--success');

      this.icon1.nativeElement.click();
    } else if (this.step === 'step2') {
      this.step = 'step3';

      this.step2.nativeElement.classList.remove('is-active');
      this.step3.nativeElement.classList.add('is-active');
      this.p2.nativeElement.classList.add('progress-bar--success');

      this.icon2.nativeElement.click();
    } else if (this.step === 'step3') {
      this.step = 'step4';

      this.step3.nativeElement.classList.remove('is-active');
      this.step4.nativeElement.classList.add('is-active');
      this.p3.nativeElement.classList.add('progress-bar--success');

      this.icon3.nativeElement.click();
    } else if (this.step === 'step4') {
      this.step = 'step5';

      this.step4.nativeElement.classList.remove('is-active');
      this.step5.nativeElement.classList.add('is-active');
      this.p4.nativeElement.classList.add('progress-bar--success');

      this.icon4.nativeElement.click();
    } else if (this.step === 'step5') {
      this.step = 'step6';

      this.step5.nativeElement.classList.remove('is-active');
      // this.step6.nativeElement.classList.add('is-active');
      this.step = 'complete';
      this.p5.nativeElement.classList.add('progress-bar--success');

      this.icon5.nativeElement.click();
    }
  }
}
