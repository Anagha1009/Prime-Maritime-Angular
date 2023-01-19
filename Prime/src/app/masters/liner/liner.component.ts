import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINER } from 'src/app/models/liner';
import { LinerService } from 'src/app/services/liner.service';

@Component({
  selector: 'app-liner',
  templateUrl: './liner.component.html',
  styleUrls: ['./liner.component.scss']
})
export class LinerComponent implements OnInit {
  LinerForm:FormGroup;
  LinerList:any[]=[];
  submitted: boolean;
  isUpdate: boolean = false;
  liner:LINER;



  constructor(private _formBuilder: FormBuilder,
    private _linerService:LinerService ,
    private route: ActivatedRoute,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.LinerForm = this._formBuilder.group({
      ID: [0],
      NAME: ['',Validators.required],
      CODE: ['',Validators.required],
      DESCRIPTION: ['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: [''],
    });

    this.GetLinerList();

    
  }

  GetLinerList() {
    this._linerService.getLinerList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        
        this.LinerList = res.Data;
        console.log(res.Data)
      }
    });
  }

 get f(){
    return this.LinerForm.controls;
  }

  GetLinerDetails(ID: number) {
    var linerModel = new LINER();
  
    linerModel.ID = ID;

    this._linerService.GetLinerDetails(linerModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.LinerForm.patchValue(res.Data)        
         this.isUpdate = true;

      }
    });
  }

  InsertLinerMaster() {
    this.submitted=true
    if(this.LinerForm.invalid){
      return
    }
    this.LinerForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.LinerForm.get('STATUS')?.value;
    this.LinerForm.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._linerService.postLiner(JSON.stringify(this.LinerForm.value)).subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetLinerList()
          // this.ClearForm()
        }
      });
  }

  DeleteLinerList(ID: number) {
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      var linerModel = new LINER();
      linerModel.CREATED_BY = localStorage.getItem('username');
      linerModel.ID = ID;
  
      this._linerService
        .deleteLiner(linerModel)
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            alert('Your record has been deleted successfully !');
            this.GetLinerList()
          }
        });
    }
  }

  UpdateLiner() {
    debugger;
    this.LinerForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.LinerForm.get('STATUS')?.value;
    this.LinerForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    console.log('sfds ' + JSON.stringify(this.LinerForm.value));
    this._linerService
      .updateliner(JSON.stringify(this.LinerForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetLinerList()
          this.LinerForm.setValue(this.liner);
         this.ClearForm();
          this.isUpdate = false;
        }
      });
  }
  ClearForm(){
    this.LinerForm.reset();
  }

}
