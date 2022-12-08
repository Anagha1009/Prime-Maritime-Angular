import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DO } from 'src/app/models/do';
import { DoService } from 'src/app/services/do.service';

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss']
})
export class DoListComponent implements OnInit {
  dO=new DO();
  doList:any[]=[];
  isScroll: boolean = false;
  doListForm:FormGroup;
  previewNoData:boolean=false;
  previewList:boolean=false;

  constructor(private _dOService: DoService,private _router: Router,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.doListForm = this._formBuilder.group({
      DO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: ['']
    });
    this.getDOList();
  }

  getDOList(){
    debugger;
    this.previewList=false;
    this.previewNoData=false;
    this.dO.AGENT_CODE = localStorage.getItem('usercode');
    this.dO.OPERATION = 'GET_DOLIST';
    this._dOService.getDOList(this.dO).subscribe(
      (res: any) => {
        debugger;
        this.doList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.doList = res.Data;
            this.previewList=true;
            if (this.doList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
          
        }
        if (res.ResponseCode == 500) {
          this.previewNoData=true;
        }
      },
      (error: any) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this._router.navigateByUrl('login');
        }
      }
    );

  }

  Search() {
    var DO_NO = this.doListForm.value.DO_NO;
    var FROM_DATE = this.doListForm.value.FROM_DATE;
    var TO_DATE = this.doListForm.value.TO_DATE;
    if (
      DO_NO == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }
    this.dO.DO_NO = DO_NO;
    this.dO.DO_DATE = FROM_DATE;
    this.dO.DO_VALIDITY = TO_DATE;

    this.getDOList();
  }

  Clear() {
    this.doListForm.get('DO_NO')?.setValue('');
    this.doListForm.get('FROM_DATE')?.setValue('');
    this.doListForm.get('TO_DATE')?.setValue('');

    this.dO.DO_NO = '';
    this.dO.DO_DATE = '';
    this.dO.DO_VALIDITY = '';

    this.getDOList();
  }

  getDODetails(doNo:any){
    debugger;
    localStorage.setItem('DO_NO', doNo);
    this._router.navigateByUrl('home/do-details');
  }

}
