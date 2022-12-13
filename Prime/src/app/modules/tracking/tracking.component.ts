import { keyframes, style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CmService } from 'src/app/services/cm.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  //trackbar
  step: number = 0;
  animation = 0;
  randomIncrease?: boolean = true;
  sntsActive:boolean=false;
  rcflActive:boolean=false;
  lodfActive:boolean=false;
  dchfActive:boolean=false;
  sntcActive:boolean=false;
  rccnActive:boolean=false;
  finish = 'done_all';
  steps = ['check', 'check', 'check', 'check'];
  statusList=['SNTS','RCFL','LODF','DCHF','SNTC','RCCN'];
  count=0;

  //mainrequest
  bkno:any='';
  crno:any='';
  currentActivity:any='';
  showTracking:boolean=false;
  previewDetails:boolean=false;
  previewNoData:boolean=false;
  show:boolean=false;
  cmList:any[]=[];
  booking=new BOOKING();



  constructor(private _cmService:CmService,private _bookingService:BookingService,private _router:Router) { }

  ngOnInit(): void {
  }

  //LOGIC
  getTrackingHistoryList(){
    debugger;
    this.previewDetails=false;
    this.previewNoData=false;
    if(this.bkno==''){
      alert('Please enter container number');
    }
    else{
      this._cmService.getContainerMovementBooking(this.bkno,this.crno).subscribe(
        (res: any) => {
          debugger;
          this.cmList = [];
          //this.isScroll = false;
          if (res.ResponseCode == 200) {
            if (res.Data?.length > 0) {
              this.cmList = res.Data;
              this.previewDetails=true;
              // if (this.doList?.length >= 4) {
              //   this.isScroll = true;
              // } else {
              //   this.isScroll = false;
              // }
            }
            else{
              this.previewNoData=true;
            }
            
          }
          if (res.ResponseCode == 500) {
            this.previewNoData=true;
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
    debugger;
    this.previewNoData=false;
    this.previewDetails=false;
    var bk = new BOOKING();
    bk.AGENT_CODE = localStorage.getItem('usercode');
    bk.BOOKING_NO = this.bkno;

    this._bookingService.getBookingDetails(bk).subscribe((res: any) => {
      debugger;
      if (res.ResponseCode == 200) {
        console.log(res.data);
        this.booking = res.Data;
       
      }
      if(res.ResponseCode==500){
        this.booking=this.booking;
      }
    });
 
  }

  initializeBorders(){
    this.sntsActive=false;
    this.rcflActive=false;
    this.lodfActive=false;
    this.dchfActive=false;
    this.sntcActive=false;
    this.rccnActive=false;
  }

  openTracking(data:any){
    debugger;
    this.currentActivity=data.ACTIVITY;  
    switch (this.currentActivity) {
      case "RCFL":
        var element = document.getElementById("openModalButton") as HTMLElement;
        element.click();
        break;
      case "LODF":
        var element = document.getElementById("openModalButton") as HTMLElement;
        element.click(); 
        break;
      case "DCHF":
        var element = document.getElementById("openModalButton") as HTMLElement;
        element.click();
        break;
      case "SNTC":
        var element = document.getElementById("openModalButton") as HTMLElement;
        element.click(); 
        break;
      case "RCCN":
        var element = document.getElementById("openModalButton") as HTMLElement;
        element.click();
        break;
      default:
        alert("There is no movement for this particular container!");
        break;
    }

  }

  trackContainer(data:any){
    debugger;
    this.initializeBorders();
    this.step= 0;
    this.animation = 0;
    this.randomIncrease= true;
    //this.currentActivity=data.ACTIVITY;
    switch (this.currentActivity) {
      case "RCFL":
          setTimeout(()=>{this.startStep()},1000);
          setTimeout(()=>{this.sntsActive=true},1500);
          break;
      case "LODF":
          setTimeout(()=>{this.startStep();this.startStep()},1000);
          setTimeout(()=>{this.sntsActive=true},1500);
          setTimeout(()=>{this.rcflActive=true},2000);
          break;
      case "DCHF":
          setTimeout(()=>{this.startStep();this.startStep();this.startStep()},1000);
          setTimeout(()=>{this.sntsActive=true},1500);
          setTimeout(()=>{this.rcflActive=true},2000);
          setTimeout(()=>{this.lodfActive=true},2500);
          break;
      case "SNTC":
          setTimeout(()=>{this.startStep();this.startStep();this.startStep();this.startStep()},1000);
          setTimeout(()=>{this.sntsActive=true},1500);
          setTimeout(()=>{this.rcflActive=true},2000);
          setTimeout(()=>{this.lodfActive=true},2500);
          setTimeout(()=>{this.dchfActive=true},3000);
          break;
      case "RCCN":
          setTimeout(()=>{this.startStep();this.startStep();this.startStep();this.startStep();this.startStep()},1000);
          setTimeout(()=>{this.sntsActive=true},1500);
          setTimeout(()=>{this.rcflActive=true},2000);
          setTimeout(()=>{this.lodfActive=true},2500);
          setTimeout(()=>{this.dchfActive=true},3000);
          setTimeout(()=>{this.sntcActive=true},3500);
          break;
      default:
          //console.log("No such day exists!");
          break;
    }
    

  }


  //PROGRESS BAR
  startStep() {
    this.step = this.step + (this.step < 6 ? 1 : 0);
  }
  
  getPercent() {
    let calc = (this.step * 100) / (this.steps.length);
    return calc + this.animation;
  }

  ngOnChanges() {
    console.log(this.step, 'changes');
    this.animation = 0;
    this.doAnimation(10);

  }

  doAnimation(timeoutInterval:any) {
    if (this.animation >= 100 / (this.steps ? this.steps.length : 100)) return;
    let timeout = setTimeout(() => {
      this.doAnimation(timeoutInterval);
    }, timeoutInterval);
    this.animation += this.randomIncrease ? Math.random() : 0.5;
    timeoutInterval += 5;
    console.log(timeoutInterval);
  }
  

}
