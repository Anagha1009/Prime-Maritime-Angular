import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CONTAINER } from 'src/app/models/container';
import { SIZE } from 'src/app/models/size';
import { SizeService } from 'src/app/services/size.service';

@Component({
  selector: 'app-container-size',
  templateUrl: './container-size.component.html',
  styleUrls: ['./container-size.component.scss']
})
export class ContainerSizeComponent implements OnInit {
  submitted: boolean = false;
  sizeForm: FormGroup;
  SizeList: any[] = [];
  data: any;
  isUpdate: boolean = false;
  size:SIZE;
 
  constructor(private _sizeService: SizeService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router ) { }
  ngOnInit(): void {
    this.sizeForm = this._formBuilder.group({
      ID:[0],
      CONT_SIZE: [''],
      STATUS: [''],
      CREATED_BY :[''],

    });

    this.GetContainerSizeList();
}

InsertContainerSize() {
  this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
  var status = this.sizeForm.get('STATUS')?.value;
  this.sizeForm.get('STATUS')?.setValue(status == "true" ? true : false);

  this._sizeService.postContainerSize(JSON.stringify(this.sizeForm.value)).subscribe((res: any) => {
    if (res.responseCode == 200) {
      alert('Your record has been submitted successfully !');
      this.GetContainerSizeList()
      this.ClearForm()
    }
  });
   
  }

  GetContainerSizeList() {
    var sizeModel = new SIZE();
    sizeModel.CREATED_BY = localStorage.getItem('usercode');

    this._sizeService.GetcontainerSizeList(sizeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.SizeList = res.Data;
      }
    });
   }

  GetContainerSizeDetails(containersizeId: number) {
    var containerSizeModel = new SIZE();
    containerSizeModel.CREATED_BY = localStorage.getItem('usercode');
    containerSizeModel.ID = containersizeId;
    this._sizeService.GetContainerSizeDetails(containerSizeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        console.log(res.Data);
        this.sizeForm.patchValue(res.Data)
        this.isUpdate = true;
      }
    });
  }

  UpdateContainerSize(){
    this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.sizeForm.get('STATUS')?.value;
    this.sizeForm.get('STATUS')?.setValue(status == "true" ? true : false);

    this._sizeService
      .UpdateContainerSize(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetContainerSizeList()
          this.sizeForm.setValue(this.size);
          this.ClearForm()
          this.isUpdate = false;
        }    
      });
  }

  ClearForm() {
    this.sizeForm.reset()
    this.sizeForm.get('CONT_SIZE')?.setValue('');
    this.sizeForm.get('STATUS')?.setValue(''); 
  }

  DeleteContainerSize(sizeId: number) {

    if(confirm('Are you sure want to delete this record ?')){
      var sizeModel = new SIZE();
      sizeModel.CREATED_BY = localStorage.getItem('usercode');
      sizeModel.ID = sizeId;

    this._sizeService.DeleteContainerSize(sizeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your record has been deleted successfully !');
        this.GetContainerSizeList();
      }
    });
    }
  }


}