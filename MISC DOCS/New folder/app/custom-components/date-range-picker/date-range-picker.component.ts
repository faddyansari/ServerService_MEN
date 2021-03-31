import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Output, Input, EventEmitter, ComponentRef } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker';

@Component({
	selector: 'app-date-range-picker',
	templateUrl: './date-range-picker.component.html',
	styleUrls: ['./date-range-picker.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DateRangePickerComponent implements OnInit {

	@Input('to') to: string = this.customFormatter(new Date());
	@Input('from') from: string = this.customFormatter(this.SubtractDays(new Date(), 30));
	@Input('showButton') showButton: boolean = true;
	// @Input('def')
	@ViewChild('fromElem') fromElem: ElementRef;
	@ViewChild('toElem') toElem: ElementRef;
	@Output() onDateChanged = new EventEmitter();
	@Output() submit = new EventEmitter();
	dates: any = {
		to: this.to,
		from: this.from
	}
	selectedType = '';
	showError = '';
	buttonSelected = 'month';
	initialized = false;
	constructor() { }

	ngOnInit() {
	}

	datePickerConfig: IDatePickerConfig = {
		format: 'MM-DD-YYYY',
		unSelectOnClick: false,
		closeOnSelect: false,
		hideInputContainer: false,
		hideOnOutsideClick: false,
		showGoToCurrent: true
	}


	DateSelected(type) {
		if (type) {
			this.buttonSelected = type;
		}

		// console.log('Date Selected');
		switch (type) {
			case 'today':
				this.dates.from = this.customFormatter(new Date());
				this.dates.to = this.customFormatter(new Date());
				break
			case 'yesterday':
				this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 1));
				this.dates.to = this.customFormatter(this.SubtractDays(new Date(), 1));
				break;
			case 'week':
				this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 7));
				this.dates.to = this.customFormatter(new Date());
				break;
			case 'month':
				this.dates.from = this.customFormatter(this.SubtractDays(new Date(), 30));
				this.dates.to = this.customFormatter(new Date());
				break;
			case 'pastsixmonths':
				this.dates.from = this.customFormatter(this.SubtractMonths(new Date(), 6));
				this.dates.to = this.customFormatter(new Date());
				break;
			default:
				break;

		}
		// console.log(this.dates);
		// this.onDateChanged.emit(this.dates);
		let from = new Date(this.dates.from);
		let to = new Date(this.dates.to);
		let status = false;
		if (from > to || to < from) {
			console.log('Invalid date!');
			this.showError = 'Invalid date!'
			status = false;
		} else {
			this.showError = ''
			status = true;
			// console.log(this.dates);		
		}
		this.onDateChanged.emit({ dates: this.dates, status: status });


	}

	// submit(){
	// 	let from = new Date(this.dates.from);
	// 	let to = new Date(this.dates.to);

	// 	if(from > to || to < from){
	// 		console.log('Invalid date!');
	// 		this.showError = 'Invalid date!'
	// 		setTimeout(() => {
	// 			this.showError = '';
	// 		}, 2000);
	// 	}else{
	// 		// console.log(this.dates);
	// 		this.onDateChanged.emit(this.dates);
	// 		this.changes = false;
	// 	}
	// }

	// cancel(){
	// 	// this.dates.to = this.to;
	// 	// this.dates.from = this.from;
	// 	let dates: any = {
	// 		from: this.from,
	// 		to: this.to
	// 	}
	// 	this.onDateChanged.emit(dates);
	// }

	SubtractDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() - days);
		return result;
	}
	SubtractMonths(date, months) {
		var result = new Date(date);
		result.setMonth(result.getMonth() - months);
		return result;
	}

	customFormatter(date: Date) {
		return ("0" + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + '-' + date.getFullYear();
	}


	ngAfterViewInit(): void {
		//console.log('AfterViewInit');

		setTimeout(() => {
			setTimeout(() => {
				//console.log(this.fromElem.nativeElement as any);
				//console.log(this.toElem.nativeElement as any);

				(this.fromElem.nativeElement as any).focus();
				(this.toElem.nativeElement as any).focus();
			}, 0);
		}, 0);
	}

	public Show() {
		//console.log('Showing');

		(this.fromElem.nativeElement as any).focus();
		(this.toElem.nativeElement as any).focus();
	}

	ngOnDestroy() {
		this.dates = {
			from: '',
			to: ''
		}
	}

	Submit() {
		let from = new Date(this.dates.from);
		let to = new Date(this.dates.to);
		let status = false;
		if (from > to || to < from) {
			//console.log('Invalid date!');
			this.showError = 'Invalid date!'
			status = false;
		} else {
			this.showError = ''
			status = true;
			console.log(this.dates);

			this.submit.emit({ dates: this.dates, status: status });
			// console.log(this.dates);		
		}
	}

}
