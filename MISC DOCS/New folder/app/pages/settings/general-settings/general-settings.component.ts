import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
	selector: 'app-general-settings',
	templateUrl: './general-settings.component.html',
	styleUrls: ['./general-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GeneralSettingsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	agent: any;
	permissions: any;
	package: any;
	constructor(_authService: AuthService, public _globalStateServie: GlobalStateService) {
		
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if(pkg){
				this.package = pkg;
			}
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			// console.log(data);
			if (data && data.permissions) {
				this.permissions = data.permissions.settings;
				// console.log(this.permissions);			
			}
		}));
		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			// console.log(data);
			this.agent = data;

		}));
	}

	ngOnInit() {
	}

	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this._globalStateServie.setSettingsMenu(false);
	}

}
