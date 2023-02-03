import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pm-sidebar',
  templateUrl: './pm-sidebar.component.html',
  styleUrls: ['./pm-sidebar.component.scss'],
})
export class PmSidebarComponent implements OnInit {
  ismenu: boolean = true;
  submenu: string = '';
  constructor(private _router: Router) {}

  ngOnInit(): void {
    // this.loadJsFile([
    //   'assets/pm-assets/vendor/js/helpers.js',
    //   'assets/pm-assets/js/config.js',
    //   'assets/pm-assets/vendor/libs/jquery/jquery.js',
    //   'assets/pm-assets/vendor/libs/popper/popper.js',
    //   'assets/pm-assets/vendor/js/bootstrap.js',
    //   'assets/pm-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
    //   'assets/pm-assets/vendor/js/menu.js',
    //   //'./../../../assets/pm-assets/vendor/libs/apex-charts/apexcharts.js',
    //   'assets/pm-assets/js/main.js',
    //   // './../../../assets/pm-assets/js/dashboards-analytics.js',
    //   'https://buttons.github.io/buttons.js',
    // ]);
  }

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
    this._router.navigateByUrl('/pm/' + value);
  }

  logout() {
    localStorage.clear();
    this._router.navigateByUrl('login');
  }
}
