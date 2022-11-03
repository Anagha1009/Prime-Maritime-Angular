import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss']
})
export class DoListComponent implements OnInit {

  doList:any[]=[];

  constructor() { }

  ngOnInit(): void {
  }

}
