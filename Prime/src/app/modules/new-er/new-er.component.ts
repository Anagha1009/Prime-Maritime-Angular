import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import { CroService } from 'src/app/services/cro.service';
import { ErService } from 'src/app/services/er.service';
import { locale as english } from 'src/app/@core/translate/er/en';
import { locale as hindi } from 'src/app/@core/translate/er/hi';
import { locale as arabic } from 'src/app/@core/translate/er/ar';
@Component({
  selector: 'app-new-er',
  templateUrl: './new-er.component.html',
  styleUrls: ['./new-er.component.scss']
})
export class NewErComponent implements OnInit {
  croNo: string;
  tabs: string = '1';
  currentLocation:any='';
  roleCode:any='';
  isVessel:boolean=false;
  status:any='Available'
  erForm: FormGroup;
  erCROForm: FormGroup;
  submitted: boolean = false;
  submitted1: boolean = false;
  submittedSlot:boolean=false;
  disabled = false;
  public loadContent: boolean = false;
  isScroll1: boolean = false;
  isScroll2: boolean = false;
  currencyList: any[] = [];
  vesselList: any[] = [];
  voyageList: any[] = [];
  vesselRateList: any[] = [];
  fixedChargeCode:any[]=["Lift On","Truck In To Terminal","Stevedoring-POL","Stevedoring-POD","Truck In To Depo","Lift Off"];
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};

  constructor(private _formBuilder: FormBuilder,
    private _erService: ErService,
    private _commonService:CommonService,
    private _cmService:CmService,
    private _croService: CroService,
    private _coreTranslationService: CoreTranslationService,
    private _router: Router) { this._coreTranslationService.translate(english,hindi,arabic);}

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
      NO_OF_CONTAINER: [''],
      LIFT_ON_CHARGE: [0],
      LIFT_OFF_CHARGE: [0],
      CURRENCY: [''],
      MODE_OF_TRANSPORT: ['',Validators.required],
      REASON:[''],
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

    this.erCROForm=this._formBuilder.group({
      CRO_NO: [''],
      REPO_NO: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REQ_QUANTITY: ['',Validators.required],
      AGENT_NAME:[''],
      AGENT_CODE: [''],
      CREATED_BY: ['']
    });
    this.getCurrent();
    this.slotAllocation();
    this.loadContent = true;
  }

  get f() {
    return this.erForm.controls;

  }
  get f1() {
    return this.erCROForm.controls;
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

  removeSlotItem(i: any) {
    const add = this.erForm.get('SLOT_LIST') as FormArray;
    if(add.length==1){
      alert('Atleast one slot should be added!');
    }
    else{
      add.removeAt(i);
    }
  }

  removeRateItem(i: any) {
    const add = this.erForm.get('CONTAINER_RATES') as FormArray;
    add.removeAt(i);
  }

  addRates() {
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;
    if(rateList?.length>=6){
      this.isScroll2=true;
    }
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
  }

  slotAllocation() {
    var slotDetails = this.erForm.get('SLOT_LIST') as FormArray;
    if(slotDetails?.length>=6){
      this.isScroll1=true;
    }
    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: [0, Validators.required],
      })
    );
  }
  getCurrent(){
    //this.currentLocation=localStorage.getItem('location');
    this.roleCode=localStorage.getItem('rolecode');
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;
    rateList.clear();
    //this.fixedChargeCode=["Lift On","Truck In To Terminal","Stevedoring-POL","Stevedoring-POD","Truck In To Depo","Lift Off"];
    // this.vesselRateList=[
    //   {
    //     ID:1,
    //     CHARGE_CODE: "Lift On",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:2,
    //     CHARGE_CODE: "Truck In To Terminal",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     CHARGE_CODE: "Stevedoring-POL",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:3,
    //     CHARGE_CODE: "Stevedoring-POD",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:4,
    //     CHARGE_CODE: "Truck In To Depo",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",
    //   },
    //   {
    //     ID:5,
    //     CHARGE_CODE: "Lift Off",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   }
    // ];

    // this.vesselList.forEach((element)=>{
    //   rateList.push(
    //     this._formBuilder.group({
    //           CHARGE_CODE: [element.CHARGE_CODE],
    //           CURRENCY: [element.CURRENCY],
    //           STANDARD_RATE: [element.STANDARD_RATE],
    //         })
    //   );
    // });

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Lift On', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Truck In To Terminal', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Stevedoring-POL', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Stevedoring-POD', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Truck In To Depo', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Lift Off', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    
    
  }

  getVoyageList(event: any) {
    this.erForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
        }
      });
  }
  getAvailableContainers(event: any){
    this.erForm.get('CONTAINER_LIST')?.setValue('');
    this.containerDropdownList=[];
    this._cmService.getCMAvailable(this.status,event).subscribe((res: any) => {
      if(res.ResponseCode==200){
        this.containerDropdownList=res.Data;
      }
      if(res.ResponseCode==500){
        this.containerDropdownList=[];
      }
    });
  }
  getDropdownData(){
    //this.containerDropdownList=[];
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
    });
    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.currencyList = res.Data;
      }
    });
    // this._cmService.getCMAvailable(this.status,this.currentLocation).subscribe((res: any) => {
    //   if(res.ResponseCode==200){
    //     this.containerDropdownList=res.Data;

    //   }
    //   if(res.ResponseCode==500){
    //     this.containerDropdownList=[];
    //   }
    // });
    
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

  cancelERCRO(){
    this.erCROForm.get('CRO_NO')?.setValue("");
    this.erCROForm.get('REPO_NO')?.setValue("");
    this.erCROForm.get('EMPTY_CONT_PCKP')?.setValue("");
    this.erCROForm.get('CRO_VALIDITY_DATE')?.setValue("");
    this.erCROForm.get('REQ_QUANTITY')?.setValue("");
    this.erCROForm.get('AGENT_NAME')?.setValue("");
    this.erCROForm.get('AGENT_CODE')?.setValue("");
    this.erCROForm.get('CREATED_BY')?.setValue("");
  }

  saveER() {
    debugger;
    this.isVessel=false;
    this.submitted = true;
    if(this.roleCode=='1'){
      this.erForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
      this.erForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    if(this.roleCode=='3'){
      this.erForm.get('DEPO_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    if(this.tabs=='1'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Truck');
    }
    else if(this.tabs=='2'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Rail');
    }
    else if(this.tabs=='3'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Vessel');
      this.isVessel=true;
      //this.submittedSlot=true;
      
    }
    
    this.erForm.get('REPO_NO')?.setValue(this.getRandomNumber("RP"));
    this.erForm.get('CONTAINER_LIST')?.setValue(this.selectedItems);
    this.erForm.get('NO_OF_CONTAINER')?.setValue(this.selectedItems?.length);
    this.erForm.get('STATUS')?.setValue(1);
    this.erForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    
    console.log()
    console.log(JSON.stringify(this.erForm.value));
    this._erService
      .postERDetails(JSON.stringify(this.erForm.value),this.isVessel)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Request has successfully been placed! Your Repo No. is'+this.erForm.get('REPO_NO')?.value);
          this._router.navigateByUrl('/home/booking-list');
        }
      });

  }
  SaveCRO() {
    this.submitted1 = true;
    if (this.erCROForm.invalid) {
      return;
    }
    this.erCROForm.get('CRO_NO')?.setValue(this.getCRORandomNumber());
    this.erCROForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.erCROForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.erCROForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this._croService
      .insertCRO(JSON.stringify(this.erCROForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.croNo = res.data;
          alert('CRO created successfully! Your CRO No. is '+this.croNo);
          this.cancelERCRO();
        }
      });
  }

  getCRORandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
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
