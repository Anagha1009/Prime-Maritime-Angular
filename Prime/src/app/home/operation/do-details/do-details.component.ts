import { Component, OnInit } from '@angular/core';
import { Bl } from 'src/app/models/bl';
import { DO } from 'src/app/models/do';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { DoService } from 'src/app/services/do.service';

@Component({
  selector: 'app-do-details',
  templateUrl: './do-details.component.html',
  styleUrls: ['./do-details.component.scss'],
})
export class DoDetailsComponent implements OnInit {
  do: any;
  containerList: any[] = [];
  showList: boolean = false;
  constructor(
    private _dOService: DoService,
    private _blService: BlService,
    private _cs: CommonService
  ) {}

  ngOnInit(): void {
    this.getDoDetails();
    //this.getContainerList();
  }

  getDoDetails() {
    var myDo = new DO();

    myDo.AGENT_CODE = this._cs.getUserCode();
    myDo.DO_NO = localStorage.getItem('DO_NO');
    this._dOService.getDODetails(myDo).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.do = res.Data;
      }
    });
    var bl = new Bl();
    bl.AGENT_CODE = this._cs.getUserCode();
    bl.DO_NO = localStorage.getItem('DO_NO');
    this._blService.getContainerList(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerList = res.Data;
        if (this.containerList?.length > 0) {
          this.showList = true;
        }
      }
    });
  }
}
