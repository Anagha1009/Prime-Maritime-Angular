import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewPwdRoutingModule } from './renew-pwd-routing.module';
import { RenewPwdComponent } from './renew-pwd/renew-pwd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    RenewPwdComponent
  ],
  imports: [
    CommonModule,
    RenewPwdRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class RenewPwdModule { }
