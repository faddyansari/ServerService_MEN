import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-callee-list',
	templateUrl: './callee-list.component.html',
	styleUrls: ['./callee-list.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class CalleeListComponent implements OnInit {
	conversation :any= {}
	constructor() { }

	ngOnInit() {
	}

}
