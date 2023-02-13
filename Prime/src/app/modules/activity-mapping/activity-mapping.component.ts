import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivityId } from 'src/app/models/activity-mapping';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity-mapping',
  templateUrl: './activity-mapping.component.html',
  styleUrls: ['./activity-mapping.component.scss'],
})
export class ActivityMappingComponent implements OnInit {
  activityMappingForm: FormGroup;
  activityList: any[] = [];
  submitted: boolean = false;
  dropdownSettings = {};
  selectedItems: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'ACT_NAME',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 2,
      searchPlaceholderText: 'Select Activity Code',
      noDataAvailablePlaceholderText: 'No Activity Code Present',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.activityMappingForm = this._formBuilder.group({
      ACT_ID: ['', Validators.required],
      ACT_SEQ_DROPDOWN: new FormControl(this.activityList, Validators.required),
      ACT_SEQ_ID: new FormArray([]),
      CREATED_BY: [''],
    });

    this.getActivityList();
  }

  get f() {
    return this.activityMappingForm.controls;
  }

  get f2() {
    var c = this.activityMappingForm.get('ACT_SEQ_ID') as FormArray;
    return c.controls;
  }

  getActivityList() {
    this._activityService.getActivityList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.activityList = res.Data;
        console.log(JSON.stringify(this.activityList));
      }
    });
  }

  InsertMapping() {
    this.submitted = true;

    const add = this.activityMappingForm.get('ACT_SEQ_ID') as FormArray;
    add.clear();
    this.selectedItems.forEach((element) => {
      add.push(
        this._formBuilder.group({
          ID: [element.ID],
          ACT_NAME: [element.ACT_NAME],
        })
      );
    });
    this.activityMappingForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    this.activityMappingForm.get('ACT_SEQ_ID')?.setValue(this.selectedItems);

    console.log(JSON.stringify(this.activityMappingForm.value));
    debugger;
    this._activityService
      .postActivityMapping(JSON.stringify(this.activityMappingForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Mapping has successfully Created!');
          this._router.navigateByUrl('/home/srr-list');
        }
      });
  }

  CancelMapping() {
    this.activityMappingForm.get('ACT_ID')?.setValue('');
    this.activityMappingForm.get('ACT_SEQ_DROPDOWN')?.setValue('');
  }
}
