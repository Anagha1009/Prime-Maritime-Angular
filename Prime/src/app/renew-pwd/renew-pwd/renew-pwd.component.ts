import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewPassword } from 'src/app/models/login';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-renew-pwd',
  templateUrl: './renew-pwd.component.html',
  styleUrls: ['./renew-pwd.component.scss'],
})
export class RenewPwdComponent implements OnInit {
  changePwdForm: FormGroup;
  submitted1: boolean = false;
  hide: boolean = true;
  renewPwd: RenewPassword = new RenewPassword();

  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _loginservice: LoginService,
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.changePwdForm = this._formBuilder.group({
      NEW_PWD: ['', Validators.required],
      CONFIRM_PWD: ['', Validators.required],
    });

    this.activatedRoute.queryParams.subscribe((val) => {
      this.renewPwd.email = val['email'];
      let uriToken = val['code'];
      this.renewPwd.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  get f() {
    return this.changePwdForm.controls;
  }

  showHide() {
    this.hide = !this.hide;
  }

  resetPwd() {
    debugger;
    this.submitted1 = true;

    if (this.changePwdForm.invalid) {
      return;
    }

    if (
      this.changePwdForm.get('NEW_PWD').value ===
      this.changePwdForm.get('CONFIRM_PWD').value
    ) {
      this.renewPwd.newPassword = this.changePwdForm.get('NEW_PWD').value;
      this.renewPwd.confirmPassword =
        this.changePwdForm.get('CONFIRM_PWD').value;

      console.log(JSON.stringify(this.renewPwd));

      this._loginservice
        .renewPwd(
          this.renewPwd.email,
          this.renewPwd.emailToken,
          this.renewPwd.newPassword,
          this.renewPwd.confirmPassword
        )
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'Password reset successfull! Try logging in with new credentials '
            );
            this._router.navigateByUrl('/login');
          } else {
            this._commonService.errorMsg(
              'Password reset Failed! Your Token is expired!'
            );
          }
        });
    } else {
      this._commonService.warnMsg('Password mismatch!');
    }
  }
}
