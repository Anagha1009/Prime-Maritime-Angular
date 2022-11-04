import { Component, OnInit } from '@angular/core';
import { DO } from 'src/app/models/do';
import { DoService } from 'src/app/services/do.service';

@Component({
  selector: 'app-do-details',
  templateUrl: './do-details.component.html',
  styleUrls: ['./do-details.component.scss']
})
export class DoDetailsComponent implements OnInit {
  do:any;
  containerList:any[]=[];
  constructor(private _dOService: DoService,) { }

  ngOnInit(): void {
    this.getDoDetails();
  }

  getDoDetails() {
    var myDo = new DO();
    myDo.AGENT_CODE = localStorage.getItem('usercode');
    myDo.DO_NO = localStorage.getItem('DO_NO');
    this._dOService.getDODetails(myDo).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.do = res.Data;
        //this.containerList = res.Data.SRR_CONTAINERS;
      }
    });
  }

}
