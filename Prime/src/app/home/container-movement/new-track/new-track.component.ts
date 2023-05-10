import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-track',
  templateUrl: './new-track.component.html',
  styleUrls: ['./new-track.component.scss'],
})
export class NewTrackComponent implements OnInit {
  //mainrequest
  bkno: any = '';
  bookingno: any = '';
  crno: any = '';
  currentContNo: any = '';
  currentActivity: any = '';
  showTracking: boolean = false;
  previewDetails: boolean = false;
  previewNoData: boolean = false;
  show: boolean = false;
  cmList: any[] = [];
  booking = new BOOKING();

  constructor(
    private _cmService: CmService,
    private _cs: CommonService,
    private _bookingService: BookingService,
    private _router: Router
  ) {}

  ngOnInit(): void {}

  //LOGIC
  getTrackingHistoryList() {
    this.previewDetails = false;
    this.previewNoData = false;
    if (this.bkno == '') {
      alert('Please enter BOOKING or CRO number');
    } else {
      if (this.bkno.includes('CRO')) {
        this.crno = this.bkno;
        this.bookingno = '';
      } else if (this.bkno.includes('BK')) {
        this.bookingno = this.bkno;
        this.crno = '';
      } else {
        alert('Incorrect booking or cro number! Try again!');
      }
      this._cmService
        .getContainerMovementBooking(this.bookingno, this.crno)
        .subscribe(
          (res: any) => {
            this.cmList = [];
            //this.isScroll = false;
            if (res.ResponseCode == 200) {
              if (res.Data?.length > 0) {
                this.cmList = res.Data;
                this.previewDetails = true;
                // if (this.doList?.length >= 4) {
                //   this.isScroll = true;
                // } else {
                //   this.isScroll = false;
                // }
              } else {
                this.previewNoData = true;
              }
            }
            if (res.ResponseCode == 500) {
              this.previewNoData = true;
            }
          },
          (error: any) => {
            if (error.status == 401) {
              alert('You are not authorized to access this page, please login');
              this._router.navigateByUrl('login');
            }
          }
        );
      this.getBookingDetails();
    }
  }
  getBookingDetails() {
    this.previewNoData = false;
    this.previewDetails = false;
    var bk = new BOOKING();
    bk.AGENT_CODE = this._cs.getUserCode();
    bk.BOOKING_NO = this.bkno;

    this._bookingService.getBookingDetails(bk).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.booking = res.Data;
      }
      if (res.ResponseCode == 500) {
        this.booking = this.booking;
      }
    });
  }

  openTracking(data: any) {
    this.currentActivity = data.ACTIVITY;

    this.currentContNo = data.CONTAINER_NO;
    switch (this.currentActivity) {
      case 'RCFL':
        var element = document.getElementById('openModalButton') as HTMLElement;
        element.click();
        break;
      case 'LODF':
        var element = document.getElementById('openModalButton') as HTMLElement;
        element.click();
        break;
      case 'DCHF':
        var element = document.getElementById('openModalButton') as HTMLElement;
        element.click();
        break;
      case 'SNTC':
        var element = document.getElementById('openModalButton') as HTMLElement;
        element.click();
        break;
      case 'RCCN':
        var element = document.getElementById('openModalButton') as HTMLElement;
        element.click();
        break;
      default:
        alert('There is no movement for this particular container!');
        break;
    }
  }

  trackContainer(data: any) {
    //this.currentActivity=data.ACTIVITY;
    switch (this.currentActivity) {
      case 'SNTC':
        //this.shift1();
        break;
      case 'RCFL':
        this.shift1();
        break;
      case 'LODF':
        this.shift2();
        break;
      case 'DCHF':
        this.shift3();
        break;
      case 'SNTC':
        this.shift4();
        break;
      case 'RCCN':
        this.shift5();
        break;
      default:
        break;
    }
  }

  shift1() {
    var hang = document.getElementById('hang') as HTMLElement;
    hang.style.animation = 'move-in-steps1 10s infinite';
    setTimeout(() => {
      hang.style.animationPlayState = 'paused';
    }, 1250);
  }
  shift2() {
    var hang = document.getElementById('hang') as HTMLElement;
    hang.style.animation = 'move-in-steps2 10s infinite';
    setTimeout(() => {
      hang.style.animationPlayState = 'paused';
    }, 2500);
  }
  shift3() {
    var hang = document.getElementById('hang') as HTMLElement;
    hang.style.animation = 'move-in-steps3 10s infinite';
    setTimeout(() => {
      hang.style.animationPlayState = 'paused';
    }, 4000);
  }
  shift4() {
    var hang = document.getElementById('hang') as HTMLElement;
    hang.style.animation = 'move-in-steps4 10s infinite';
    setTimeout(() => {
      hang.style.animationPlayState = 'paused';
    }, 6000);
  }
  shift5() {
    var hang = document.getElementById('hang') as HTMLElement;
    hang.style.animation = 'move-in-steps5 10s infinite';
    setTimeout(() => {
      hang.style.animationPlayState = 'paused';
    }, 8000);
  }
}
