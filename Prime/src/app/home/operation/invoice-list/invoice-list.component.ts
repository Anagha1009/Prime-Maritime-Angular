import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoiceList: any[] = [];
  filterForm: FormGroup;
  bl: Bl = new Bl();

  constructor(
    private _blService: BlService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      INVOICE_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getInvoiceList();
  }

  Search() {
    var INVOICE_NO =
      this.filterForm.value.INVOICE_NO == null
        ? ''
        : this.filterForm.value.INVOICE_NO;
    var FROM_DATE =
      this.filterForm.value.FROM_DATE == null
        ? ''
        : this.filterForm.value.FROM_DATE;
    var TO_DATE =
      this.filterForm.value.TO_DATE == null
        ? ''
        : this.filterForm.value.INVOICE_NO;

    if (INVOICE_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.INVOICE_NO = INVOICE_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.getInvoiceList();
  }

  Clear() {
    this.filterForm.reset();
    this.bl = new Bl();

    this.getInvoiceList();
  }

  getInvoiceList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this._commonService.destroyDT();

    this._blService.getinvoiceList(this.bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.invoiceList = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
