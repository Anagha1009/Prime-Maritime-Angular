import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() menu: string;
  menuList: any[] = [];
  public selectedLanguage: any = 'en';

  constructor(
    private _router: Router,
    public _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getMenuList(this.menu);
    this.setLanguage('en');
  }

  setLanguage(language: any): void {
    this.selectedLanguage = language;
    this._translateService.use(language);
  }

  getMenuList(param: any) {
    if (param == 'agent') {
      this.menuList.push(
        { menuName: 'Rate Requests', menuLink: 'home/quotation-list' },
        { menuName: 'Bookings', menuLink: 'javascript:void(0)' },
        { menuName: 'Operations', menuLink: 'javascript:void(0)' },
        { menuName: 'Container Movement', menuLink: 'javascript:void(0)' },
        { menuName: 'Finance', menuLink: 'javascript:void(0)' }
      );
    }
  }

  logout() {
    if (confirm('Are you sure want to logout ?')) {
      localStorage.clear();
      this._router.navigateByUrl('login');
    }
  }
}
