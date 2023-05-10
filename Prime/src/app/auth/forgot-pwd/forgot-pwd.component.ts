import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.scss'],
})
export class ForgotPwdComponent implements OnInit {
  submitted: boolean = false;
  submitted1: boolean = false;
  isLoading: boolean = false;
  showFields: boolean = false;
  currentPwd: any = '';
  changePwdForm: FormGroup;

  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _loginservice: LoginService
  ) {}

  ngOnInit(): void {
    this.changePwdForm = this._formBuilder.group({
      NEW_PWD: ['', Validators.required],
      CONFIRM_PWD: ['', Validators.required],
    });
  }

  get f() {
    return this.changePwdForm.controls;
  }

  checkPwd() {
    this.isLoading = true;
    this.submitted = true;

    if (this.currentPwd == '') {
      this.isLoading = false;
      return;
    }

    this._loginservice
      .validatePwd(this.currentPwd, this._commonService.getUserId())
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.ResponseCode == 200) {
          this.showFields = true;
        } else {
          this._commonService.warnMsg('Incorrect Password!');
        }
      });
  }

  resetPwd() {
    this.submitted1 = true;

    if (this.changePwdForm.invalid) {
      return;
    }

    if (
      this.changePwdForm.get('NEW_PWD').value ===
      this.changePwdForm.get('CONFIRM_PWD').value
    ) {
      this._loginservice
        .resetPwd(
          this._commonService.getUserId(),
          this.changePwdForm.get('NEW_PWD').value
        )
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'Password changed successfully! Try logging in with new credentials'
            );
            this._loginservice.logout();
          } else {
            this._commonService.warnMsg('Incorrect Password!');
          }
        });
    } else {
      this._commonService.warnMsg(
        "Passwords don't match! Try entering same password"
      );
    }
  }
}
