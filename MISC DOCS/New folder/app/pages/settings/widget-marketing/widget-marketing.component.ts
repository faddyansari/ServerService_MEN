import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
	selector: 'app-widget-marketing',
	templateUrl: './widget-marketing.component.html',
	styleUrls: ['./widget-marketing.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WidgetMarketingComponent implements OnInit {

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
