import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { LOGIN } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  BASE_URL = environment.BASE_URL;
  private userSubject: BehaviorSubject<LOGIN>;
  public user: Observable<LOGIN>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<LOGIN>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): LOGIN {
    return this.userSubject.value;
  }

  login(rootobject: any) {
    return this._http
      .post<any>(
        this.BASE_URL + 'Account/authenticate',
        rootobject,
        this.httpOptions
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  validatePwd(password: any, userId: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Account/Validate-Pwd',
      { PASSWORD: password, ID: userId },
      this.httpOptions
    );
  }

  resetPwd(userId: any, password: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Account/Reset-Pwd',
      { PASSWORD: password, ID: userId },
      this.httpOptions
    );
  }

  getUserList() {
    return this._http.get<any>(
      this.BASE_URL + 'User/GetUserList',
      this.httpOptions
    );
  }

  insertUser(user: any) {
    return this._http.post<any>(
      this.BASE_URL + 'User/InsertUser',
      user,
      this.httpOptions
    );
  }

  validateUsercode(usercode: string) {
    return this._http.post<any>(
      this.BASE_URL + 'User/ValidateUsercode?usercode=' + usercode,
      this.httpOptions
    );
  }

  getUser(usercode: string) {
    return this._http.get<any>(
      this.BASE_URL + 'User/GetUser?usercode=' + usercode,
      this.httpOptions
    );
  }

  updateUser(user: any) {
    return this._http.post<any>(
      this.BASE_URL + 'User/UpdateUser',
      user,
      this.httpOptions
    );
  }

  deleteUser(usercode: string) {
    return this._http.post<any>(
      this.BASE_URL + 'User/DeleteUser?usercode=' + usercode,
      this.httpOptions
    );
  }
}
