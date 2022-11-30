import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit {
  portForm: FormGroup;
  PortList: any;
  data: any;
  isUpdate: boolean = false;

  constructor(private _masterService: MasterService, private _commonService: CommonService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,) { }

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
    this._commonService.getDropdownData("PORT").subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.PortList = res.Data;
      }
    })
  }

  InsertPortMasterList() {
    debugger
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == "true" ? true : false);
    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService.InsertMaster(JSON.stringify(this.portForm.value)).subscribe((res: any) => {
      if (res.responseCode == 200) {
        alert('Your record has been submitted successfully !');
        this.GetPortMasterList()

      }
    });

  }

  GetPortMasterDetails(code:string) {
    var portModel = new MASTER();
    portModel.CREATED_BY = localStorage.getItem('usercode');
    portModel.CODE = code;

    // this._masterService.GetMasterDetails(portModel).subscribe((res: any) => {
    //   if (res.ResponseCode == 200) {
    //     this.portForm.patchValue(res.Data)
    //     this.isUpdate = true;
    //   }
    // });
  }

  UpdatePortMaster() {
    debugger
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == "true" ? true : false);

    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .UpdateMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Port  master has been Updated successfully !');
          this.GetPortMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }

  DeletePortMaster(code:string){
    if (confirm('Are you sure want to delete this record ?')) {
      var currencyModel = new MASTER();
      currencyModel.CREATED_BY = localStorage.getItem('usercode');
      currencyModel.CODE = code;

      // this._masterService.DeleteMaster(currencyModel).subscribe((res: any) => {
      //   if (res.ResponseCode == 200) {
      //     alert('Your record has been deleted successfully !');
      //     //this.GetCurrencyMasterList();
      //   }
      // });
    }

  }

  ClearForm() {
    this.portForm.reset()
    this.portForm.get('KEY_NAME')?.setValue('');
    this.portForm.get('CODE')?.setValue('');
    this.portForm.get('CODE_DESC')?.setValue('');
    this.portForm.get('STATUS')?.setValue('');
  }




}
