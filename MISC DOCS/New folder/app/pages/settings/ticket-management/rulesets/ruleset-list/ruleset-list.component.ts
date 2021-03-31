import { Component, ViewEncapsulation } from '@angular/core';
import { RulesetSettingsService } from '../../../../../../services/LocalServices/RulesetsService';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../../../services/AuthenticationService';

@Component({
	selector: 'app-ruleset-list',
	templateUrl: './ruleset-list.component.html',
	styleUrls: ['./ruleset-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class RulesetListComponent {

	subscriptions: Subscription[] = [];
	public rulesList = [];
	searchValue = '';
	rulesetPermissions : any;

	constructor(private _ruleSetService: RulesetSettingsService,
		public formbuilder: FormBuilder, public dialog: MatDialog, private _authService: AuthService) {

		this.subscriptions.push(this._ruleSetService.RulesList.subscribe(rulesList => {
			this.rulesList = rulesList
		}))
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
			if (data && data.permissions) {
                this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
			}

		}));

	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

	public DeleteRule(id) {

		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are you sure you want to delete the rule?' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {

				this._ruleSetService.DeleteRulesets(id).subscribe(response => {
					if (response.status == 'ok') {
						//TODO NOTIFICATION LOGIC
					}
					else {
						//TODO ERROR LOGIC
					}
				})
			}
		});
	}

	public ToggleActivation(id, activation) {
		this._ruleSetService.ToggleActivation(id, activation).subscribe(response => {
			if (response.status == 'ok') {
				//TODO NOTIFICATION LOGIC
			}
			else {
				//TODO ERROR LOGIC
			}
		})
	}

	public EditRule(ruleset) {

		this._ruleSetService.SelectedRule.next(ruleset);
		//this._ruleSetService.EditRule.next(true);

	}
}
