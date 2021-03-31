import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { CRMService } from '../../../../services/crmService';

@Component({
	selector: 'app-crm-session-details',
	templateUrl: './crm-session-details.component.html',
	styleUrls: ['./crm-session-details.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class CrmSessionDetailsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	selectedSession: any;
	public showBrowsingHistory = false;
	public showSessionLogs = false;

	tabs = {
		"visitorHistory": true,
		"browsingHistory": false
	}

	constructor(private _crmService: CRMService) {


		this.subscriptions.push(_crmService.getSelectedSessionDetails().subscribe(session => {
			// console.log(session);        
			this.selectedSession = session;
		}));

	}

	ngOnInit() {

	}

	vhListTabs(tabName) {
		Object.keys(this.tabs).map(k => {
			if (k == tabName) {
				this.tabs[k] = true
			} else {
				this.tabs[k] = false
			}
		});
	}

}
