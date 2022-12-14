import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import { ErService } from 'src/app/services/er.service';

@Component({
  selector: 'app-new-er',
  templateUrl: './new-er.component.html',
  styleUrls: ['./new-er.component.scss']
})
export class NewErComponent implements OnInit {
  tabs: string = '1';
  currentLocation:any='';
  roleCode:any='';
  isVessel:boolean=false;
  status:any='Available'
  erForm: FormGroup;
  submitted: boolean = false;
  disabled = false;
  public loadContent: boolean = false;
  isScroll1: boolean = false;
  isScroll2: boolean = false;
  currencyList: any[] = [];
  
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};

  constructor(private _formBuilder: FormBuilder,
    private _erService: ErService,
    private _commonService:CommonService,
    private _cmService:CmService,
    private _router: Router) { }

  ngOnInit(): void {
    this.currentLocation='Dammam';
    //this.currentLocation=localStorage.getItem('location');
   
    this.getDropdownData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'CONTAINER_NO',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Container',
      noDataAvailablePlaceholderText: 'No Container Present',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };


    this.erForm = this._formBuilder.group({
      REPO_NO: ['', Validators.required],
      LOAD_DEPOT: ['', Validators.required],
      DISCHARGE_DEPOT: ['', Validators.required],
      LOAD_PORT: [''],
      DISCHARGE_PORT: [''],
      VESSEL_NAME:[''],
      VOYAGE_NO:[''],
      MOVEMENT_DATE: ['', Validators.required],
      LIFT_ON_CHARGE: ['', Validators.required],
      LIFT_OFF_CHARGE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      NO_OF_CONTAINER: [''],
      MODE_OF_TRANSPORT: ['',Validators.required],
      REASON: ['', Validators.required],
      REMARKS: ['', Validators.required],
      STATUS: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      DEPO_CODE: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormControl(this.containerDropdownList, Validators.required),
      CONTAINER_RATES:new FormArray([]),
      SLOT_LIST:new FormArray([])
    });
    this.getCurrent();
    this.slotAllocation();
    this.loadContent = true;
  }

  get f() {
    return this.erForm.controls;

  }
  get f5() {
    var s = this.erForm.get('SLOT_LIST') as FormArray;
    return s.controls;
  }
  f6(i: any) {
    return i;
  }
  get f3() {
    var s = this.erForm.get('CONTAINER_RATES') as FormArray;
    return s.controls;
  }
  f4(i: any) {
    return i;
  }
  addRates() {
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;
    if(rateList?.length>=4){
      this.isScroll2=true;
    }
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
  }

  slotAllocation() {
    var slotDetails = this.erForm.get('SLOT_LIST') as FormArray;
    if(slotDetails?.length>=3){
      this.isScroll1=true;
    }
    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
      })
    );
  }
  getCurrent(){
    //this.currentLocation=localStorage.getItem('location');
    this.roleCode=localStorage.getItem('rolecode');
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;

    //var ct = this.erForm.value.CONTAINER_TYPE;
    rateList.clear();
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
  }
  getDropdownData(){
    this.containerDropdownList=[];
    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.currencyList = res.Data;
      }
    });
    debugger;
    this._cmService.getCMAvailable(this.status,this.currentLocation).subscribe((res: any) => {
      if(res.ResponseCode==200){
        this.containerDropdownList=res.Data;
      }
      if(res.ResponseCode==500){
        this.containerDropdownList=[];
      }
    });
    
  }

  cancelER(){
    this.erForm.get('REPO_NO')?.setValue("");
    this.erForm.get('LOAD_DEPOT')?.setValue("");
    this.erForm.get('DISCHARGE_DEPOT')?.setValue("");
    this.erForm.get('MOVEMENT_DATE')?.setValue("");
    this.erForm.get('LIFT_ON_CHARGE')?.setValue("");
    this.erForm.get('LIFT_OFF_CHARGE')?.setValue("");
    this.erForm.get('CURRENCY')?.setValue("");
    this.erForm.get('NO_OF_CONTAINER')?.setValue("");
    this.erForm.get('MODE_OF_TRANSPORT')?.setValue("");
    this.erForm.get('REASON')?.setValue("");
    this.erForm.get('REMARKS')?.setValue("");
    this.erForm.get('CONTAINER_LIST')?.setValue("");
  }

  saveER() {
    //debugger;
    this.submitted = true;
    // if(this.erForm.invalid){
    //   return
    // }
    if(this.roleCode=='1'){
      this.erForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
      this.erForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    if(this.roleCode=='3'){
      this.erForm.get('DEPO_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    this.erForm.get('REPO_NO')?.setValue(this.getRandomNumber("RP-"));
    this.erForm.get('CONTAINER_LIST')?.setValue(this.selectedItems);
    this.erForm.get('NO_OF_CONTAINER')?.setValue(this.selectedItems?.length);
    this.erForm.get('STATUS')?.setValue(1);
    this.erForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.erForm.value));
    this._erService
      .postERDetails(JSON.stringify(this.erForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Request has successfully placed!');
          this._router.navigateByUrl('/home/booking-list');
        }
      });

  }

  getRandomNumber(repo: string) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return repo + '-' + num;
  }

  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }



}
