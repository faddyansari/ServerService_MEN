import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-progress-loader',
	templateUrl: './progress-loader.component.html',
	styleUrls: ['./progress-loader.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ProgressLoaderComponent implements OnInit {

	@Input() isBig: boolean = true;
	@Input() progress: number = 0;
	// @Input() color: string = 'green';
	@Input() errored: boolean = false;
	@Output() Resend = new EventEmitter();
	@Input() status = '';
	@Output() CancelUpload = new EventEmitter();

	classes = [];

	constructor() { }

	ngOnInit() {
	}

	Cancel() {
		// console.log('Emit FromProgress Loader')
		this.CancelUpload.emit()
	}

	Retry(){
		this.Resend.emit();
	}

}