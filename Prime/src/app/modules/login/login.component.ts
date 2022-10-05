import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    private loginservice: LoginService,
    private FormBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
      USERNAME: ['', Validators.required],
      PASSWORD: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  validateLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    var rootobject = new LOGIN();
    rootobject.USERNAME = this.loginForm.get('USERNAME')?.value;
    rootobject.PASSWORD = this.loginForm.get('PASSWORD')?.value;

    this.loginservice
      .validateLogin(JSON.stringify(rootobject))
      .subscribe((res) => {
        if (res.isAuthenticated == true) {
          localStorage.clear();
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.userName);
          localStorage.setItem('rolecode', res.roleCode);
          this.router.navigateByUrl('home/agent-dashboard');
        } else {
          alert(res.message);
          return;
        }
      });
  }
}
