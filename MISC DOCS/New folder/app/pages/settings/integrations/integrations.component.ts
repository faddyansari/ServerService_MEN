import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
import { IntegrationsService } from '../../../../services/LocalServices/IntegrationsService';
import { GlobalStateService } from '../../../../services/GlobalStateService';

@Component({
	selector: 'app-integrations',
	templateUrl: './integrations.component.html',
	styleUrls: ['./integrations.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class IntegrationsComponent implements OnInit {

	subscriptions: Subscription[] = [];
	package = undefined;
	constructor(private _authService : AuthService,public _globalStateServie: GlobalStateService) {

		this.subscriptions.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
			  this.package = pkg.integratons;
			  if (!this.package.allowed) {
				this._globalStateServie.NavigateTo('/noaccess');
			  }
			}
		  }));
		// this.subscriptions.push(_settingsService.getChattSettings().subscribe(chatSettings => {
		//   if (!chatSettings) {
		//     _settingsService.getChattSettingsFromBackend();
		//   }
		// }));

		// this.subscriptions.push(_settingsService.getSettingsChangedStatus().subscribe(status => {

		//   if (status) this.settingsChanged = status;

		// }));
	}

	ngOnInit() {
	}
	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this._globalStateServie.setSettingsMenu(false);
	}


	ngOnDestroy(): void {


	}



}
