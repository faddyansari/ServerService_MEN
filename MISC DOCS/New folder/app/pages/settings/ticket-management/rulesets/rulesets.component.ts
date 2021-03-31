import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RulesetSettingsService } from '../../../../../services/LocalServices/RulesetsService'
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
  selector: 'app-rulesets',
  templateUrl: './rulesets.component.html',
  styleUrls: ['./rulesets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    RulesetSettingsService
  ]
})
export class RulesetsComponent {

	subscriptions: Subscription[] = [];
	addRule = false;
	SelectedRule = undefined;
	Agent = undefined
	public newObject = undefined;
	rulesetPermissions : any;
	package: any;

	constructor(private _ruleSetService: RulesetSettingsService,private _appStateService : GlobalStateService, private _authService: AuthService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			if (pkg) {
				this.package = pkg.tickets.rulesets;
				if(!this.package.allowed){
					this._appStateService.NavigateTo('/noaccess');
				}
			}
			// console.log(agent);
		}));
		
		this.subscriptions.push(this._ruleSetService.Addrule.subscribe(value => {
		this.addRule = value;
		}));

		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
			}

		}));

		this.subscriptions.push(this._ruleSetService.SelectedRule.subscribe(value => {
		this.SelectedRule = value;
		}));

		this.Agent = this._ruleSetService.Agent

		this.newObject = {
		name: '',
		nsp: this.Agent.nsp,
		isActive: false,
		operator: 'or',
		conditions: [{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }],
		actions: [{ name: '', value: '' }],
		lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
		};

	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
		// this._ruleSetService.Destroy();
	}

	public AddRule() {
		this._ruleSetService.Addrule.next(true);
	}

	public CancelAddRule() {
		this._ruleSetService.Addrule.next(false);
	}

}
