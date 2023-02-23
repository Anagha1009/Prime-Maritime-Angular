import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DETENTION } from 'src/app/models/detention';
import { CommonService } from 'src/app/services/common.service';
import { DetentionService } from 'src/app/services/detention.service';

@Component({
  selector: 'app-detention-list',
  templateUrl: './detention-list.component.html',
  styleUrls: ['./detention-list.component.scss'],
})
export class DetentionListComponent implements OnInit {
  isScroll: boolean;

  constructor(
    private detentionService: DetentionService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getDetentionList();
  }

  getDetentionList() {
    var detention = new DETENTION();
    detention.AGENT_CODE = this._commonService.getUserCode();

    this.detentionService.getDetentionList(detention).subscribe((res: any) => {
      this.isScroll = false;
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.getDetentionList = res.Data;

          if (this.getDetentionList?.length >= 4) {
            this.isScroll = true;
          } else {
            this.isScroll = false;
          }
        }
      }
    });
  }
}
