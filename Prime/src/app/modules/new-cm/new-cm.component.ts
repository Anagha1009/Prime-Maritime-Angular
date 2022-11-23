import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CheckboxControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import * as XLSX from 'xlsx';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CONTAINER_MOVEMENT } from 'src/app/models/cm';
import { BlService } from 'src/app/services/bl.service';
import { CmService } from 'src/app/services/cm.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity-mapping';

@Component({
  selector: 'app-new-cm',
  templateUrl: './new-cm.component.html',
  styleUrls: ['./new-cm.component.scss']
})
export class NewCmComponent implements OnInit {
  cmForm: FormGroup;
  onUpload: boolean = false;
  submitted:boolean=false;
  manually:boolean=false;
  fromXL:boolean=false;
  previewNoData:boolean=true;
  cmTable: any[] = [];
  containerList:any[]=[];
  cm=new CONTAINER_MOVEMENT();
  singleCM=new CONTAINER_MOVEMENT();
  contNo:any='';
  bkcr: any='';
  currentUser:any='';
  selectedItems: any[] = [];
  dropdownSettings = {};

  prevData=new Activity();
  //activityList:any[]=[];

  activityList=[
    {ID:6,ACT_CODE:"HDMG",ACT_NAME:"Heavy damage"},
    {ID:7,ACT_CODE:"HOLD",ACT_NAME:"Hold"},
    {ID:10,ACT_CODE:"LOST",ACT_NAME:"LOST container"},
    {ID:12,ACT_CODE:"LSTY",ACT_NAME:"Longstay unit"},
    {ID:35,ACT_CODE:"SSTR",ACT_NAME:"Sent for stripping"}
  ];
  statusList=[
    {ID:1,DESC:"Emergency Repair"},
    {ID:2,DESC:"Full"},
    {ID:3,DESC:"Empty"},
    {ID:4,DESC:"Damage"},
    {ID:5,DESC:"Hold"},
    {ID:6,DESC:"Unknown"},
    {ID:7,DESC:"Awaiting Survey"},
    {ID:8,DESC:"Available"},
    {ID:9,DESC:"Awaiting Repair"}
  ];

  constructor(private _formBuilder: FormBuilder,
    private _cmService: CmService,
    private _blService:BlService,
    private _actService:ActivityService,
    private _router: Router) { }

  ngOnInit(): void {
   
    this.cmForm = this._formBuilder.group({
      MANUALLY:[''],
      BOOKING_NO: [''],
      CRO:[''],
      BKCR_NO:[''],
      CONTAINER_NO: [''],
      ACTIVITY: ['',Validators.required],
      PREV_ACTIVITY: [''],
      ACTIVITY_DATE: ['',Validators.required],
      LOCATION:['',Validators.required],
      STATUS: [''],
      CREATED_BY: [''],
      CONTAINER_MOVEMENT_LIST:new FormArray([]),
      CONTAINER_LIST2:new FormArray([])
    });
    this.checkUser();
    
  }

  initializeMovementList(){
    const add = this.cmForm.get('CONTAINER_LIST2') as FormArray;
    add.clear();
    this.containerList.forEach((element) => {
      // this._actService.getActivityByCode(element.PREV_ACTIVITY).subscribe((res: any) => {
      //   debugger;
      //   if (res.ResponseCode == 200) {
      //     this.prevData = res.Data;
      //   }
      //   if(res.ResponseCode==500){
      //     this.activityList=this.mainActList;
      //   }
      // });

      // if(this.prevData!=null){
      //   this._actService.getMappingById(this.prevData.ID).subscribe((res: any) => {
      //     debugger;
      //     if (res.ResponseCode == 200) {
      //       this.activityList = res.Data;
      //     }
      //     if(res.ResponseCode==500){
      //       this.activityList=this.mainActList;
      //     }
      //   });

      // }
      
      add.push(
        this._formBuilder.group({
          ID:[element.ID],
          BOOKING_NO: [element.BOOKING_NO],
          CRO_NO: [element.CRO_NO],
          CONTAINER_NO: [element.CONTAINER_NO],
          ACTIVITY: [element.ACTIVITY],
          PREV_ACTIVITY: [element.PREV_ACTIVITY],
          ACTIVITY_DATE: [element.ACTIVITY_DATE],
          LOCATION: [element.LOCATION],
          STATUS: [element.STATUS],
          AGENT_CODE: [element.AGENT_CODE],
          DEPO_CODE: [element.DEPO_CODE],
          CREATED_BY: [element.CREATED_BY]
        })
      );

    });

  }

  checkUser(){
    this.currentUser=localStorage.getItem('username');
  }

  getSingleContainer(){
    debugger;
    if(this.cmForm.get('CONTAINER_NO')?.value==""){
      alert('Please enter Container No.');
    }
    else{
      debugger;
      this.contNo=this.cmForm.get('CONTAINER_NO')?.value;
      this._cmService.getSingleCM(this.contNo).subscribe((res: any) => {
        debugger;
        if (res.ResponseCode == 200) {
          this.singleCM = res.Data;
        }
        if(res.ResponseCode==500){
          //alert("It seems like there is no such container, continue with the process to add it's first activity");
        }
      });
      this.cmForm.get('ACTIVITY')?.setValue(this.singleCM?.ACTIVITY);
      this.cmForm.get('PREV_ACTIVITY')?.setValue(this.singleCM?.PREV_ACTIVITY);
      this.cmForm.get('ACTIVITY_DATE')?.setValue(this.singleCM?.ACTIVITY_DATE);
      this.cmForm.get('LOCATION')?.setValue(this.singleCM?.LOCATION);
      this.cmForm.get('STATUS')?.setValue(this.singleCM?.STATUS);

    }
    
  }

