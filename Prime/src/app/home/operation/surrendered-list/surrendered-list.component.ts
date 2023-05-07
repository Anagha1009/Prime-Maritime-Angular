import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-surrendered-list',
  templateUrl: './surrendered-list.component.html',
  styleUrls: ['./surrendered-list.component.scss'],
})
export class SurrenderedListComponent implements OnInit {
  blSurrenderedList: any[] = [];
  blFiles: any;
  BASE_URL: string = environment.BASE_URL2;
  blNo: any;
  isSurrendered: boolean = false;

  constructor(
    private _commonService: CommonService,
    private _blService: BlService
  ) {}

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  ngOnInit(): void {
    this.getBLSurrenderedList();
  }

  getBLSurrenderedList() {
    this._commonService.destroyDT();
    var pod = this._commonService.getUser().port.replace(',', ' ');
    var orgCode = this._commonService.getUser().orgcode;

    this._blService.GetBLSurrenderedList(orgCode, pod).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blSurrenderedList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getBLFiles(blNo: any, value: any) {
    this.isSurrendered = value;
    this._blService.GetBLFiles(blNo).subscribe((res: any) => {
      if (res.responseCode == 200) {
        this.blFiles = res.data;
        this.blNo = blNo;
        this.openBtn.nativeElement.click();
      } else {
        this._commonService.errorMsg('Sorry, No Files Found !');
      }
    });
  }

  markSurrender() {
    if (this.isSurrendered) {
      this._commonService.warnMsg('This BL is already marked as surrendered !');
    } else {
      Swal.fire({
        title: 'Mark Surrender',
        text: 'Are you sure want to mark this BL Files as surrendered ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
      }).then((result) => {
        if (result.isConfirmed) {
          this._blService.InsertSurrender(this.blNo).subscribe();
          this.closeBtn.nativeElement.click();
          this.getBLSurrenderedList();
          this._commonService.successMsg(
            this.blNo + ' is marked surrendered successfully !'
          );
        }
      });
    }
  }
}
