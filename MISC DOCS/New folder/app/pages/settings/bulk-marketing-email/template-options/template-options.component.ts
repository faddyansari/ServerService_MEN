import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { EmailTemplateService } from '../../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-template-options',
	templateUrl: './template-options.component.html',
	styleUrls: ['./template-options.component.css'],
	encapsulation: ViewEncapsulation.None

})
export class TemplateOptionsComponent implements OnInit {
	subscriptions: Subscription[] = [];
	showDialog = false;
	selectedTemplate = undefined;
	buttons: any;
	currentRoute = '';
	constructor(private _globalStateService: GlobalStateService, private _router: ActivatedRoute, private router: Router, private _emailTemplateService: EmailTemplateService) {

		// this.subscriptions.push(this._router.params.subscribe(params => {
		// 	console.log(params);
		// 	if (params.type) {

		// 	}

		//   }));
		this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(res => {
			if (res) {
				this.selectedTemplate = res;
			}
		}));
		this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(data => {
			this.buttons = data;
			switch (this.buttons.buttonType) {
				case 'cancel':
					this.Cancel();
					break;
			}

		}));

		this._globalStateService.currentRoute.subscribe(route => {
			this.currentRoute = route;
		});
	}


	IfBuilder() {
		if (this.currentRoute.endsWith('basic') ||
			this.currentRoute.endsWith('commerce') ||
			this.currentRoute.endsWith('three-col') ||
			this.currentRoute.endsWith('text')
		) {
			return true;
		}
		else return false;
	}

	ngOnInit() {

	}

	ToggleOptions() {
		this.showDialog = !this.showDialog;
	}
	
	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	Cancel() {
		this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
	}
}
