import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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

  constructor(
    private loginservice: LoginService,
    private FormBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.FormBuilder.group({
      USERNAME: [''],
      PASSWORD: [''],
    });
  }

  validateLogin() {
    var rootobject = new LOGIN();
    rootobject.USERNAME = this.loginForm.get('USERNAME')?.value;
    rootobject.PASSWORD = this.loginForm.get('PASSWORD')?.value;

    this.loginservice
      .validateLogin(JSON.stringify(rootobject))
      .subscribe((res) => {
        debugger;
        localStorage.removeItem('token');
        localStorage.setItem('token', res.token);
        var token = localStorage.getItem('token');
        if (token != '') {
          this.router.navigateByUrl('home/agent-dashboard');
        }
      });
  }
}
