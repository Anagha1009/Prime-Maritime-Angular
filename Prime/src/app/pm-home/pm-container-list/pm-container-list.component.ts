import { Component, OnInit } from '@angular/core';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pm-container-list',
  templateUrl: './pm-container-list.component.html',
  styleUrls: ['./pm-container-list.component.scss'],
})
export class PmContainerListComponent implements OnInit {
  inventoryList: any[] = [];
  constructor(private _cmService: CmService, private _cm: CommonService) {}

  ngOnInit(): void {
    this.getInventoryList();
  }

  getInventoryList() {
    this._cm.destroyDT();
    this._cmService.getAllCMAvailableAdmin().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.inventoryList = res.Data;
      }
      this._cm.getDT();
    });
  }
}
