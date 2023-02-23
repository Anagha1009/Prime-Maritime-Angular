import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-depo-dashboard',
  templateUrl: './depo-dashboard.component.html',
  styleUrls: ['./depo-dashboard.component.scss'],
})
export class DepoDashboardComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}
}
