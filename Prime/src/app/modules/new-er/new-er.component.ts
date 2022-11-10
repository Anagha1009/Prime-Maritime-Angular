import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ErService } from 'src/app/services/er.service';

@Component({
  selector: 'app-new-er',
  templateUrl: './new-er.component.html',
  styleUrls: ['./new-er.component.scss']
})
export class NewErComponent implements OnInit {
  erForm: FormGroup;
  submitted: boolean = false;
  disabled = false;
  public loadContent: boolean = false;
  dummyList: any[] = [
    {
      CONTAINER_NO: "RTEB67575347",
      CONTAINER_TYPE: "Open Storage",
      CONTAINER_SIZE: "40 ft",
      SEAL_NO: "34dfcd3672",
      MARKS_NOS: "sfdg",
      DESC_OF_GOODS: "test",
      GROSS_WEIGHT: 54776.00,
      MEASUREMENT: "50",
      AGENT_CODE: "0325",
      AGENT_NAME: "agent",
      CREATED_BY: "agent"
    },
    {
      CONTAINER_NO: "RTEB67575347",
      CONTAINER_TYPE: "Open Storage",
      CONTAINER_SIZE: "40 ft",
      SEAL_NO: "34dfcd3672",
      MARKS_NOS: "sfdg",
      DESC_OF_GOODS: "test",
      GROSS_WEIGHT: 54776.00,
      MEASUREMENT: "50",
      AGENT_CODE: "0325",
      AGENT_NAME: "agent",
      CREATED_BY: "agent"
    }
  ];
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};

  constructor(private _formBuilder: FormBuilder,
    private _erService: ErService,
    private _router: Router) { }

  ngOnInit(): void {
    this.containerDropdownList = [
      { item_id: 1, item_text: 'SIKU3034664' },
      { item_id: 2, item_text: 'TLLU8316901' },
      { item_id: 3, item_text: 'TCKU2125749' },
      { item_id: 4, item_text: 'SEGU1759710' },
      { item_id: 5, item_text: 'SEGU1900639' },
      { item_id: 6, item_text: 'TCLU3387545' },
      { item_id: 7, item_text: 'SIKU2952032' },
      { item_id: 8, item_text: 'SEGU1561659' },
      { item_id: 9, item_text: 'SEGU1706269' },
      { item_id: 10, item_text: 'VSBU2058560' },
      { item_id: 11, item_text: 'GESU1163666' },
      { item_id: 12, item_text: 'SEGU1552683' },
      { item_id: 13, item_text: 'SIKU3060792' },
      { item_id: 14, item_text: 'SIKU3040374' },
      { item_id: 15, item_text: 'TLLU8398406' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
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
      MOVEMENT_DATE: ['', Validators.required],
      LIFT_ON_CHARGE: ['', Validators.required],
      LIFT_OFF_CHARGE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      NO_OF_CONTAINER: [''],
      MODE_OF_TRANSPORT: [''],
      REASON: ['', Validators.required],
      REMARKS: ['', Validators.required],
      STATUS: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormControl(this.containerDropdownList, Validators.required),
    });

    this.loadContent = true;


  }

  get f() {
    return this.erForm.controls;

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
    this.erForm.get('REPO_NO')?.setValue(this.getRandomNumber("Repo"));
    this.erForm.get('CONTAINER_LIST')?.setValue(this.dummyList);
    this.erForm.get('NO_OF_CONTAINER')?.setValue(2);
    this.erForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.erForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
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
