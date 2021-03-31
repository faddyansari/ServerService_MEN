import { Component, OnInit, ViewEncapsulation, forwardRef, Input, Output, EventEmitter, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { PopperContent } from 'ngx-popper';

@Component({
	selector: 'app-custom-select',
	templateUrl: './custom-select.component.html',
	styleUrls: ['./custom-select.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomSelectComponent),
			multi: true
		}
	]
})
export class CustomSelectComponent implements OnInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef;
	@ViewChild('optionsPopper') optionsPopper: PopperContent;
	scrollHeight = 0;
	//Inputs
	@Input('items') items: Array<any> = [];
	@Input('selectLabel') selectLabel: string = 'Select';
	@Input('bindLabel') bindLabel: string = '';
	@Input('bindValue') bindValue: string = '';
	@Input('multiple') multiple: boolean = false;
	@Input('placement') placement: string = 'bottom-left';
	@Input('search') search: boolean = true;
	@Input('lazyLoading') lazyLoading: boolean = false;
	@Input('clearOnSubmit') clearOnSubmit: boolean = false;
	// @Input('clearAll') clearAll: boolean = false;

	private _selectedItems = [];
	@Input() set selectedItems(value) {
		if(!Array.isArray(value)) value = [value];
		this._selectedItems = value;
	}
	get selectedItems(): any {
		return this._selectedItems;
	}
	@Input('selectDisabled') selectDisabled : boolean = false;
	//Outputs
	@Output() onSelect = new EventEmitter();
	@Output() onDeSelect = new EventEmitter();
	@Output() onLoadMore = new EventEmitter();
	@Output() onSearch = new EventEmitter();
	// @Output() ItemsAll = new EventEmitter();

	dropdownState = false;
	searchInput = new Subject();
	searchValue = '';

	fetchMore = false;

	constructor() {
		this.searchInput.debounceTime(300).subscribe(() => {
			// console.log(this.searchValue);
			this.onSearch.emit(this.searchValue);
		});

	}


	ngOnInit() {
		
		if(!Array.isArray(this.selectedItems)) this.selectedItems = [this.selectedItems] 
	}


	toggle() {
		this.dropdownState = !this.dropdownState;
		if (this.dropdownState) {
			// this.optionsPopper.show();
			setTimeout(() => {
				this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
				// console.log(this.scrollHeight);
			}, 0);

		} else {
			// this.optionsPopper.hide();
			// this.optionsPopper.state = false;
		}
	}
	searchClicked(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
	}

	ngAfterViewInit() {
		// Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		// Add 'implements AfterViewInit' to the class.
		// this._agentService.getAllAgents();
		this.optionsPopper.state = false;
		this.selectedItems = JSON.parse(JSON.stringify(this.selectedItems));
		// this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
	}

	select(event, value) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		if (value) {
			if (!this.multiple) {
				this.selectedItems = [value];
				this.dropdownState = false;
			} else {
				if (!this.selectedItems.includes(value)) {
					this.selectedItems.push(value);

				}
				// setTimeout(() => {
				// 	this.optionsPopper.show();
				// }, 0);
			}
		} else {
			if (!this.multiple) {
				this.selectedItems = [];
				this.dropdownState = false;
			}
		}
		this.onChange((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '')
		this.onTouch((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '')
		this.onSelect.emit((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems[0] : '');
		// this.ItemsAll.emit(((this.multiple) ? this.selectedItems : (this.selectedItems.length) ? this.selectedItems : '');

		if (!this.multiple) this.optionsPopper.hide();
		if (this.clearOnSubmit) this.selectedItems = [];
		else { this.selectedItems = this.selectedItems }
	}

	remove(event, index) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.selectedItems.splice(index, 1);
		this.onDeSelect.emit(this.selectedItems);
		if (!this.optionsPopper.state) {
			this.optionsPopper.hide();
		} else {
			this.optionsPopper.show();
		}
	}
	clearAll() {
		this.selectedItems = [];
	}

	onScroll($event) {
		if (this.lazyLoading) {
			if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight)) {
				//console.log('Scroll');
				// console.log('Fetch More');
				//Emit Load More
				this.onLoadMore.emit();
			}
			this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
		}
	}

	display(value) {
		if (this.selectedItems && this.selectedItems.includes(value)) {
			return false
		} else {
			return true
		}
	}


	forceClose(event) {
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.optionsPopper.hide();
		this.dropdownState = false;
		this.optionsPopper.state = false;
	}

	//#region Control Value Functions
	onChange: any = () => {
		// console.log(this.selectedItems);
	}
	onTouch: any = () => { }

	// set itemList(val)  {
	//   this.itemList = this.items

	// }

	writeValue(value: any) {
		this.selectedItems
	}
	// upon UI element value changes, this method gets triggered
	registerOnChange(fn: any) {
		this.onChange = fn
	}

	registerOnTouched(fn: any) {
		this.onTouch = fn
	}

}
