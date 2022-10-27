import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private _loginservice: LoginService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

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

    this._loginservice
      .validateLogin(JSON.stringify(rootobject))
      .subscribe((res: any) => {
        if (res.isAuthenticated == true) {
          localStorage.clear();
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.userName);
          localStorage.setItem('rolecode', res.roleCode);
          localStorage.setItem('usercode', res.userCode);
          this._router.navigateByUrl('/home/quotation-list');
        } else {
          alert(res.message);
          return;
        }
      });
  }
}
