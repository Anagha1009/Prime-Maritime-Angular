import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DetentionService } from 'src/app/services/detention.service';

@Component({
  selector: 'app-detention-waver-request',
  templateUrl: './detention-waver-request.component.html',
  styleUrls: ['./detention-waver-request.component.scss']
})
export class DetentionWaverRequestComponent implements OnInit {

  isRecords: boolean = true;
  containerList: any[] = [];
  do: string = '';
  isDO: boolean = false;
  detentionForm: FormGroup;
  selectedDetentions = {}

  constructor(
    private _dententionService: DetentionService,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {

    this.detentionForm = this._formBuilder.group({
      DO_NO: [''],
      DETENTION_LIST: new FormArray([]),
      DETENTION_LIST1: new FormArray([]),
    });
  }

  showContainers() {
    this.isDO = false;
    this.do = this.detentionForm.get('DO_NO')?.value;
    this._dententionService.getDetentionListByDO(this.do).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        var dententionDetails = this.detentionForm.get('DETENTION_LIST1') as FormArray;
        dententionDetails.clear();
        res.Data.forEach((element: any) => {
          dententionDetails.push(this._formBuilder.group({
            CONTAINER_NO: [element.CONTAINER_NO],
            PORT_OF_DISCHARGE: [element.PORT_OF_DISCHARGE],
            CONSIGNEE: [element.CONSIGNEE],
            CLEARING_PARTY: [element.CLEARING_PARTY],
            DETENTION_DAYS: [element.DETENTION_DAYS],
            DETENTION_RATE: [element.DETENTION_RATE],
            CURRENCY: [element.CURRENCY],
            REMARK: [element.REMARK]
          }))
        });
        this.isDO = true;
        this.isRecords = true;
      } else if (res.ResponseCode == 500) {
        this.isRecords = false;
      }
    });
  }

  get f() {
    var c = this.detentionForm.get('DETENTION_LIST1') as FormArray;
    return c.controls;
  }

  getContainerList(item: any, event: any) {
    const add = this.detentionForm.get('DETENTION_LIST1') as FormArray;
    if (event.target.checked) {
      for (var i: number = 0; i < add.length; i++) {
        (document.getElementById('chck' + i) as HTMLInputElement).checked =
          true;
      }
    }
    else {
      for (var i: number = 0; i < add.length; i++) {
        (document.getElementById('chck' + i) as HTMLInputElement).checked =
          false;
      }
    }
  }

  SubmitDetention() {
    const add = this.detentionForm.get('DETENTION_LIST1') as FormArray;
    const add1 = this.detentionForm.get('DETENTION_LIST') as FormArray;

    add1.clear();
    for (var i: number = 0; i < add.length; i++) {
      if ((document.getElementById('chck' + i) as HTMLInputElement).checked == true) {
        add1.push(add.controls[i]);
      }
    }

    this._dententionService.insertDetention(JSON.stringify(this.detentionForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Detention has successfully Created!');
          this._router.navigateByUrl('/home/quotation-list');
        }
      });
  }

}
