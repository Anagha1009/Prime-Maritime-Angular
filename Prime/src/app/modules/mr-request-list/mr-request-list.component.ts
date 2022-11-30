import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DepoService } from 'src/app/services/depo.service';

@Component({
  selector: 'app-mr-request-list',
  templateUrl: './mr-request-list.component.html',
  styleUrls: ['./mr-request-list.component.scss'],
})
export class MrRequestListComponent implements OnInit {
  mrForm: FormGroup;
  mrList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _depoService: DepoService
  ) {}

  ngOnInit(): void {
    this.mrForm = this._formBuilder.group({
      MR_NO: [''],
      CONTAINER_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });
  }
}
