import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef,ITextFilterParams } from 'ag-grid-community';
import { contains } from 'jquery';
import { filter, Observable } from 'rxjs';
import { CmService } from 'src/app/services/cm.service';

@Component({
  selector: 'app-ct-list',
  templateUrl: './ct-list.component.html',
  styleUrls: ['./ct-list.component.scss']
})
export class CtListComponent implements OnInit {
  previewDetails:boolean=false;
  previewNoData:boolean=false;
  conNo:any='';
  ctList:any[]=[];

  //AGGrid
  public rowData:any[]=[];
  private gridApi: any;
  private gridColumnApi: any;  
  defaultPageSize = 10;
  columnDefs:ColDef[];
  customFilterParams: ITextFilterParams = {
  filterOptions: ['contains'],
  debounceMs: 200,
  suppressAndOrCondition: true,
  } as ITextFilterParams;

  constructor(private _cmService:CmService,private _router:Router) { }

  ngOnInit(): void {
    this.columnDefs=[
      {field:'BOOKING_NO',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'CRO_NO',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'CONTAINER_NO',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'ACTIVITY',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'PREV_ACTIVITY',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'ACTIVITY_DATE',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'LOCATION',sortable:true,filter:true,filterParams:this.customFilterParams},
      {field:'STATUS',sortable:true,filter:true,filterParams:this.customFilterParams}
  
    ];

  }

  onPageSizeChanged(event: any) {
    this.gridApi.paginationSetPageSize(Number(event.target.value));
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setDatasource(this.rowData);
  }

  getTrackingHistoryList(){
    debugger;
    this.previewDetails=false;
    this.previewNoData=false;
    if(this.conNo==''){
      alert('Please enter container number');
    }
    else{
      this._cmService.getTrackingHistory(this.conNo).subscribe(
        (res: any) => {
          debugger;
          this.ctList = [];
          //this.isScroll = false;
          if (res.ResponseCode == 200) {
            if (res.Data?.length > 0) {
              this.ctList = res.Data;
              console.log(this.ctList);
              this.rowData=res.Data;
              this.previewDetails=true;
              // if (this.doList?.length >= 4) {
              //   this.isScroll = true;
              // } else {
              //   this.isScroll = false;
              // }
            }
            else{
              this.previewNoData=true;
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
  
  }

}
