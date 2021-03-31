import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewEncapsulation, forwardRef, HostBinding } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
	selector: 'app-chips-input',
	templateUrl: './chips-input.component.html',
	styleUrls: ['./chips-input.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ChipsInputComponent),
			multi: true
		}
	]
})
export class ChipsInputComponent implements OnInit, ControlValueAccessor {

	@Input('items') items: Array<any> = [];
	@Input('valueDisabled') valueDisabled = false;
	@Input('maxTag') maxTag = 0
	@Input('autoCompleteList') autoCompleteList: Array<any> | any = [];
	@Input('delimiters') delimiters = [];
	@Input('placeholder') placeholder = "Enter Items . . ."
	@Input('errorMsg') errorMsg = ""
	@Input('regex') regex: any;

	@Output() onAdd = new EventEmitter();
	//itemList : Array<string> = []

	@Output() onRemove = new EventEmitter();

	@ViewChild('box') AddTag: ElementRef;
	showError = '';

	constructor(public snackBar: MatSnackBar) { }

	ngOnInit() {
		// console.log(this.items);

	}

	DelimterPressed(keycode) {

		let found = false;
		this.delimiters.map(code => {
			if (code.toString() == keycode) found = true;
		})
		return found;
	}

	KeyDown(event: KeyboardEvent, tag) {
		if (event.keyCode == 13 || this.DelimterPressed(event.key)) {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
			return;

		} else if (event.keyCode == 8) {
			if ((this.AddTag.nativeElement as HTMLInputElement).value == '') {
				this.items.pop();
				this.onChange(this.items)
				this.onTouch(this.items)
			}
		}
	}



	Blur($event, tag) {
		tag = tag.trim();
		event.stopImmediatePropagation();
		event.stopPropagation();
		if (!(event.target as HTMLInputElement).value) {
			event.preventDefault();
			return;
		}
		if (this.items && this.items.filter(data => data == tag).length > 0) {
			this.showError = '*Tag name already exists';
			this.AddTag.nativeElement.value = '';
			setTimeout(() => {
				this.showError = '';
			}, 1500);
			return;
		}
		else {
			if (this.delimiters.length && this.delimiters.length == 1) {
				tag = (tag as string).split(this.delimiters[0]);
			} else {
				tag = [tag];
			}

			tag.map(val => {

				if (this.regex) {
					if (this.regex.test(val)) {
						this.items.push(val);
						this.onChange(this.items)
						this.onTouch(this.items)
						this.AddTag.nativeElement.value = '';
					} else {
						this.showError = this.errorMsg;//'*Email is not valid';
						this.AddTag.nativeElement.value = '';
						setTimeout(() => {
							this.showError = '';
						}, 1500);
						return;
					}
				} else {
					this.items.push(val);
					this.onChange(this.items)
					this.onTouch(this.items)
					this.AddTag.nativeElement.value = '';
				}

			})

		}

	}

	Paste(event: ClipboardEvent) {
		let clipboardData: DataTransfer = event.clipboardData;
		let pastedText: string | string[] = clipboardData.getData('text');
		pastedText = pastedText.trim();
		event.stopImmediatePropagation();
		event.stopPropagation();
		if (this.items && this.items.filter(data => data == pastedText).length > 0) {
			this.showError = '*Tag name already exists';
			this.AddTag.nativeElement.value = '';
			setTimeout(() => {
				this.showError = '';
			}, 1500);
			return;
		}
		else {
			if (this.delimiters.length && this.delimiters.length == 1) {
				pastedText = (pastedText as string).split(this.delimiters[0]);
			} else {
				pastedText = [pastedText];
			}

			pastedText.map(val => {

				if (this.regex) {
					if (this.regex.test(val)) {
						this.items.push(val);
						this.onChange(this.items)
						this.onTouch(this.items)
						setTimeout(() => {
							this.AddTag.nativeElement.value = '';
						}, 0);
					} else {
						this.showError = this.errorMsg;
						this.AddTag.nativeElement.value = '';
						setTimeout(() => {
							this.showError = '';
						}, 1500);
						return;
					}
				} else {
					this.items.push(val);
					this.onChange(this.items);
					this.onTouch(this.items);
					setTimeout(() => {
						this.AddTag.nativeElement.value = '';
					}, 0);
				}

			})

		}
	}



	Keyup(event: KeyboardEvent, tag) {
		tag = tag.trim();
		event.stopImmediatePropagation();
		event.stopPropagation();
		if (event.keyCode == 13 || this.DelimterPressed(event.key)) {
			if (!(event.target as HTMLInputElement).value) {
				event.preventDefault();
				return;
			}
			if (this.items && this.items.filter(data => data == tag).length > 0) {
				this.showError = '*Tag name already exists';
				this.AddTag.nativeElement.value = '';
				setTimeout(() => {
					this.showError = '';
				}, 1500);
				return;
			}
			else {
				if (this.regex) {
					if (this.regex.test(tag)) {
						this.items.push(tag);
						this.onChange(this.items)
						this.onTouch(this.items)
						this.onAdd.emit(tag);
						this.AddTag.nativeElement.value = '';
					} else {
						this.showError = this.errorMsg;
						this.AddTag.nativeElement.value = '';
						setTimeout(() => {
							this.showError = '';
						}, 1500);
						return;
					}
				} else {
					this.items.push(tag);
					this.onChange(this.items)
					this.onTouch(this.items)
					this.onAdd.emit(tag);
					this.AddTag.nativeElement.value = '';
				}
			}
		}

	}

	onRemoveTag(tagIndex, items) {
		this.items.splice(tagIndex, 1);
		this.onChange(this.items)
		this.onTouch(this.items)
		this.onRemove.emit(tagIndex)
		//this.itemList = this.items;
	}


	//#region Control Value Functions
	onChange: any = () => { }
	onTouch: any = () => { }

	// set itemList(val)  {
	//   this.itemList = this.items

	// }

	writeValue(value: any) {
		this.items
	}
	// upon UI element value changes, this method gets triggered
	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn
	}

	//#endregion

}
