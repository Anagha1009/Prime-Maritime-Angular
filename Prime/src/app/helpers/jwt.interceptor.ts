import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from '../services/common.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  module: string;
  value: boolean = false;

  constructor(private _commonService: CommonService) {}
  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    var isApiUrl = request.url.startsWith(environment.BASE_URL);
    if (window.location.href.includes('srr')) {
      this.value = true;
    } else {
      this.value = false;
    }

    // const login = localStorage.getItem('login');

    if (isApiUrl && this._commonService.getUser()) {
      // if (login != null) {
      //   request = request.clone({
      //     setHeaders: {
      //       Authorization: 'Bearer ' + this.token,
      //     },
      //   });
      //   localStorage.removeItem('login');
      // } else if (this.value) {
      //   request = request.clone({
      //     setHeaders: {
      //       Authorization: 'Bearer ' + this.token,
      //     },
      //   });
      // }
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this._commonService.getUser().token,
        },
      });
    }

    return next.handle(request);
  }
}
