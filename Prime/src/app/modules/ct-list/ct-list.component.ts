import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CmService } from 'src/app/services/cm.service';

@Component({
  selector: 'app-ct-list',
  templateUrl: './ct-list.component.html',
  styleUrls: ['./ct-list.component.scss']
})
export class CtListComponent implements OnInit {
  previewDetails:boolean=false;
  previewNoData:boolean=false;
  conNo:any='';
  ctList:any[]=[];



  constructor(private _cmService:CmService,private _router:Router) { }

  ngOnInit(): void {
  }

  getTrackingHistoryList(){
    debugger;
    this.previewDetails=false;
    this.previewNoData=false;
    if(this.conNo==''){
      alert('Please enter container number');
    }
    else{
      this._cmService.getTrackingHistory(this.conNo).subscribe(
        (res: any) => {
          debugger;
          this.ctList = [];
          //this.isScroll = false;
          if (res.ResponseCode == 200) {
            if (res.Data?.length > 0) {
              this.ctList = res.Data;
              this.previewDetails=true;
              // if (this.doList?.length >= 4) {
              //   this.isScroll = true;
              // } else {
              //   this.isScroll = false;
              // }
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

    }
  
  }

}
