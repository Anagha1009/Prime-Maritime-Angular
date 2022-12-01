import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DepoService } from 'src/app/services/depo.service';

@Component({
  selector: 'app-mr-request',
  templateUrl: './mr-request.component.html',
  styleUrls: ['./mr-request.component.scss'],
})
export class MrRequestComponent implements OnInit {
  mrForm: FormGroup;
  fileList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _depoService: DepoService
  ) {}

  ngOnInit(): void {
    this.mrForm = this._formBuilder.group({
      MR_LIST: new FormArray([
        this._formBuilder.group({
          CONTAINER_NO: ['434354545'],
          LOCATION: [''],
          COMPONENT: [''],
          DAMAGE: [''],
          REPAIR: [''],
          DESC: [''],
          LENGTH: [''],
          WIDTH: [''],
          HEIGHT: [''],
          UNIT: [''],
          RESPONSIBILITY: [''],
          MAN_HOUR: [''],
          LABOUR: [''],
          MATERIAL: [''],
          TOTAL: ['0'],
        }),
      ]),
    });
  }

  submitRequest() {
    var mrList = this.mrForm.get('MR_LIST');
    console.log(JSON.stringify(mrList?.value));
    this._depoService
      .createMRRequest(JSON.stringify(mrList?.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your request is submitted successfully !');
        }
      });
  }

  addNew() {
    const add = this.mrForm.get('MR_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        CONTAINER_NO: ['434354545'],
        LOCATION: [''],
        COMPONENT: [''],
        DAMAGE: [''],
        REPAIR: [''],
        DESC: [''],
        LENGTH: [''],
        WIDTH: [''],
        HEIGHT: [''],
        UNIT: [''],
        RESPONSIBILITY: [''],
        MAN_HOUR: [''],
        LABOUR: [''],
        MATERIAL: [''],
        TOTAL: ['0'],
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
    if (
      event.target.files[0].type == 'application/pdf' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
    } else {
      alert('Please Select PDF or Excel or Word Format only');
      return;
    }

    if (+event.target.files[0].size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    }

    this.fileList.push(event.target.files[0]);
    console.log(this.fileList);
  }

  uploadFilestoDB() {
    const payload = new FormData();
    this.fileList.forEach((element: any) => {
      payload.append('formFile', element);
    });

    //this._srrService.uploadFiles(payload).subscribe();
  }
}
