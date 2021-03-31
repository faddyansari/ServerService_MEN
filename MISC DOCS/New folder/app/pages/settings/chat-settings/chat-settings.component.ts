import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-chat-settings',
	templateUrl: './chat-settings.component.html',
	styleUrls: ['./chat-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatSettingsComponent implements OnInit {

	@Input() activeTab: string;

	subscriptions: Subscription[] = []
	agent: any;
	assignments: any;
	inactivityTimeouts: any;
	allowFileSharing: any;
	transcriptForwarding: any;
	settingsChanged = false;
	package: any = {};

	constructor(public _globalStateServie: GlobalStateService, private _authService : AuthService) {
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
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


	ngOnDestroy(): void {

			this.subscriptions.forEach(subscription => {
				subscription.unsubscribe();
			});
		}

	setActiveTab(state: string) {
			this.activeTab = state;
		}

}
