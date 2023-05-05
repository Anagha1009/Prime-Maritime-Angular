import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { SrrReportService } from 'src/app/services/srr-report.service';

@Component({
  selector: 'app-detention',
  templateUrl: './detention.component.html',
  styleUrls: ['./detention.component.scss'],
})
export class DetentionComponent implements OnInit {
  containerDetentionList: any[] = [];

  constructor(
    private _commonService: CommonService,
    private _srrReportService: SrrReportService
  ) {}

  ngOnInit(): void {
    this.GetDetentionList();
  }

  GetDetentionList() {
    this._commonService.destroyDT();
    this._srrReportService.getContainerDetentionList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerDetentionList = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
