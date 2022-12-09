import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LOADLIST } from 'src/app/models/loadlist';
import { CommonService } from 'src/app/services/common.service';
import { LoadListService } from 'src/app/services/load-list.service';
import * as xlsx from 'xlsx';


@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.scss']
})
export class LoadListComponent implements OnInit {
  submitted: boolean = false;
  loadlistForm: FormGroup;
  loadList: any[] = [];
  VesselList:any[]=[];
  VoyageList:any[]=[];
  data: any;
  isUpdate: boolean = false;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(  private _loadListService: LoadListService, private _formBuilder: FormBuilder,
    private _commonService:CommonService,
    private route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {
    this.loadlistForm=this._formBuilder.group({
      VESSEL_NAME: [''],
      VOYAGE_NO:['']

    })
    this.getDropdown();
    this.GetLoadList();
  }

  exportToExcel() {
    debugger;
    const ws: xlsx.WorkSheet =   
    xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }


  GetLoadList() {
    debugger;
    var loadListModel=new LOADLIST();
    loadListModel.VESSEL_NAME=this.loadlistForm.get("VESSEL_NAME")?.value
    loadListModel.VOYAGE_NO=this.loadlistForm.get("VOYAGE_NO")?.value

    this. _loadListService.GetLoadList(loadListModel).subscribe((res: any) => {
      
    console.log(res)
      if (res.ResponseCode == 200) {
        this.loadList = res.Data;
      }
    });
  }
  
  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.VesselList = res.Data;
      }
    });

    this._commonService.getDropdownData('VOYAGE_NO').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.VoyageList = res.Data;
      }
    });

  }
 

}
