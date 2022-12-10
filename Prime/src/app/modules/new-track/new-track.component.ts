import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-track',
  templateUrl: './new-track.component.html',
  styleUrls: ['./new-track.component.scss']
})
export class NewTrackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  shift(){
    var hang =document.getElementById('hang') as HTMLElement;
    // hang.style.transitionDelay="100s";
    // hang.style.marginLeft="200px";
    hang.style.animation="move-in-steps 30s infinite";
  }
}
