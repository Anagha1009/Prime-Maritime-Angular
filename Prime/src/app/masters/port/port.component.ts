import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
})
export class PortComponent implements OnInit {
  portForm: FormGroup;
  PortList: any;
  data: any;
  isUpdate: boolean = false;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.portForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      PARENT_CODE: [''],
      CREATED_BY: [''],
    });
    this.GetPortMasterList();
  }

  GetPortMasterList() {
    this._masterService.GetMasterList('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.PortList = res.Data;
      }
    });
  }

  InsertPortMaster() {
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .InsertMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetPortMasterList();
          this.ClearForm();
        }
      });
  }

  GetPortMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdatePortMaster() {
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .UpdateMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your  Port master has been Updated successfully !');
          this.GetPortMasterList();
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  DeletePortMaster(ID: number) {
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetPortMasterList();
        }
      });
    }
  }

  ClearForm() {
    this.portForm.reset();
  }
}
