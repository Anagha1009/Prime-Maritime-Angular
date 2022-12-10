import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { CONTAINER_MOVEMENT, CONTAINER_TRACKING } from 'src/app/models/cm';
import { ActivityService } from 'src/app/services/activity.service';
import { BlService } from 'src/app/services/bl.service';
import { CmService } from 'src/app/services/cm.service';

@Component({
  selector: 'app-pm-cm',
  templateUrl: './pm-cm.component.html',
  styleUrls: ['./pm-cm.component.scss']
})
export class PmCmComponent implements OnInit {
  cmForm: FormGroup;
  onUpload: boolean = false;
  submitted:boolean=false;
  manually:boolean=false;
  showTable:boolean=false;
  showFields:boolean=false;
  fromXL:boolean=false;
  previewNoData:boolean=false;
  isAgent:boolean=true;
  cmTable: any[] = [];
  containerList:any[]=[];
  cm=new CONTAINER_MOVEMENT();
  singleCM=new CONTAINER_MOVEMENT();
  maxDate:any='';
  commonDate:any='';
  commonLocation:any='';
  contNo:any='';
  bkcr: any='';
  currentUser:any='';
  roleCode:any=''
  actBy:any='';
  selectedActCode:any=''
  selectedActivity:any[]=[];
  selectedItems: any[] = [];
  dropdownSettings = {};
  @ViewChild ('myacts') myactsRef: ElementRef;

  agentXLCode:any='';
  depoXLCode:any=''
  contTrack=new CONTAINER_TRACKING();
  prevData:any;
  activityList:any[]=[];

