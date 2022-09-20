import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/models/login-model';
import { LoginServiceService } from 'src/app/services/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private loginservice: LoginServiceService,
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
    var rootobject = new LoginModel();
    rootobject.USERNAME = this.loginForm.get('USERNAME')?.value;
    rootobject.PASSWORD = this.loginForm.get('PASSWORD')?.value;

    this.loginservice
      .validateLogin(JSON.stringify(rootobject))
      .subscribe((res) => {
        localStorage.clear();
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('agent-dashboard');
      });
  }
}
