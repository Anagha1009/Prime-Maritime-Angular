import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DO } from 'src/app/models/do';
import { DoService } from 'src/app/services/do.service';

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss']
})
export class DoListComponent implements OnInit {
  dO=new DO();
  doList:any[]=[];
  isScroll: boolean = false;

  constructor(private _dOService: DoService,private _router: Router) { }

  ngOnInit(): void {
    this.getDOList();
  }

  getDOList(){
    debugger;
    this.dO.AGENT_CODE = localStorage.getItem('usercode');
    this._dOService.getDOList(this.dO).subscribe(
      (res: any) => {
        this.doList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.doList = res.Data;

            if (this.doList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
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

  getDODetails(doNo:any){

  }

}
