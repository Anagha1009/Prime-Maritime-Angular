import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/header/en';
import { locale as hindi } from 'src/app/@core/translate/header/hi';
import { locale as arabic } from 'src/app/@core/translate/header/ar';

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
    public _translateService: TranslateService,
    private _coreTranslationService: CoreTranslationService
  ) {}

  ngOnInit(): void {
    this.setLanguage('en');
  }

  setLanguage(language: any): void {
    this.selectedLanguage = language;
    this._translateService.use(language);
    this._coreTranslationService.translate(
      language == 'en' ? english : language == 'hi' ? hindi : arabic
    );
    this.getMenuList(this.menu);
  }

  getMenuList(param: any) {
    this.menuList = [];
    if (param == 'agent') {
      this.menuList.push(
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.rateRequest
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.rateRequest
              : arabic.data.Menu.rateRequest,
          menuLink: 'home/quotation-list',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.bookings
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.bookings
              : arabic.data.Menu.bookings,
          menuLink: 'javascript:void(0)',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.operations
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.operations
              : arabic.data.Menu.operations,
          menuLink: 'javascript:void(0)',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.containerMovement
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.containerMovement
              : arabic.data.Menu.containerMovement,
          menuLink: 'javascript:void(0)',
        },
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