  getContainerList(){
    debugger;
    this.previewNoData=true;
    this.containerList=[];
    // if(this.cmForm.get('CONTAINER_NO')?.value!=""){
    //   this.cm.CONTAINER_NO=this.cmForm.get('CONTAINER_NO')?.value;
    // }
    // else{
    //   this.bkcr=this.cmForm.get('BKCR_NO')?.value;
    //   this.cm.BOOKING_NO=this.bkcr;
      
    // }
    this.bkcr=this.cmForm.get('BKCR_NO')?.value;
    this.cm.BOOKING_NO=this.bkcr;
    this._cmService.getContainerMovement(this.cm).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerList = res.Data;
        this.initializeMovementList();
        this.previewNoData=false;
      }
      if(res.ResponseCode==500){
        this.previewNoData=true;
      }
    });

  }

  showDynamicFields(){
    debugger;
    this.manually=this.cmForm.get('MANUALLY')?.value;
  }

  saveContainerMovement(){
    debugger;
    this.submitted=true;
    console.log(this.cmForm.get('CONTAINER_MOVEMENT_LIST')?.value);
    this.cmForm.get('BOOKING_NO')?.setValue(this.bkcr);
    this.cmForm.get('CRO_NO')?.setValue("");
    this.cmForm.get('AGENT_CODE')?.setValue("0325");
    this.cmForm.get('DEPO_CODE')?.setValue("");
    this.cmForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.cmForm.value));
    this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.value),this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Container Movement saved successfully !');
          this._router.navigateByUrl('/home/booking-list');
        }
      });

  }

  cancelContainerMovement(){

  }

  get f2() {
    var x = this.cmForm.get('CONTAINER_LIST2') as FormArray;
    return x.controls;
  }

  get f(){
     return this.cmForm.controls;

  }

  f1(i: any) {
    return i;
  }

  get formArr() {
    return this.cmForm.get("CONTAINER_MOVEMENT_LIST") as FormArray;
  }

  postSelectedContainerList(item: any) {
    //debugger;
    const add = this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;
    add.push(
      item
      );
    console.log(item.value);
  }
  
  //FILES LOGIC
  onFileChange(ev: any) {
    debugger;
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    var file = ev.target.files[0];

    var extension = file.name.split('.').pop();
    var array = ['csv', 'xls', 'xlsx'];

    if (file.size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });
          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial;
          }, {});
          const dataString = JSON.stringify(jsonData);

          var keyArray = [
            'BOOKING_NO',
            'CRO_NO',
            'CONTAINER_NO',
            'ACTIVITY',
            'PREV_ACTIVITY',
            'ACTIVITY_DATE',
            'LOCATION',
            'STATUS',
            'AGENT_CODE',
            'DEPO_CODE',
            'CREATED_BY'
          ];

          var keyXlArray: any = [];

          Object.keys(jsonData['CM'][0]).forEach(function (key) {
            keyXlArray.push(key);
          });

          var result = this.isSameColumn(keyXlArray, keyArray);

          if (result) {
            this.cmTable = [];

            this.cmTable = jsonData['CM'];
            this.containerList = jsonData['CM'];
            var isValid = true;

            this.cmTable.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.BOOKING_NO,
                  element.CRO_NO,
                  element.CONTAINER_NO,
                  element.ACTIVITY,
                  element.PREV_ACTIVITY,
                  element.ACTIVITY_DATE,
                  element.LOCATION,
                  element.STATUS,
                  element.AGENT_CODE,
                  element.DEPO_CODE,
                  element.CREATED_BY
                ])
              ) {
                isValid = false;
              }
            });

            this.containerList.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.BOOKING_NO,
                  element.CRO_NO,
                  element.CONTAINER_NO,
                  element.ACTIVITY,
                  element.PREV_ACTIVITY,
                  element.ACTIVITY_DATE,
                  element.LOCATION,
                  element.STATUS,
                  element.AGENT_CODE,
                  element.DEPO_CODE,
                  element.CREATED_BY
                ])
              ) {
                isValid = false;
              }
            });

            if (isValid) {
              this.cmTable = this.cmTable.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.containerList = this.containerList.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.onUpload = true;
            } else {
              alert('Incorrect data!');
            }
          } else {
            alert('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Only .xlsx or .csv files allowed');
      }
    }
  }

  checkNullEmpty(param: any) {
    var x = true;
    param.forEach((element: any) => {
      if (element == null || element == '' || element == undefined) {
        x = false;
      }
    });
    return x;
  }

  isSameColumn(arr1: any, arr2: any) {
    return true;
    //return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  openMyPreview(){
    var element = document.getElementById("openModalButton") as HTMLElement;
    element.click();

  }
  getCMForm() {
    
    this.fromXL=true;
    const add = this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;

    add.clear();
    this.containerList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          ID:[0],
          BOOKING_NO: [element.BOOKING_NO],
          CRO_NO: [element.CRO_NO],
          CONTAINER_NO: [element.CONTAINER_NO],
          ACTIVITY: [element.ACTIVITY],
          PREV_ACTIVITY: [element.PREV_ACTIVITY],
          ACTIVITY_DATE: [element.ACTIVITY_DATE],
          LOCATION: [element.LOCATION],
          STATUS: [element.STATUS],
          AGENT_CODE: [element.AGENT_CODE.toString()],
          DEPO_CODE: [element.DEPO_CODE.toString],
          CREATED_BY: [element.CREATED_BY]
        })
      );

    });

    debugger

    this.cmForm.get('fromXL')?.setValue(true);
    this.cmForm.get("ACTIVITY_DATE")?.setValue(new Date());
    console.log(JSON.stringify(this.cmForm.value));

    

    this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.value),this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Container Movement saved successfully !');
          this._router.navigateByUrl('/home/booking-list');
        }
      });

  }

}
