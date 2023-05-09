import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CONTAINER } from 'src/app/models/container';
import { CommonService } from 'src/app/services/common.service';
import { ContainerService } from 'src/app/services/container.service';
import { DepoService } from 'src/app/services/depo.service';
import { locale as english } from 'src/app/@core/translate/mnr/en';
import { locale as hindi } from 'src/app/@core/translate/mnr/hi';
import { locale as arabic } from 'src/app/@core/translate/mnr/ar';
import { Router } from '@angular/router';
import { Mr } from 'src/app/models/mr';

@Component({
  selector: 'app-mr-request',
  templateUrl: './mr-request.component.html',
  styleUrls: ['./mr-request.component.scss'],
})
export class MrRequestComponent implements OnInit {
  mrForm: FormGroup;
  fileList: any[] = [];
  total: number = 0;
  componentList: any[] = [];
  damageList: any[] = [];
  repairList: any[] = [];
  images: any[] = [];
  imageUploads: any[] = [];
  containerNo: string = '';
  containerDetails: any;
  isContainer: boolean = false;
  isRecords: boolean = true;
  lengthList: any[] = [];
  widthList: any[] = [];
  heightList: any[] = [];
  quantityList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _depoService: DepoService,
    private _commonService: CommonService,
    private _containerService: ContainerService,
    private _coreTranslationService: CoreTranslationService,
    private _router: Router
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {}

  getAllDetails() {
    this.mrForm = this._formBuilder.group({
      MR_LIST: new FormArray([
        this._formBuilder.group({
          MR_NO: [''],
          CONTAINER_NO: [''],
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
          TAX: [0],
          FINAL_TOTAL: [0],
          DEPO_CODE: [''],
          REMARKS: [''],
          CREATED_BY: [''],
        }),
      ]),
    });

    this.GetComponentMasterList();
    this.GetDamageMasterList();
    this.GetRepairMasterList();
  }

