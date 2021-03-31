import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-range-slider',
	templateUrl: './range-slider.component.html',
	styleUrls: ['./range-slider.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RangeSliderComponent implements OnInit {
	@Input() dbValue: string;
	@Input() minVal: string;
	@Input() maxVal: string;
	@Input() displayVal: any;
	@Input() controlValue: any;
	@Input() setting: any;
	@Input() settingType: any;
	@Input() disabled: boolean = false;


	@Output() controlVal = new EventEmitter();

	bulletPosition: any;


	constructor() {
		
	}

	ngOnInit() {
	}

	showSliderValue(ev) {
		this.bulletPosition = ev.target.value;
		//this.bulletPosition = ev.target.value;
		this.controlVal.emit({ value: ev.target.value, controlValue: this.controlValue, settingType: this.settingType, setting: this.setting });
	}

	DisableInput(event: KeyboardEvent) {
		event.preventDefault();
	}


}
