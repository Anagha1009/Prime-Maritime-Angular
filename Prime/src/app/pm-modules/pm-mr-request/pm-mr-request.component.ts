import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Mr, MR_DETAILS } from 'src/app/models/mr';
import { CommonService } from 'src/app/services/common.service';
import { DepoService } from 'src/app/services/depo.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pm-mr-request',
  templateUrl: './pm-mr-request.component.html',
  styleUrls: ['./pm-mr-request.component.scss'],
})
export class PmMrRequestComponent implements OnInit {
  mr = new Mr();
  mrList: any[] = [];
  mrDetailsList: any[] = [];
  mrForm: FormGroup;
  componentList: any[] = [];
  damageList: any[] = [];
  repairList: any[] = [];
  isDeleted: boolean = false;
  imgList: any[] = [];
  BASE_URL: string = environment.BASE_URL2;

  @ViewChild('MRModal') MRModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _depoService: DepoService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.mrForm = this._formBuilder.group({
      MR_REQ: new FormArray([]),
      MR_REQ1: new FormArray([]),
    });

    this.getMRList();
  }

  f(i: any) {
    return i;
  }

  getMRList() {
    this.mr.OPERATION = 'GET_MNR_LIST_PM';
    this._depoService.getMRList(this.mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrList = res.Data;
      }
    });
  }

  getDetails(MR_NO: string) {
    var mr = new MR_DETAILS();
    mr.MR_NO = MR_NO;
    mr.OPERATION = 'GET_MR_REQ_DETAILS_PM';
    this._depoService.getMRDetails(mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrDetailsList = res.Data;
        //console.log("Details" + JSON.stringify(res.Data));
        const add = this.mrForm.get('MR_REQ') as FormArray;
        const add1 = this.mrForm.get('MR_REQ1') as FormArray;
        add1.clear();
        add.clear();
        res.Data.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });
        this.TaxTotal();
        this.FinalTotal();
        this.MRModal.nativeElement.click();
      }
    });
    //console.log(MR_NO);
    this._depoService.GetFiles(MR_NO).subscribe((res: any) => {
      if (res.responseCode == 200) {
        this.imgList = res.data;
        //console.log("Images-" + JSON.stringify(res.data));
      }
    });
  }

  download(filePath: string) {
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filePath.replace(/^.*[\\\/]/, '');
        link.click();
      })
      .catch(console.error);
  }

  get f1() {
    var r = this.mrForm.get('MR_REQ') as FormArray;
    return r.controls;
  }

  get f2() {
    var r = this.mrForm.get('MR_REQ1') as FormArray;
    return r.controls;
  }

  approveRate(status: string) {
    var mrList = this.mrForm.get('MR_REQ');
    for (var i = 0; i < mrList?.value.length; i++) {
      this.mrForm.value.MR_REQ[i].TAX = this.TaxTotal();
      this.mrForm.value.MR_REQ[i].FINAL_TOTAL = this.FinalTotal();
      this.mrForm.value.MR_REQ[i].STATUS = status;
    }

    this._depoService
      .approveRate(this.mrForm.value.MR_REQ)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.submitRequest();
          alert('Rates are approved successfully !');
          this.closeBtn.nativeElement.click();
          this.getMRList();
        }
      });
  }

  addNew() {
    const add = this.mrForm.get('MR_REQ1') as FormArray;

    add.push(
      this._formBuilder.group({
        LOCATION: [''],
        COMPONENT: [''],
        DAMAGE: [''],
        REPAIR: [''],
        DESC: [''],
        LENGTH: [0],
        WIDTH: [0],
        HEIGHT: [0],
        UNIT: [''],
        RESPONSIBILITY: [''],
        MAN_HOUR: [0],
        LABOUR: [0],
        MATERIAL: [0],
        TOTAL: [0],
        REMARKS: [''],
      })
    );
    this.GetComponentMasterList();
    this.GetDamageMasterList();
    this.GetRepairMasterList();
  }

  GetComponentMasterList() {
    this._commonService.getDropdownData('COMPONENT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.componentList = res.Data;
      }
    });
  }

  GetDamageMasterList() {
    this._commonService.getDropdownData('DAMAGE').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.damageList = res.Data;
      }
    });
  }

  GetRepairMasterList() {
    this._commonService.getDropdownData('REPAIR').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.repairList = res.Data;
      }
    });
  }

  LabourCount(index: number) {
    const add = this.mrForm.get('MR_REQ1') as FormArray;
    var mh = add.at(index)?.get('MAN_HOUR')?.value;
    var totalAmount = +mh * 60;
    add
      .at(index)
      ?.get('LABOUR')
      ?.setValue(Math.round(totalAmount * 100) / 100);
  }

  Sum(index: number) {
    const add = this.mrForm.get('MR_REQ1') as FormArray;
    var labour = add.at(index)?.get('LABOUR')?.value;
    var material = add.at(index)?.get('MATERIAL')?.value;
    var totalAmount = +labour + +material;
    console.log('Sum' + totalAmount);
    return Math.round(totalAmount * 100) / 100;
  }

  removeItem(i: any) {
    const add = this.mrForm.get('MR_REQ1') as FormArray;
    add.removeAt(i);
  }

  submitRequest() {
    var mrList = this.mrForm.get('MR_REQ1');
    for (var i = 0; i < mrList?.value.length; i++) {
      this.mrForm.value.MR_REQ1[i].CONTAINER_NO =
        this.mrDetailsList[0].CONTAINER_NO;
      this.mrForm.value.MR_REQ1[i].TAX = this.TaxTotal();
      this.mrForm.value.MR_REQ1[i].FINAL_TOTAL = this.FinalTotal();
      this.mrForm.value.MR_REQ1[i].MR_NO = this.mrDetailsList[0].MR_NO;
      this.mrForm.value.MR_REQ1[i].DEPO_CODE =
        this._commonService.getUserCode();
      this.mrForm.value.MR_REQ1[i].CREATED_BY =
        this._commonService.getUserName();
    }

    this._depoService
      .createNewMRRequest(JSON.stringify(mrList?.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
        }
      });
  }

  TotalSum() {
    const add1 = this.mrForm.get('MR_REQ1') as FormArray;

    var totalAmount = 0;
    for (var i = 0; i < this.mrDetailsList.length; i++) {
      totalAmount += this.mrDetailsList[i].TOTAL;
    }

    for (var i = 0; i < add1.length; i++) {
      totalAmount += +this.Sum(i);
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TaxTotal() {
    var total = this.TotalSum();
    return Math.round(total * 18) / 100;
  }

  FinalTotal() {
    var totalAmount = 0;
    var x = +this.TotalSum();
    var y = +this.TaxTotal();
    totalAmount += +this.TotalSum() + +this.TaxTotal();
    return Math.round(totalAmount * 100) / 100;
  }

  removeMR(i: any) {
    if (confirm('Are you sure you want to delete this?')) {
      const add = this.mrForm.get('MR_REQ') as FormArray;
      var location = add.at(i)?.get('LOCATION')?.value;
      var Mrno = add.at(i)?.get('MR_NO')?.value;
      this._depoService
        .DeleteMRRequest(Mrno, location)
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
          }
        });
    }
  }
}
