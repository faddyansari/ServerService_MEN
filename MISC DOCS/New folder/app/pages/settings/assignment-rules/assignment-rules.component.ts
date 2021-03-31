import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AssignmentAutomationSettingsService } from '../../../../services/LocalServices/AssignmentRuleService';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-assignment-rules',
	templateUrl: './assignment-rules.component.html',
	styleUrls: ['./assignment-rules.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		AssignmentAutomationSettingsService
	]

})
export class AssignmentRulesComponent implements OnInit {

	subscriptions: Subscription[] = [];
	addRule = false;
	selectedRule = undefined;
	Agent = undefined
	public newObject = undefined;
	rulesetPermissions: any;

	constructor(private _ruleSetService: AssignmentAutomationSettingsService, private _appStateService: GlobalStateService, private _authService: AuthService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat Settings');


		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
				this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
			}

		}));

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {

			this.Agent = agent
		}));

		this.subscriptions.push(_ruleSetService.addingRule.subscribe(addRule => {
			// console.log(addRule);

			this.addRule = addRule
		}));

		this.subscriptions.push(this._ruleSetService.selectedRule.subscribe(selectedRule => {
			this.selectedRule = selectedRule;
		  }));



		// this.newObject = {
		// 	name: '',
		// 	nsp: this.Agent.nsp,
		// 	isActive: false,
		// 	operator: 'or',
		// 	conditions: [{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }],
		// 	actions: [{ name: '', value: '' }],
		// 	lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
		// };

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
		this._ruleSetService.addingRule.next(true)
		this._ruleSetService.selectedRule.next(undefined)
	}

}
