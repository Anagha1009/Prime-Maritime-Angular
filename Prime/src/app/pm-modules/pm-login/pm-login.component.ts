import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN } from 'src/app/models/login';
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

  constructor(
    private _loginservice: LoginService,
    private _formBuilder: FormBuilder,
    private _router: Router
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

  onChange(changeEvent: boolean, idx: number): void {
    console.log(changeEvent, idx);
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
        this.isLoading = false;

        if (res.roleCode == '1') {
          this._router.navigateByUrl('/home/srr-list');
        } else if (res.roleCode == '3') {
          this._router.navigateByUrl('/home/depo');
        } else if (res.roleCode == '2') {
          this._router.navigateByUrl('/pm/dashboard');
        }
      });
  }
}
