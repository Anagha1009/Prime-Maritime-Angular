import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pm-landing',
  templateUrl: './pm-landing.component.html',
  styleUrls: [
    './pm-landing.component.scss',
    // './../../../assets/pm-assets/vendor/css/core.css',
    // './../../../assets/pm-assets/vendor/css/theme-default.css',
    // './../../../assets/pm-assets/css/demo.css',
    // './../../../assets/pm-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    // './../../../assets/pm-assets/vendor/css/pages/page-auth.css',
    // './../../../assets/css/style.css',
  ],
})
export class PmLandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.loadJsFile([
      './../../../assets/pm-assets/vendor/js/helpers.js',
      './../../../assets/pm-assets/js/config.js',
      './../../../assets/pm-assets/vendor/libs/jquery/jquery.js',
      // './../../../assets/pm-assets/vendor/libs/popper/popper.js',
      './../../../assets/pm-assets/vendor/js/bootstrap.js',
      './../../../assets/pm-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
      './../../../assets/pm-assets/vendor/js/menu.js',
      //'./../../../assets/pm-assets/vendor/libs/apex-charts/apexcharts.js',
      './../../../assets/pm-assets/js/main.js',
      // './../../../assets/pm-assets/js/dashboards-analytics.js',
      'https://buttons.github.io/buttons.js',
    ]);
  }

  public loadJsFile(url: any[]) {
    url.forEach((el) => {
      let node = document.createElement('script');
      node.src = el;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }
}
