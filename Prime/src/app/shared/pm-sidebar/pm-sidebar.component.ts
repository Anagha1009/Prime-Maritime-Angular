import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-pm-sidebar',
  templateUrl: './pm-sidebar.component.html',
  styleUrls: ['./pm-sidebar.component.scss'],
})
export class PmSidebarComponent implements OnInit {
  ismenu: boolean = false;
  ismenu1: boolean = false;
  submenu: string = '';
  submenu1: string = '';
  menu: string = 'dashboard';
  @Input() username: string;

  constructor(private _router: Router, private _loginService: LoginService) {}

  ngOnInit(): void {}

  public loadJsFile(url: any[]) {
    url.forEach((el) => {
      let node = document.createElement('script');
      node.src = el;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }

  redirectToSubMenu(value: string) {
    this.ismenu = true;
    this.submenu = value;
    this.submenu1 = '';
    this.menu = 'master';
    this._router.navigateByUrl('/master/' + value);
  }

  redirectToSubMenu1(value: string) {
    this.ismenu1 = true;
    this.submenu1 = value;
    this.ismenu = true;
    this._router.navigateByUrl('/master/' + value);
  }

  redirectToMenu(value: string) {
    this.menu = value;
    this._router.navigateByUrl('/pm/' + value);
  }

  logout() {
    this._loginService.logout();
  }
}
