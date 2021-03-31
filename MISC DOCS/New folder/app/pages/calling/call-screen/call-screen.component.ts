import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-call-screen',
  templateUrl: './call-screen.component.html',
  styleUrls: ['./call-screen.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class CallScreenComponent implements OnInit {

  showDialPad = false;
  
  constructor() { }

  toggleDialPad() {
		this.showDialPad = !this.showDialPad;
  }
  
  ngOnInit() {
  }

}
