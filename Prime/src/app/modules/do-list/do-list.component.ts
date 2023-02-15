import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { DO } from 'src/app/models/do';
import { BlService } from 'src/app/services/bl.service';
import { DoService } from 'src/app/services/do.service';
import { locale as english } from 'src/app/@core/translate/do/en';
import { locale as hindi } from 'src/app/@core/translate/do/hi';
import { locale as arabic } from 'src/app/@core/translate/do/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss'],
})
export class DoListComponent implements OnInit {
  dO = new DO();
  doList: any[] = [];
  containerList: any[] = [];
  isScroll: boolean = false;
  doListForm: FormGroup;
  previewNoData: boolean = false;
  previewList: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _dOService: DoService,
    private _blService: BlService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private _cs: CommonService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.doListForm = this._formBuilder.group({
      DO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });
    this.getDOList();
  }

  getDOList() {
    debugger;
    this.previewList = false;
    this.previewNoData = false;

    this.dO.AGENT_CODE = this._cs.getUserCode();
    this.dO.OPERATION = 'GET_DOLIST';
    this.isLoading = true;
    this._dOService.getDOList(this.dO).subscribe(
      (res: any) => {
        this.doList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.doList = res.Data;
            //getContainerCount
            this.getContainerCount();
            this.previewList = true;
            this.isLoading = false;
            if (this.doList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
        if (res.ResponseCode == 500) {
          this.previewNoData = true;
          this.isLoading = false;
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

  getContainerCount() {
    this.doList.forEach((element: { DO_NO: any; ContainerCount: any }) => {
      this.containerList = [];
      var bl = new Bl();
      bl.AGENT_CODE = this._cs.getUserCode();
      bl.DO_NO = element.DO_NO;
      this._blService.getContainerList(bl).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
          if (this.containerList?.length > 0) {
            element.ContainerCount = this.containerList?.length;
            //this.previewList=true;
          }
        }
      });
    });
  }

  Search() {
    var DO_NO = this.doListForm.value.DO_NO;
    var FROM_DATE = this.doListForm.value.FROM_DATE;
    var TO_DATE = this.doListForm.value.TO_DATE;
    if (DO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
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

  getDODetails(doNo: any) {
    debugger;
    localStorage.setItem('DO_NO', doNo);
    this._router.navigateByUrl('home/do-details');
  }
}
