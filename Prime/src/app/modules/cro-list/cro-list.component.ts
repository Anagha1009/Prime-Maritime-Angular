import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cro-list',
  templateUrl: './cro-list.component.html',
  styleUrls: ['./cro-list.component.scss'],
})
export class CroListComponent implements OnInit {
  croForm: FormGroup;
  isScroll: boolean = false;
  croList: any[] = [];

  constructor(private FormBuilder: FormBuilder, private router: Router) {}

  @ViewChild('closeBtn3') closeBtn3: ElementRef;

  ngOnInit(): void {
    this.croForm = this.FormBuilder.group({
      CRO_NO: [''],
      CUSTOMER_NAME: [''],
      STATUS: [''],
    });
  }

  closeModal(): void {
    this.closeBtn3.nativeElement.click();
  }

  redirectToSubMenu(p) {
    this.closeModal();
    if (p == 'cro') {
      this.router.navigateByUrl('/home/new-cro');
    } else if (p == 'booking') {
      this.router.navigateByUrl('/home/bookings');
    }
  }
}
