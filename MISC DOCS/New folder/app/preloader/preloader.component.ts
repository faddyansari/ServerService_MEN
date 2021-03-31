import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreloaderComponent implements OnInit {

  @Input() type : string;
  constructor() {
   }

  ngOnInit() {
    //console.log(this.type);
  }

}
