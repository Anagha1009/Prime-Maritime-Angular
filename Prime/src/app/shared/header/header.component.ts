import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() menu: string;
  menuList: any[] = [];

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.getMenuList(this.menu);
  }

  getMenuList(param: any) {
    if (param == 'agent') {
      this.menuList.push(
        { menuName: 'Rate Requests', menuLink: 'home/quotation-list' },
        { menuName: 'Bookings', menuLink: 'javascript:void(0)' },
        { menuName: 'CRO', menuLink: 'home/cro-list' },
        { menuName: 'DO', menuLink: 'home/do-list' },
        { menuName: 'BL', menuLink: 'home/new-bl' },
        { menuName: 'Container Movement', menuLink: 'home/new-cm' },
        // { menuName: 'Track', menuLink: 'home/new-track' },
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