  getContainerDetails() {
    var container = new CONTAINER();
    container.CONTAINER_NO = this.containerNo;
    if (this.containerNo == '') {
      this.isRecords = false;
      this.isContainer = false;
    } else {
      this.isContainer = false;
      this._containerService
        .GetContainerMasterDetails(container)
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.containerDetails = res.Data;
            this.isContainer = true;
            this.isRecords = true;
            this.getAllDetails();
          } else if (res.ResponseCode == 500) {
            this.isRecords = false;
            this.isContainer = false;
          }
        });
    }
  }
  getRepairList(i: number) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var component = add.at(i).get('COMPONENT').value;
    if (component) {
      return this.repairList.filter((x) => x.CODE_DESC == component);
    }
    return [];
    // console.log(component);
  }
  Sum(index: number) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var labour = add.at(index)?.get('LABOUR')?.value;
    var material = add.at(index)?.get('MATERIAL')?.value;

    var totalAmount = +labour + +material;
    return Math.round(totalAmount * 100) / 100;
  }

  LabourCount(index: number) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var mh = add.at(index)?.get('MAN_HOUR')?.value;
    var totalAmount = +mh * 60;
    add
      .at(index)
      ?.get('LABOUR')
      ?.setValue(Math.round(totalAmount * 100) / 100);
  }

  ManHourSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var mh = add.at(i)?.get('MAN_HOUR')?.value;
      totalAmount += +mh;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  LabourSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var labour = add.at(i)?.get('LABOUR')?.value;
      totalAmount += +labour;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  MaterialSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var material = add.at(i)?.get('MATERIAL')?.value;
      totalAmount += +material;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TotalSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      totalAmount += +this.Sum(i);
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TotalFreshDamageSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      if (add.at(i)?.get('RESPONSIBILITY')?.value != 'O') {
        totalAmount += +this.Sum(i);
      }
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TaxTotal() {
    var total = this.TotalSum();
    return Math.round(total * 18) / 100;
  }

  TotalWTSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      if (add.at(i)?.get('RESPONSIBILITY')?.value == 'O') {
        totalAmount += +this.Sum(i);
      }
    }
    return Math.round(totalAmount * 100) / 100;
  }

  FinalTotal() {
    var totalAmount = 0;
    totalAmount += +this.TotalSum() + +this.TaxTotal();
    return Math.round(totalAmount * 100) / 100;
  }

  submitRequest() {
    var mrList = this.mrForm.get('MR_LIST');
    var mrNo = this._commonService.getRandomNumber('MR');
    for (var i = 0; i < mrList?.value.length; i++) {
      this.mrForm.value.MR_LIST[i].CONTAINER_NO = this.containerNo;
      this.mrForm.value.MR_LIST[i].TAX = this.TaxTotal();
      this.mrForm.value.MR_LIST[i].FINAL_TOTAL = this.FinalTotal();
      this.mrForm.value.MR_LIST[i].MR_NO = mrNo;
      this.mrForm.value.MR_LIST[i].DEPO_CODE =
        this._commonService.getUserCode();
      this.mrForm.value.MR_LIST[i].CREATED_BY =
        this._commonService.getUserName();
    }
    //console.log(this.mrForm.value.MR_LIST[0].MR_NO);

    var MR = this.mrForm.value.MR_LIST[0].MR_NO;

    this._depoService
      .createMRRequest(JSON.stringify(mrList?.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.uploadFilestoDB(MR);
          this._commonService.successMsg(
            'Your MnR request is submitted successfully <br> MnR No is ' + mrNo
          );
          this._router.navigateByUrl('/home/depo/mr-request-list');
        }
      });
  }

  addNew() {
    const add = this.mrForm.get('MR_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        MR_NO: [''],
        CONTAINER_NO: [''],
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
        TAX: [0],
        FINAL_TOTAL: [0],
        REMARKS: [''],
      })
    );
  }

  removeItem(i: any) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    add.removeAt(i);
  }

  get f() {
    var x = this.mrForm.get('MR_LIST') as FormArray;
    return x.controls;
  }

  f1(i: any) {
    return i;
  }

  // FILE UPLOAD

  fileUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.images.push(event.target.result);

          this.mrForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
        this.imageUploads.push(event.target.files[i]);
      }
    }
  }

  uploadFilestoDB(MR: string) {
    const payload = new FormData();
    //console.log(this.imageUploads)
    this.imageUploads.forEach((element: any) => {
      payload.append('formFile', element);
    });

    this._depoService.uploadFiles(payload, MR).subscribe();
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

  GetLengthMasterList(i: number) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var component = add.at(i).get('COMPONENT').value;
    var repair = add.at(i).get('REPAIR').value;
    this._commonService
      .getDropdownData('MNR_LENGTH', '', component, 0, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.lengthList = res.Data;
        }
      });
    this._commonService
      .getDropdownData('MNR_WIDTH', '', component, 0, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.widthList = res.Data;
        }
      });
    this._commonService
      .getDropdownData('MNR_HEIGHT', '', component, 0, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.heightList = res.Data;
        }
      });
    this._commonService
      .getDropdownData('MNR_QUANTITY', '', component, 0, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.quantityList = res.Data;
        }
      });
  }

  getMNTTariff(i: number) {
    var mr = new Mr();
    const add = this.mrForm.get('MR_LIST') as FormArray;
    mr.COMPONENT = add.at(i).get('COMPONENT').value;
    mr.REPAIR = add.at(i).get('REPAIR').value;
    mr.LENGTH = add.at(i).get('LENGTH').value;
    mr.WIDTH = add.at(i).get('WIDTH').value;
    mr.HEIGHT = add.at(i).get('HEIGHT').value;
    mr.QUANTITY = add.at(i).get('UNIT').value;
    this._depoService.getMNRTariff(mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        add.at(i).get('MAN_HOUR').setValue(res.Data.MAN_HOUR);
        add.at(i).get('LABOUR').setValue(res.Data.LABOUR_CHARGE);
        add.at(i).get('MATERIAL').setValue(res.Data.MATERIAL_COST);
        add.at(i).get('TOTAL').setValue(res.Data.TOTAL);
      }
    });
  }

  Clear() {
    this.isContainer = false;

    const add = this.mrForm.get('MR_LIST') as FormArray;
    add.clear();
    add.push(
      this._formBuilder.group({
        MR_NO: [''],
        CONTAINER_NO: [''],
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
        TAX: [0],
        FINAL_TOTAL: [0],
        REMARKS: [''],
      })
    );
    this.images = [];

    this.containerNo = '';
  }

  removeFile(url: any) {
    this.images = this.images.filter((a) => a !== url);
  }
}
