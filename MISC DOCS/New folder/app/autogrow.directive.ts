import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { GlobalStateService } from '../services/GlobalStateService';

@Directive({
	selector: '[appAutoGrow]'
})
export class AutoGrowDirective {
	constructor(public element: ElementRef) {

	}
	@Input() maximumHeight: number; // based on pixel
	@Input() minHeight: number; // based on pixel
	@Input() restrictAutoSize: boolean; // based on pixel
	//= scrollHeight = this.element.nativeElement.scrollHeight
	@HostListener('input', ['$event.target'])
	@HostListener('keydown', ['$event.target'])
	@HostListener('keyup', ['$event.target'])
	@HostListener('cut', ['$event.target'])
	@HostListener('paste', ['$event.target'])
	@HostListener('change', ['$event.target'])

	ngOnInit(): void {

		if (!this.restrictAutoSize) {
			setTimeout(() => {
				this.adjustCustom();
			}, 0);
		}

	}
	adjustCustom(): void {
		const element = this.element.nativeElement;

		element.style.height = this.minHeight + 'px';
		element.style.height = 'auto'
		element.style.height = (element.scrollHeight - this.minHeight) + 'px';
		if (element.scrollHeight <= this.maximumHeight) {
			element.style.overflowY = 'hidden'
			delete element.style.maxHeight
		} else {
			element.style.overflowY = 'scroll'
			element.style.maxHeight = this.maximumHeight + 'px';
		}

	}
}