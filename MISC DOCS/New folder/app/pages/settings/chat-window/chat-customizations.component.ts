import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-chat-customizations',
	templateUrl: './chat-customizations.component.html',
	styleUrls: ['./chat-customizations.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatCustomizationsComponent implements OnInit {
	package: any = {};
	constructor(public _globalStateServie: GlobalStateService, private _authService: AuthService) {
		// this._globalStateServie.contentInfo.next('');
		// this._globalStateServie.breadCrumbTitle.next('Chat Window Customizations');
		_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
			}
		});
	}

	ngOnInit() {
	}
	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this._globalStateServie.setSettingsMenu(false);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.

	}

}
