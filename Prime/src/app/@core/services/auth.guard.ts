import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: LoginService,
    private _commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.authenticationService.userValue;
    if (user) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
        // role not authorised so redirect to home page
        this._commonService.warnMsg(
          'Sorry you are not authenticated to Access this Page ! Please Login with correct Credentials.'
        );
        this.authenticationService.logout();
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
