import { Component, OnInit } from '@angular/core';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  inventoryList: any[] = [];
  constructor(private _cmService: CmService, private _cm: CommonService) {}

  ngOnInit(): void {
    this.getInventoryList();
  }

  getInventoryList() {
    this._cm.destroyDT();
    var depocode = this._cm.getUserCode();
    this._cmService.getAllCMAvailable(depocode).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.inventoryList = res.Data;
      }
      this._cm.getDT();
    });
  }
}
