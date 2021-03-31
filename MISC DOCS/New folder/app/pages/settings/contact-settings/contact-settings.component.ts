import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
	selector: 'app-contact-settings',
	templateUrl: './contact-settings.component.html',
	styleUrls: ['./contact-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactSettingsComponent implements OnInit {

	@Input() activeTab: string;
	constructor(public _globalStateServie: GlobalStateService) { }

	ngOnInit() {
	}
	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this._globalStateServie.setSettingsMenu(false);
	}

}
