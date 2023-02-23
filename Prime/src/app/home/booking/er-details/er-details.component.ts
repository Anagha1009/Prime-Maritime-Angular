import { Component, OnInit } from '@angular/core';
import { ER } from 'src/app/models/er';
import { CommonService } from 'src/app/services/common.service';
import { ErService } from 'src/app/services/er.service';

@Component({
  selector: 'app-er-details',
  templateUrl: './er-details.component.html',
  styleUrls: ['./er-details.component.scss'],
})
export class ErDetailsComponent implements OnInit {
  er: any;
  repoNo: any = '';
  agentCode: any = '';
  depoCode: any = '';
  containerList: any[] = [];
  erRateList: any[] = [];
  showList: boolean = false;
  showRateList: boolean = false;
  constructor(private _erService: ErService, private _cs: CommonService) {}

  ngOnInit(): void {
    this.getErDetails();
    //this.getContainerList();
  }

  getErDetails() {
    if (this._cs.getUser().roleCode == '1') {
      this.agentCode = this._cs.getUserCode();
    }
    if (this._cs.getUser().roleCode == '3') {
      this.depoCode = this._cs.getUserCode();
    }
    this.repoNo = localStorage.getItem('ER_NO');
    this._erService
      .getERDetails(this.repoNo, this.agentCode, this.depoCode)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.er = res.Data;
          console.log(this.er);
        }
      });
    this._erService
      .getERContainerDetails(this.repoNo, this.agentCode, this.depoCode)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
          if (this.containerList?.length > 0) {
            this.showList = true;
          }
        }
      });
    this._erService.getERRateDetails(this.repoNo).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.erRateList = res.Data;
        if (this.erRateList?.length > 0) {
          this.showRateList = true;
        }
      }
    });
  }
}
