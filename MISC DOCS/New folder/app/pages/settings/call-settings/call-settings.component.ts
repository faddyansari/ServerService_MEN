import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
	selector: 'app-call-settings',
	templateUrl: './call-settings.component.html',
	styleUrls: ['./call-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CallSettingsComponent implements OnInit {

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
