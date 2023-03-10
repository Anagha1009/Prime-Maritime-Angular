import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit {
  isLoading: boolean = false;
  isLoading2: boolean = false;
  blDetails: any;
  invoiceForm: FormGroup;
  isBL: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this._formBuilder.group({
      INVOICE_NO: [''],
      BL_NO: [''],
      INVOICE_FOR: [''],
      INVOICE_FOR_ADDRESS: [''],
      CONTAINER_TYPE: [''],
      CHARGE_TYPE: [''],
      INVOICE_TYPE: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
    });
  }

  createInvoice() {
    this.isLoading2 = true;

    var invoiceNo = this._commonService.getRandomNumber('INV');
    this.invoiceForm.get('INVOICE_NO').setValue(invoiceNo);

    this.invoiceForm
      .get('AGENT_CODE')
      .setValue(this._commonService.getUserCode());

    this.invoiceForm
      .get('AGENT_NAME')
      .setValue(this._commonService.getUserName());

    this.invoiceForm
      .get('CREATED_BY')
      .setValue(this._commonService.getUserName());

    this._blService
      .createInvoice(JSON.stringify(this.invoiceForm.value))
      .subscribe((res: any) => {
        this.isLoading2 = false;
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Invoice is created successfully !<br> Invoice No is : ' + invoiceNo
          );
          this._router.navigateByUrl('/home/operations/invoice-list');
        }
      });
  }

  getBLDetails() {
    var BL = new Bl();
    BL.BL_NO = this.invoiceForm.get('BL_NO')?.value;
    BL.AGENT_CODE = this._commonService.getUserCode();

    this.isBL = false;
    this.isLoading = true;
    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.isLoading = false;
      if (res.ResponseCode == 200) {
        this.blDetails = res.Data;
        this.isBL = true;
      } else if (res.ResponseCode == 500) {
        this._commonService.warnMsg('Sorry ! No Records found !');
      }
    });
  }

  oncheck(ev: any) {
    if (ev == 'S') {
      this.invoiceForm
        .get('INVOICE_FOR_ADDRESS')
        .setValue(this.blDetails?.SHIPPER_ADDRESS);
    } else if (ev == 'C') {
      this.invoiceForm
        .get('INVOICE_FOR_ADDRESS')
        .setValue(this.blDetails?.CONSIGNEE_ADDRESS);
    }
  }
}
