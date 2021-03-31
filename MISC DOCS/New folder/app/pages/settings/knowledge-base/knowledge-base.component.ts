import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-knowledge-base',
	templateUrl: './knowledge-base.component.html',
	styleUrls: ['./knowledge-base.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class KnowledgeBaseComponent implements OnInit {

	@Input() activeTab: string;

	subscription: Subscription[] = [];
	package = undefined;


	constructor(
		public _globalStateServie: GlobalStateService,
		private _authService: AuthService,
	) {
		this.subscription.push(this._authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg.knowledgebase;
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
