import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CONTAINER } from 'src/app/models/container';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pm-container-list',
  templateUrl: './pm-container-list.component.html',
  styleUrls: ['./pm-container-list.component.scss'],
})
export class PmContainerListComponent implements OnInit {
  filterForm: FormGroup;
  inventoryList: any[] = [];
  container: CONTAINER = new CONTAINER();
  isLoading: boolean = false;
  isLoading1: boolean = false;
  locationList: any[] = [];

  constructor(
    private _cmService: CmService,
    private _cm: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      LOCATION: [''],
    });

    this.getInventoryList();
    this.getDropdown();
  }

  getDropdown() {
    this._cm.getDropdownData('CM_LOCATION').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.locationList = res.Data;
      }
    });
  }

  Search() {
    var LOCATION = this.filterForm.value.LOCATION;

    if (LOCATION == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.container.LOCATION = LOCATION;
    this.isLoading = true;
    this.getInventoryList();
  }

  Clear() {
    this.filterForm.get('LOCATION')?.setValue('');
    this.container.LOCATION = '';
    this.isLoading1 = true;
    this.getInventoryList();
  }

  getInventoryList() {
    this._cm.destroyDT();
    this._cmService
      .getAllCMAvailableAdmin(this.container)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.inventoryList = res.Data;
        }
        this._cm.getDT();
      });
  }
}