  activityList1=[
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
    private _router: Router,
    private ntService:NotificationsService) { }

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
      AGENT_CODE: [''],
      DEPO_CODE: [''],
      STATUS: [''],
      CREATED_BY: [''],
      CONTAINER_MOVEMENT_LIST:new FormArray([]),
      CONTAINER_LIST2:new FormArray([]),
      NEXT_ACTIVITY_LIST_SINGLE: new FormArray([])
    });
    this.maxDate =formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.checkUser();
    this.initializeNextActivityList();
    
  }

  initializeNextActivityList(){
    this.activityList=[];
    this._actService.getActivityList().subscribe((res: any) => {
      if(res.ResponseCode==200){
        this.activityList=res.Data;
      }
    });
    const add=this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE") as FormArray;
    add.clear();
    this.activityList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          ID:[element.ID],
          ACT_NAME: [element.ACT_NAME],
          ACT_CODE: [element.ACT_CODE],
          ACT_TYPE: [element.ACT_TYPE]
        })
       );
      });
  }

  checkUser(){
    this.currentUser=localStorage.getItem('username');
    this.roleCode=localStorage.getItem('rolecode');

    switch (this.roleCode){
      case '1':
        this.actBy='A';
        break;
      case '2':
        this.actBy='P';
        break;
      case '3':
        this.actBy='D';
        break;
      default:
        this.actBy='A';
        break;
      
    }

    console.log(this.currentUser);
    
    if(this.roleCode=='1'){
      this.isAgent=true;
      this.cmForm.get('STATUS')?.disable();
      this.cmForm.get('PREV_ACTIVITY')?.disable();
    }
    else{
      this.isAgent=false;
      this.cmForm.get('STATUS')?.enable();
      this.cmForm.get('PREV_ACTIVITY')?.disable();
    }

  }

  initializeMovementList(){
    const add = this.cmForm.get('CONTAINER_LIST2') as FormArray;
    add.clear();
    if(this.roleCode=="1"){
      debugger;
      this.containerList.forEach((element) => {
        add.push(
          this._formBuilder.group({
            ID:[element.ID],
            BOOKING_NO: [element.BOOKING_NO],
            CRO_NO: [element.CRO_NO],
            CONTAINER_NO: [element.CONTAINER_NO],
            ACTIVITY: [element.ACT_CODE],
            PREV_ACTIVITY: [element.PREV_ACT_CODE],
            ACTIVITY_DATE: [formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en')],
            LOCATION: [element.LOCATION],
            STATUS: [element.STATUS],
            AGENT_CODE: [element.AGENT_CODE],
            DEPO_CODE: [element.DEPO_CODE],
            CREATED_BY: [element.CREATED_BY],
            NEXT_ACTIVITY_LIST:[element.NEXT_ACTIVITY_LIST.filter((s: string) => s.split('-')[2].includes(this.actBy))]
          })
        );
      });
      console.log(this.cmForm.get('CONTAINER_LIST2')?.value);

    }
    else{
      this.containerList.forEach((element) => {
        add.push(
          this._formBuilder.group({
            ID:[element.ID],
            BOOKING_NO: [element.BOOKING_NO],
            CRO_NO: [element.CRO_NO],
            CONTAINER_NO: [element.CONTAINER_NO],
            ACTIVITY: [element.ACT_CODE],
            PREV_ACTIVITY: [element.PREV_ACT_CODE],
            ACTIVITY_DATE: [formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en')],
            LOCATION: [element.LOCATION],
            STATUS: [element.STATUS],
            AGENT_CODE: [element.AGENT_CODE],
            DEPO_CODE: [element.DEPO_CODE],
            CREATED_BY: [element.CREATED_BY],
            NEXT_ACTIVITY_LIST:[element.NEXT_ACTIVITY_LIST.filter((s: string) => s.split('-')[2].includes(this.actBy))]
          })
        );
      });
    }
    
    
    
  }

  copyDate(){
    debugger;
    this.commonDate=this.cmForm.value.CONTAINER_LIST2[0].ACTIVITY_DATE;
    console.log(this.commonDate);

    console.log(this.cmForm.value.CONTAINER_LIST2);
    this.cmForm.value.CONTAINER_LIST2.forEach((element: { ACTIVITY_DATE: any;STATUS:any; }) => {
      element.ACTIVITY_DATE=formatDate(this.commonDate, 'yyyy-MM-dd', 'en');
      element.STATUS=element.STATUS;
    });
    console.log(this.cmForm.value.CONTAINER_LIST2);
    this.cmForm.get('CONTAINER_LIST2')?.setValue(this.cmForm.value.CONTAINER_LIST2);
    
  }

  copyLocation(){
    this.commonLocation=this.cmForm.value.CONTAINER_LIST2[0].LOCATION;
    this.cmForm.value.CONTAINER_LIST2.forEach((element: { LOCATION: any; }) => {
      element.LOCATION=this.commonLocation;
    });
    this.cmForm.get('CONTAINER_LIST2')?.setValue(this.cmForm.value.CONTAINER_LIST2);
  }


  getSingleContainer(){
    debugger;
    this.resetContainerMovement();
    if(this.cmForm.get('CONTAINER_NO')?.value==""){
      alert('Please enter Container No.');
      this.showFields=false;
    }
    else{
      
      debugger;
      this.contNo=this.cmForm.get('CONTAINER_NO')?.value;
      this._cmService.getSingleCM(this.contNo).subscribe((res: any) => {
        debugger;
        if (res.ResponseCode == 200) {
          this.singleCM = res.Data;
  
          this.cmForm.get('BOOKING_NO')?.setValue(this.singleCM?.BOOKING_NO);
          this.cmForm.get('CRO_NO')?.setValue(this.singleCM?.CRO_NO);
          this.cmForm.get('ACTIVITY')?.setValue(this.singleCM?.ACTIVITY);
          this.cmForm.get('PREV_ACTIVITY')?.setValue(this.singleCM?.PREV_ACTIVITY);
          this.cmForm.get('ACTIVITY_DATE')?.setValue(formatDate(this.singleCM?.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'));
          this.cmForm.get('LOCATION')?.setValue(this.singleCM?.LOCATION);
          this.cmForm.get('STATUS')?.setValue(this.singleCM?.STATUS);
          this.cmForm.get('AGENT_CODE')?.setValue(this.singleCM?.AGENT_CODE);
          this.cmForm.get('DEPO_CODE')?.setValue(this.singleCM?.DEPO_CODE);
          console.log(this.singleCM?.PREV_ACTIVITY);

          if(this.singleCM?.PREV_ACTIVITY!=""){
            this._actService.getActivityByCode(this.singleCM?.PREV_ACTIVITY).subscribe((res: any) => {
              debugger;
              if (res.ResponseCode == 200) {
                this.prevData = res.Data;
                console.log(this.prevData);
                if(this.prevData!=null){
                  this._actService.getMappingById(this.prevData?.ID).subscribe((res: any) => {
                    debugger;
                    this.activityList=[];
                    if (res.ResponseCode == 200) {
                      this.activityList = res.Data.ActivityList;
                      console.log(this.activityList);
                      this.activityList=this.activityList.filter((s: any) => s.ACTIVITY_BY.includes(this.actBy));
                      const add=this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE") as FormArray;
                      add.clear();
                      this.activityList.forEach((element) => {
                      add.push(
                        this._formBuilder.group({
                          ID:[element.ID],
                          ACT_NAME: [element.ACT_NAME],
                          ACT_CODE: [element.ACT_CODE],
                          ACT_TYPE: [element.ACT_TYPE],
                          ACTIVITY_BY: [element.ACTIVITY_BY]
                        })
                       );
                      });
                      console.log(this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE")?.value);
                    }
                    if(res.ResponseCode==500){
                      //alert("It seems like there is no such container, continue with the process to add it's first activity");
                    }
                  });
                }
  
              }
              if(res.ResponseCode==500){
                this.activityList=[];
                  this._actService.getActivityList().subscribe((res: any) => {
                    if(res.ResponseCode==200){
                      this.activityList=res.Data;
                    }
                  });
                  this.activityList=this.activityList.filter((s: any) => s.ACTIVITY_BY.includes(this.actBy));
                  const add=this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE") as FormArray;
                  add.clear();
                  this.activityList.forEach((element) => {
                    add.push(
                      this._formBuilder.group({
                        ID:[element.ID],
                        ACT_NAME: [element.ACT_NAME],
                        ACT_CODE: [element.ACT_CODE],
                        ACT_TYPE: [element.ACT_TYPE],
                        ACTIVITY_BY: [element.ACTIVITY_BY]
                      })
                     );
                    });
              }
            });

          }
          else{
                this._actService.getActivityList().subscribe((res: any) => {
                  if(res.ResponseCode==200){
                    this.activityList=res.Data;
                  }
                });
                this.activityList=this.activityList.filter((s: any) => s.ACTIVITY_BY.includes(this.actBy));
                const add=this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE") as FormArray;
                add.clear();
                this.activityList.forEach((element) => {
                  add.push(
                    this._formBuilder.group({
                      ID:[element.ID],
                      ACT_NAME: [element.ACT_NAME],
                      ACT_CODE: [element.ACT_CODE],
                      ACT_TYPE: [element.ACT_TYPE],
                      ACTIVITY_BY: [element.ACTIVITY_BY]
                    })
                   );
                  });

          }
          this.showFields=true;
          

        }
        if(res.ResponseCode==500){
          
          if(this.roleCode=="1"){
            alert("Sorry, you are not authorized to add a new container.Try with existing container number");
            this.showFields=false;

          }
          else{
            alert("It seems like there is no such container, continue with the process to add it's first activity");

            this._actService.getActivityList().subscribe((res: any) => {
              if(res.ResponseCode==200){
                this.activityList=res.Data;
              }
            });
            this.activityList=this.activityList.filter((s: any) => s.ACTIVITY_BY.includes(this.actBy));
            const add=this.cmForm.get("NEXT_ACTIVITY_LIST_SINGLE") as FormArray;
            add.clear();
            this.activityList.forEach((element) => {
              add.push(
                this._formBuilder.group({
                  ID:[element.ID],
                  ACT_NAME: [element.ACT_NAME],
                  ACT_CODE: [element.ACT_CODE],
                  ACT_TYPE: [element.ACT_TYPE],
                  ACTIVITY_BY: [element.ACTIVITY_BY]
                  
                })
               );
              });
            this.showFields=true;
          }

        }
       
      });
      
      
    }
    
  }

  getContainerList(){
   // debugger;
    if(this.cmForm.get('BKCR_NO')?.value==""){
      alert('Please enter Booking/CRO No.');
    }
    else{
      this.showTable=false;
      this.containerList=[];

      this.bkcr=this.cmForm.get('BKCR_NO')?.value;
      console.log(this.bkcr.substring(0,2))
      if(this.bkcr.substring(0,2)=="BK"){
        this.cm.BOOKING_NO=this.bkcr;
        this._cmService.getContainerMovement(this.cm).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            
            if(res.Data?.length!=0){
              this.containerList = res.Data;
              debugger;
              this.initializeMovementList();
              this.showTable=true;
              this.previewNoData=false;
            }
            else if(res.Data?.length==0){
              this.showTable=false;
              this.previewNoData=true;
            }
          }  
          if(res.ResponseCode==500){
            debugger;
            this.showTable=false;
            this.previewNoData=true;
          }
        });
      }
      else if(this.bkcr.substring(0,2)=="CR"){
        this.cm.CRO_NO=this.bkcr;
        this._cmService.getContainerMovement(this.cm).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            
            if(res.Data?.length!=0){
              this.containerList = res.Data;
              debugger;
              this.initializeMovementList();
              this.showTable=true;
              this.previewNoData=false;
            }
            else if(res.Data?.length==0){
              this.showTable=false;
              this.previewNoData=true;
            }
          }  
          if(res.ResponseCode==500){
            debugger;
            this.showTable=false;
            this.previewNoData=true;
          }
        });
      }
      else{
        alert('Incorrect prefix characters!')
      }
      
    }

  }

  showDynamicFields(){
    debugger;
    this.manually=this.cmForm.get('MANUALLY')?.value;
  }

  saveCMList(){
    debugger;
    this.submitted=true;
    this.cmForm.get('CONTAINER_NO')?.setValue('');
    this.cmForm.get('BOOKING_NO')?.setValue(this.bkcr);
    this.cmForm.get('CRO_NO')?.setValue("");
    this.cmForm.get('ACTIVITY_DATE')?.setValue(new Date());
    console.log(this.cmForm.get('PREV_ACTIVITY')?.value);
    console.log(this.cmForm.get('STATUS')?.value);
    // if(this.roleCode=="1"){
    //   this.cmForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    //   //this.cmForm.get('DEPO_CODE')?.setValue("");
    // }
    // else if(this.roleCode=="3"){
    //   //this.cmForm.get('AGENT_CODE')?.setValue("");
    //   this.cmForm.get('DEPO_CODE')?.setValue(localStorage.getItem('usercode'));
    // }
    
    this.cmForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    //console.log(JSON.stringify(this.cmForm.getRawValue()));
    console.log(this.cmForm.get('CONTAINER_MOVEMENT_LIST')?.value);
    if(this.cmForm.get('CONTAINER_MOVEMENT_LIST')?.value==''){
      alert("Please select atleast one container to update it's movement");
    }
    else{
      this.contTrack=new CONTAINER_TRACKING();
      this.contTrack.ACTIVITY_DATE = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.contTrack.CONTAINER_MOVEMENT_LIST=this.cmForm.get('CONTAINER_MOVEMENT_LIST')?.value;
      this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.getRawValue()),this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          //this.onSuccess("Container Movement saved successfully !");
          this._cmService.postTrackingHistory(this.contTrack)
          .subscribe((res:any)=>{
            if(res.responseCode==200){
              alert('Container Movement saved successfully !');
              this._router.navigateByUrl('/home/tracking');
            }
            if(res.responseCode==500){
              alert('Container Movement failed !Try Again');
              //this._router.navigateByUrl('/home/tracking');
            }
          });
        }
      });
    }

  }

  saveContainerMovement(){
    debugger;
    this.submitted=true;
    // if(this.roleCode=="1"){
    //   this.cmForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    //   //this.cmForm.get('DEPO_CODE')?.setValue("");
    // }
    // else if(this.roleCode=="3"){
    //   //this.cmForm.get('AGENT_CODE')?.setValue("");
    //   this.cmForm.get('DEPO_CODE')?.setValue(localStorage.getItem('usercode'));
    // }
   
    this.cmForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this.contTrack=new CONTAINER_TRACKING();
    this.contTrack.CONTAINER_NO= this.cmForm.get('CONTAINER_NO')?.value;
    this.contTrack.BOOKING_NO=this.cmForm.get('BOOKING_NO')?.value;
    this.contTrack.CRO_NO=this.cmForm.get('CRO_NO')?.value;
    this.contTrack.ACTIVITY=this.cmForm.get('ACTIVITY')?.value;
    this.contTrack.ACTIVITY_DATE=this.cmForm.get('ACTIVITY_DATE')?.value;
    this.contTrack.PREV_ACTIVITY=this.cmForm.get('PREV_ACTIVITY')?.value;
    this.contTrack.LOCATION=this.cmForm.get('LOCATION')?.value;
    this.contTrack.STATUS=this.cmForm.get('STATUS')?.value;
    this.contTrack.AGENT_CODE=this.cmForm.get('AGENT_CODE')?.value;
    this.contTrack.DEPO_CODE=this.cmForm.get('DEPO_CODE')?.value;
    this.contTrack.CREATED_BY=this.cmForm.get('CREATED_BY')?.value;

    this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.getRawValue()),this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          //this.onSuccess("Container Movement saved successfully !");
          this._cmService.postTrackingHistory(this.contTrack)
          .subscribe((res:any)=>{
            if(res.responseCode==200){
              alert('Container Movement saved successfully !');
              this._router.navigateByUrl('/home/tracking');
            }
            if(res.responseCode==500){
              alert('Container Movement failed !Try Again');
              //this._router.navigateByUrl('/home/tracking');
            }
          });
        }
      });

  }

  resetContainerMovement(){
    this.submitted=false;
    this.cmForm.get('ACTIVITY')?.setValue('');
    this.cmForm.get('ACTIVITY_DATE')?.setValue('');
    this.cmForm.get('LOCATION')?.setValue('');
    this.cmForm.get('STATUS')?.setValue('');
    this.cmForm.get('AGENT_CODE')?.setValue('');
    this.cmForm.get('DEPO_CODE')?.setValue('');
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

  postSelectedContainerList(item: any, event: any, index: number) {
    debugger;
    
    if(index==0){
      const add = this.cmForm.get('CONTAINER_LIST2') as FormArray;
      const add1 = this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;
      if (event.target.checked) {
        add.controls.forEach((control) => {
          add1.push(control);
        });

        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            true;
        }
      } else {
        add.clear();
        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            false;
        }
      }
      
    }
    else{
      if (event.target.checked) {
        this.formArr.push(item);
      } else {
        this.formArr.removeAt(this.formArr.value.findIndex((m: { CONTAINER_NO: any; }) => m.CONTAINER_NO === item.value.CONTAINER_NO));
      }
      
    }
    
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
            'ACTIVITY_DATE',
            'LOCATION',
            'STATUS'
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
                  element.ACTIVITY_DATE,
                  element.LOCATION,
                  element.STATUS
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
                  element.ACTIVITY_DATE,
                  element.LOCATION,
                  element.STATUS
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
    var fileExist=document.getElementById("file")?.innerHTML;
    if(fileExist!=""){
      var element = document.getElementById("openModalButton") as HTMLElement;
      element.click();
    }
    else{
      alert("Please upload a file to add container movement");
    }
    

  }
  getCMForm() {
    // if(this.roleCode=="1"){
    //   this.agentXLCode=localStorage.getItem('usercode');
    // }
    // else if(this.roleCode=="3"){
    //   this.depoXLCode=localStorage.getItem('usercode');
    // }
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
          PREV_ACTIVITY: [''],
          ACTIVITY_DATE: [element.ACTIVITY_DATE],
          LOCATION: [element.LOCATION],
          STATUS: [element.STATUS],
          AGENT_CODE: [this.agentXLCode],
          DEPO_CODE: [this.depoXLCode],
          CREATED_BY: [localStorage.getItem('username')]
        })
      );

    });

    this.cmForm.get('fromXL')?.setValue(true);
    this.cmForm.get("ACTIVITY_DATE")?.setValue(new Date());
    console.log(JSON.stringify(this.cmForm.value));
    this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.value),this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Container Movement saved successfully !');
          this._router.navigateByUrl('/home/tracking');
        }
      });
  }
   
  onSuccess(message:any){
    debugger;
    const temp={
      title:"Success",
      content:message,
      type:NotificationType.Success,
    };
    this.ntService.create(temp.title,temp.content,temp.type,temp);
  }

  onError(message:any){
    this.ntService.error('Error',message,{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true
    });
  }


}
