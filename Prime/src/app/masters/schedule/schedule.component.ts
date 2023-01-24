import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SCHEDULE } from 'src/app/models/schedule';
import { CommonService } from 'src/app/services/common.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  ScheduleForm:FormGroup
  servicenameList: any[] = [];
  ScheduleList:any[]=[];
  portList:any[]=[];
  vesselList:any[]=[];
  vesselList1:any[]=[];
  submitted:boolean;
  isUpdate: boolean = false;
  servicenameList1: any[] = [];
  slotDetailsForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  
  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
    private _commonService:CommonService,
    private _scheduleService:ScheduleService

  ) { }

  ngOnInit(): void {
    this.ScheduleForm = this._formBuilder.group({
      ID: [0],
      VESSEL_NAME: ['',Validators.required],
      SERVICE_NAME: ['',Validators.required],
      PORT_CODE: ['',Validators.required],
      VIA_NO:['',Validators.required],
      ETA:['',Validators.required],
      ETD:['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: [''],
    });
 this.getDropdown() ;
 this.GetScheduleList();

  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetScheduleDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  
  GetScheduleList() {
    this._scheduleService.getScheduleList().subscribe((res: any) => {
      this._commonService.destroyDT();

      if (res.ResponseCode == 200) {
        this.ScheduleList = res.Data;
        console.log(res.Data)
      }
      this._commonService.getDT();

    });
  }

  GetScheduleDetails(ID: number) {
    var scheduleModel = new SCHEDULE();
  
    scheduleModel.ID = ID;

    this._scheduleService.GetScheduleDetails(scheduleModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ScheduleForm.patchValue(res.Data)        
         this.isUpdate = true;

      }
    });
  }

  InsertSchedule() {
    debugger
    this.submitted=true
    if(this.ScheduleForm.invalid){
      return
    }
    this.ScheduleForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.ScheduleForm.get('STATUS')?.value;
    this.ScheduleForm.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._scheduleService.postSchedule(JSON.stringify(this.ScheduleForm.value)).subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this. GetScheduleList()
          this.ClearForm()
        }
      });
  }

  ClearForm() {
    this.ScheduleForm.reset();
    this.ScheduleForm.get('STATUS')?.setValue('');
  }


  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.vesselList = res.Data;
        this.vesselList1 = res.Data;
      }
    }); 

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });
  }


  UpdateSchedule() {
    debugger;
    this.ScheduleForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
  
    var status = this.ScheduleForm.get('STATUS')?.value;
    this.ScheduleForm.get('STATUS')?.setValue(status == 'true' ? true : false);
  
    console.log('sfds ' + JSON.stringify(this.ScheduleForm.value));
    this._scheduleService
      .updateSchedule(JSON.stringify(this.ScheduleForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this. GetScheduleList()
  
          this.ScheduleForm.setValue(this.ScheduleForm);
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }
  // DeleteSchedule(ID: number) {
  //   debugger;
  //   if (confirm('Are you sure want to delete this record ?')) {
  //     var scheduleModel = new SCHEDULE();
  //     scheduleModel.CREATED_BY = localStorage.getItem('username');
  //     scheduleModel.ID = ID;
  
  //     this._scheduleService
  //       .deleteSchedule(scheduleModel)
  //       .subscribe((res: any) => {
  //         if (res.ResponseCode == 200) {
  //           alert('Your record has been deleted successfully !');
  //           this. GetScheduleList()
  //         }
  //       });
  //   }
  // }

  DeleteSchedule(ID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._scheduleService.deleteSchedule(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
         this.GetScheduleList();
}
        });
      }
    });
  }

  getServiceName1(event: any) {
    debugger
    this.servicenameList1 = [];
    //this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        debugger;
        if (res.hasOwnProperty('Data')) {
          this.servicenameList1 = res.Data;
        }
      });
  }

  Search() {}


  Clear(){
    this.ScheduleForm.reset();
  }

  get f(){
    return this.ScheduleForm.controls;
  }
}
