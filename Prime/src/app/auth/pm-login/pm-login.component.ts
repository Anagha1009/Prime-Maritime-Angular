import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN } from 'src/app/models/login';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-pm-login',
  templateUrl: './pm-login.component.html',
  styleUrls: ['./pm-login.component.scss'],
})
export class PmLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  button: string;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  isLoading1: boolean = false;
  email: any = '';
  isemail: boolean = true;

  constructor(
    private _loginservice: LoginService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _cmService: CommonService
  ) {
    // redirect to home if already logged in
    if (this._loginservice.userValue) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      USERNAME: [''],
      PASSWORD: [''],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    var rootobject = new LOGIN();
    rootobject.USERNAME = this.loginForm.get('USERNAME')?.value;
    rootobject.PASSWORD = this.loginForm.get('PASSWORD')?.value;
    this.isLoading = true;
    this._loginservice
      .login(JSON.stringify(rootobject))
      .subscribe((res: any) => {
        debugger;
        this.isLoading = false;
        if (res.message?.includes('No Accounts Registered')) {
          this._cmService.warnMsg(
            'Account is not Registered! Try logging in with a registered account'
          );
          this._loginservice.logout();
          return;
        } else if (res.message?.includes('Credentials for')) {
          this._cmService.warnMsg(
            'Invalid Credentials! Try entering valid credentials'
          );
          this._loginservice.logout();
          return;
        } else {
          if (res.roleCode == '1') {
            this._router.navigateByUrl('/home/rate-request/srr-list');
          } else if (res.roleCode == '3') {
            this._router.navigateByUrl('/home/depo/depo-dashboard');
          } else if (res.roleCode == '2') {
            this._router.navigateByUrl('/pm/dashboard');
          } else if (res.roleCode == '4') {
            this._router.navigateByUrl('/pm/dashboard');
          } else if (res.roleCode == '5') {
            this._router.navigateByUrl('/pm/dashboard');
          }
        }
      });
  }

  //forgot pwd logic
  askMail() {
    this.openBtn.nativeElement.click();
  }
  sendLink() {
    if (this.email == '') {
      this.isemail = false;
      return;
    }
    this.isLoading1 = true;

    this._loginservice
      .sendResetPasswordLink(this.email)
      .subscribe((res: any) => {
        debugger;
        if (res.responseCode == 200) {
          this.isLoading1 = false;
          this._cmService.successMsg(
            'Reset Password Link has been send successfully ! Check your mail and reset your password before the link gets expired'
          );
          this.email = '';
          this.closeBtn.nativeElement.click();
        } else {
          this.isLoading1 = false;
          this._cmService.errorMsg(
            "Reset Link send Failed because email doesn't exist!"
          );
          this.email = '';
          this.closeBtn.nativeElement.click();
        }
      });
  }
}
