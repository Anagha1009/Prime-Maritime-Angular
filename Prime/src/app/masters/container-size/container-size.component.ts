import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-container-size',
  templateUrl: './container-size.component.html',
  styleUrls: ['./container-size.component.scss'],
})
export class ContainerSizeComponent implements OnInit {
  submitted: boolean = false;
  sizeForm: FormGroup;
  SizeList: any[] = [];
  isUpdate: boolean = false;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sizeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: [''],
    });

    this.GetContainerSizeList();
  }


   get f(){
return this.sizeForm.controls;
}

  InsertContainerSize() {
this.submitted=true
if(this.sizeForm.invalid){
  return
}
    this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.sizeForm.get('STATUS')?.value;
    this.sizeForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.sizeForm.get('KEY_NAME')?.setValue('CONTAINER_SIZE');

    this._masterService
      .InsertMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetContainerSizeList();
          this.ClearForm();
        }
      });
  }

  GetContainerSizeList() {
    this._masterService
      .GetMasterList('CONTAINER_SIZE')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.SizeList = res.Data;
        }
      });
  }

  GetContainerSizeDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        console.log(res.Data);
        this.sizeForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdateContainerSize() {
    this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.sizeForm.get('STATUS')?.value;
    this.sizeForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    this._masterService
      .UpdateMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetContainerSizeList();
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  ClearForm() {
    this.sizeForm.reset();
    this.sizeForm.get('STATUS')?.setValue('');
  }

  DeleteContainerSize(ID: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetContainerSizeList();
        }
      });
    }
  }
}
