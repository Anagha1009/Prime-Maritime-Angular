import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE } from 'src/app/models/type';
import { ContainerTypeService } from 'src/app/services/container-type.service';

@Component({
  selector: 'app-container-type',
  templateUrl: './container-type.component.html',
  styleUrls: ['./container-type.component.scss']
})
export class ContainerTypeComponent implements OnInit {
  containerTypeForm: FormGroup;
  containerTypeList: any[] = [];
  data: any;
  isUpdate: boolean = false;
  type: TYPE;

  constructor(
    private _containerTypeService: ContainerTypeService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,) { }

  ngOnInit(): void {
    this.containerTypeForm = this._formBuilder.group({
      ID:[0],
      CONT_TYPE_CODE:[''],
      CONT_TYPE:[''],
      CONT_SIZE:[''],
      ISO_CODE:[''],
      TEUS:[''],
      OUT_DIM:[''],
      STATUS:[''],
      CREATED_BY:[''],
    });

    this.GetConatinerTypeMasterList();
  }


  GetConatinerTypeMasterList() {
    var containerTypeModel = new TYPE();
    containerTypeModel.CREATED_BY = localStorage.getItem('usercode');

    this._containerTypeService
      .GetContainerTypeMasterList(containerTypeModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerTypeList = res.Data;
        }
      });
  }

  InsertContainerTypeMaster() {

    this.containerTypeForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.containerTypeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.containerTypeForm.get('STATUS')?.value;
    this.containerTypeForm.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._containerTypeService.postContainerType(JSON.stringify(this.containerTypeForm.value)).subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetConatinerTypeMasterList()
          this.ClearForm()
        }
      });
  }

  GetContainerTypeDetails(typeId: number) {

    var containerTypeModel = new TYPE();
    containerTypeModel.CREATED_BY = localStorage.getItem('usercode');
    containerTypeModel.ID = typeId;

    this._containerTypeService.GetContainerTypeDetails(containerTypeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerTypeForm.patchValue(res.Data)
        
        this.isUpdate = true;
      }
    });
  }

  UpdateContainerTypeMaster(){
    this.containerTypeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.containerTypeForm.get('STATUS')?.value;
    this.containerTypeForm.get('STATUS')?.setValue(status == "true" ? true : false);

    console.log("sfds " + JSON.stringify(this.containerTypeForm.value))
    this._containerTypeService
      .updateContainerType(JSON.stringify(this.containerTypeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetConatinerTypeMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }


   DeleteConatinerTypemaster(ID: number) {
     debugger;
     if (confirm('Are you sure want to delete this record ?')) {
       this._containerTypeService.DeleteContainerType(ID).subscribe((res: any) => {
         if (res.ResponseCode == 200) {
           alert('Your record has been deleted successfully !');
           this.GetConatinerTypeMasterList();
         }
       });
     }
   }

   ClearForm(){
    this.containerTypeForm.reset()
   

  }
  
}






