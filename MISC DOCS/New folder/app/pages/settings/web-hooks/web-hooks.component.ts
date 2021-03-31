import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { WebHookSettingsService } from '../../../../services/LocalServices/WebHookSettings';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-web-hooks',
	templateUrl: './web-hooks.component.html',
	styleUrls: ['./web-hooks.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WebHooksComponent implements OnInit {

	@Input() activeTab: string;
	subscription: Subscription[] = []
	package = undefined;

	constructor(public _globalStateServie: GlobalStateService,private _authService : AuthService) { 

		this.subscription.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.integratons;
			}
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
