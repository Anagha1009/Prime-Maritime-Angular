import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/header/en';
import { locale as hindi } from 'src/app/@core/translate/header/hi';
import { locale as arabic } from 'src/app/@core/translate/header/ar';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() menu: string;
  @Input() username: string;

  menuList: any[] = [];
  public selectedLanguage: any = 'en';

  constructor(
    public _translateService: TranslateService,
    private _coreTranslationService: CoreTranslationService,
    private _loginService: LoginService,
    private http: HttpClient
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
    if (param == 1) {
      this.menuList.push(
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.rateRequest
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.rateRequest
              : arabic.data.Menu.rateRequest,
          menuLink: '/home/rate-request/srr-list',
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
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.Finance
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.Finance
              : arabic.data.Menu.Finance,
          menuLink: 'javascript:void(0)',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.Others
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.Others
              : arabic.data.Menu.Others,
          menuLink: 'javascript:void(0)',
        }
      );
    } else if (param == 3) {
      this.menuList.push(
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.containerAllotment
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.containerAllotment
              : arabic.data.Menu.containerAllotment,
          menuLink: '/home/depo/container-allotment',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.mnrRequest
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.mnrRequest
              : arabic.data.Menu.mnrRequest,
          menuLink: '/home/depo/mr-request',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.Inventory
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.Inventory
              : arabic.data.Menu.Inventory,
          menuLink: '/home/depo/inventory-list',
        },
        {
          menuName:
            this.selectedLanguage == 'en'
              ? english.data.Menu.containerMovement
              : this.selectedLanguage == 'hi'
              ? hindi.data.Menu.containerMovement
              : arabic.data.Menu.containerMovement,
          menuLink: 'javascript:void(0)',
        }
      );
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this._loginService.logout();
      }
    });
  }

  downloadSI() {
    this.http
      .get('assets/img/Shipping Instructions.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/Shipping Instructions.xlsx';
        link.download = path.replace(/^.*[\\\/]/, '');
        link.click();
      });
  }
}
