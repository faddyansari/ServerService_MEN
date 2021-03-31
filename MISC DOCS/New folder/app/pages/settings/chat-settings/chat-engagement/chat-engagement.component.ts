import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatSettingService } from '../../../../../services/LocalServices/ChatSettingService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-chat-engagement',
	templateUrl: './chat-engagement.component.html',
	styleUrls: ['./chat-engagement.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ChatEngagementComponent implements OnInit {

	production = true;
	nsp = '';
	showRulesetForm = false;

	public subscriptions: Subscription[] = [];
	public assignmentSettings: any;
	public assignmentSettingsForm: FormGroup;
	public ruleSetOneForm: FormGroup;
	public ruleSetTwoForm: FormGroup;
	public ruleSetThreeForm: FormGroup;
	public priorityAgent: string;
	public loading;
	public RuleSets: any = [];
	public selectedRule: any = '';
	public workFlowError: boolean = false;
	public rulsetError: boolean = false;
	package: any;
	constructor(
		private formbuilder: FormBuilder,
		public _chatSettingsService: ChatSettingService,
		private _authService: AuthService,
		public snackBar: MatSnackBar,
		private _appStateService: GlobalStateService
	) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
		this.subscriptions.push(_chatSettingsService.chatSettings.subscribe(settings => {


			if (settings) {
				this.assignmentSettings = settings.assignments;


				if (this.assignmentSettings.ruleSets) {
					this.RuleSets = this.assignmentSettings.ruleSets;
				}
				if (this.assignmentSettings && this.assignmentSettingsForm) {
					this.assignmentSettingsForm.get('email').setValue(this.assignmentSettings.priorityAgent);
				}
			}
		}));

		this.subscriptions.push(_chatSettingsService.getSavingStatus('assignments').subscribe(status => {
			this.loading = status;
		}));

		this.subscriptions.push(_authService.Production.subscribe(production => {
			this.production = production;
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			this.nsp = agent.nsp;
		}));

		this.assignmentSettingsForm = formbuilder.group({
			'email': [
				(this.assignmentSettings && this.assignmentSettings.priorityAgent) ? this.assignmentSettings.priorityAgent : '',
				[
					Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
				]
			]

		});

		this.ruleSetOneForm = formbuilder.group({
			'activityTime': [null,
				[
					Validators.required,
					Validators.min(1),
					Validators.max(1440)
				]
			],
		});

		this.ruleSetTwoForm = formbuilder.group({
			'pagesVisited': [null,
				[
					Validators.required,
					Validators.min(1)
				]
			]
		});

		this.ruleSetThreeForm = formbuilder.group({
			'pageUrl': [null, Validators.required]
		});

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
			// console.log(data);
			if (pkg) {
				this.package = pkg;
				if (!this.package.chats.chatEngagement.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}
		}));

	}

	ngOnInit() {

	}

	ngOnDestroy(): void {

		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	public SetAssignmentSettings(value: string) {
		if (value == 'mEng') {
			this.assignmentSettings.mEng = true;
			this.assignmentSettings.aEng = false;
		}
		else {
			this.assignmentSettings.mEng = false;
			this.assignmentSettings.aEng = true;
		}
	}

	public Submit(aEng: boolean, mEng: boolean, botEnabled: boolean) {
		//console.log('Submitting');
		this.workFlowError = false;
		this.rulsetError = false;
		this._chatSettingsService.setNSPChatSettings({
			aEng: aEng,
			mEng: mEng,
			botEnabled: botEnabled,
			priorityAgent: this.assignmentSettingsForm.get('email').value,
			ruleSets: this.RuleSets
		}, 'assignments')
			.subscribe(response => {
				//Do Some Error Logic If Any
				//Check Server Responses For this Event

				if (response.status == 'error') {
					if (response.reason.length < 2) {
						response.reason.map(error => {
							switch (error) {
								case "workflowNotDefined":
									//this.workFlowError = true;
									this.snackBar.openFromComponent(ToastNotifications, {
										data: {
											img: 'warning',
											msg: 'Unable To Enable Chat Bot Please Define Workflow First.'
										},
										duration: 3000,
										panelClass: ['user-alert', 'error']
									});

									this.assignmentSettings.botEnabled = false;
									break;
								case "ruleSetsEmpty":
									//this.rulsetError = true;
									this.snackBar.openFromComponent(ToastNotifications, {
										data: {
											img: 'warning',
											msg: 'Unable To Enable Automatic Assignment Since RuleSets Are Empty.'
										},
										duration: 3000,
										panelClass: ['user-alert', 'error']
									});
									this.assignmentSettings.mEng = true;
									this.assignmentSettings.aEng = false;
									break;
								// default:

								// 	break;


							}
						})
					}
					else {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'Unable To Enable Automatic Assignment Since RuleSets Are Empty. <br> Unable To Enable Chat Bot Please Define Workflow First.'
							},
							duration: 50000000,
							panelClass: ['user-alert', 'error']
						});
						this.assignmentSettings.botEnabled = false;
						this.assignmentSettings.mEng = true;
						this.assignmentSettings.aEng = false;
					}
				}
				else {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Assignment Settings Updated Successfully!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
				}
			});
	}

	SelectRuleSet(value) {
		if (value) {
			//console.log(value);
			this.selectedRule = value;
		} else {
			//console.log('Please select rule!');
		}

	}

	ToggleRulesetForm() {
		this.showRulesetForm = !this.showRulesetForm;
	}

	CreateRule(form: any, id) {
		// console.log(form);
		if (form.valid) {
			let ruleSchema = form.value;
			ruleSchema.id = id;

			if (this.RuleSets.length) {
				let ruleSet = this.RuleSets.filter(element => element.id == ruleSchema.id);
				if (ruleSet && ruleSet.length) {

					if (ruleSet[0].id == 'r_particular_page') {
						if (!ruleSet[0].pageUrl.includes(form.get('pageUrl').value)) {
							ruleSet[0].pageUrl.push(form.get('pageUrl').value);
							// console.log(this.RuleSets);
							this._chatSettingsService.setNSPChatSettings({
								aEng: this.assignmentSettings.aEng,
								mEng: this.assignmentSettings.mEng,
								botEnabled: this.assignmentSettings.botEnabled,
								priorityAgent: this.assignmentSettingsForm.get('email').value,
								ruleSets: this.RuleSets
							}, 'assignments')
								.subscribe(response => {
									if (response.status == "ok") {
										this.snackBar.openFromComponent(ToastNotifications, {
											data: {
												img: 'ok',
												msg: 'Ruleset added Successfully!'
											},
											duration: 3000,
											panelClass: ['user-alert', 'success']
										});
									}
									//Do Some Error Logic If Any
									//Check Server Responses For this Event
								});
							form.reset();
						} else {
							// console.log('url already inserted');
							this.snackBar.openFromComponent(ToastNotifications, {
								data: {
									img: 'warning',
									msg: 'Url is already inserted for selected rule!'
								},
								duration: 3000,
								panelClass: ['user-alert', 'error']
							});
						}
					} else {
						// console.log('already inserted');
						this.snackBar.openFromComponent(ToastNotifications, {
							data: {
								img: 'warning',
								msg: 'This ruleset is already inserted and is only allowed once.'
							},
							duration: 3000,
							panelClass: ['user-alert', 'error']
						});
					}
				} else {
					//	console.log('inserting...');
					if (ruleSchema.id == 'r_particular_page') {
						ruleSchema.pageUrl = [ruleSchema.pageUrl];
					}
					// console.log(ruleSchema);

					this.RuleSets.push(ruleSchema);
					// console.log(this.RuleSets);
					this._chatSettingsService.setNSPChatSettings({
						aEng: this.assignmentSettings.aEng,
						mEng: this.assignmentSettings.mEng,
						botEnabled: this.assignmentSettings.botEnabled,
						priorityAgent: this.assignmentSettingsForm.get('email').value,
						ruleSets: this.RuleSets
					}, 'assignments')
						.subscribe(response => {
							//Do Some Error Logic If Any
							//Check Server Responses For this Event
						});
					form.reset();
				}

			} else {
				//console.log('inserting...');
				if (ruleSchema.id == 'r_particular_page') {
					ruleSchema.pageUrl = [ruleSchema.pageUrl];
				}
				// console.log(ruleSchema);
				this.RuleSets.push(ruleSchema);
				//console.log(this.RuleSets);
				this._chatSettingsService.setNSPChatSettings({
					aEng: this.assignmentSettings.aEng,
					mEng: this.assignmentSettings.mEng,
					botEnabled: this.assignmentSettings.botEnabled,
					priorityAgent: this.assignmentSettingsForm.get('email').value,
					ruleSets: this.RuleSets
				}, 'assignments')
					.subscribe(response => {
						//console.log(response);
						//Do Some Error Logic If Any
						//Check Server Responses For this Event
					});
				form.reset();
			}
		} else {
			//console.log('invalid form');
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Invalid form!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'error']
			});
		}
		this.showRulesetForm = false;
		this.selectedRule = '';
	}

	deleteRule(id, url = undefined) {

		let index = this.RuleSets.findIndex(data => data.id == id);
		if (url && index != -1) {
			let rule = this.RuleSets[index];
			let urlIndex = rule.pageUrl.findIndex(data => data == url);
			if (urlIndex != -1) {
				rule.pageUrl.splice(urlIndex, 1);
			}
			if (!rule.pageUrl.length) {
				this.RuleSets.splice(index, 1);
			}
		} else {
			this.RuleSets.splice(index, 1);
		}

		if (this.RuleSets && !this.RuleSets.length) {
			this.assignmentSettings.aEng = false;
			this.assignmentSettings.mEng = true;
		}
		this._chatSettingsService.setNSPChatSettings({
			aEng: this.assignmentSettings.aEng,
			mEng: this.assignmentSettings.mEng,
			botEnabled: this.assignmentSettings.botEnabled,
			priorityAgent: this.assignmentSettingsForm.get('email').value,
			ruleSets: this.RuleSets
		}, 'assignments')
			.subscribe(response => {
				if (response.status == 'ok') {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'ok',
							msg: 'Ruleset deleted Successfully!'
						},
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});
				}
				//console.log(response);
				//Do Some Error Logic If Any
				//Check Server Responses For this Event
			});

	}

}
