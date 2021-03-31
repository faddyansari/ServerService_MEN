import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SocketService } from '../../../../../services/SocketService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../services/AuthenticationService';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ValidationService } from '../../../../../services/UtilityServices/ValidationService';
import { AssignmentAutomationSettingsService } from '../../../../../services/LocalServices/AssignmentRuleService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';

@Component({
	selector: 'app-rules',
	templateUrl: './rules.component.html',
	styleUrls: ['./rules.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class RulesComponent implements OnInit {


	@ViewChild('ruleName') tagNameElement;
	ruleTag = '';
	ruleName = '';
	//automatedMessagesList = [];
	subscriptions: Subscription[] = [];
	//editingMessagesMap = {};

	loading = false;
	socket;
	public assignmentRuleForm: FormGroup;
	public working = false;
	public fetching: boolean = false;
	RulesList: Array<any> = [];
	rulesMap: Array<any> = [];
	filterKeys = [];
	showRulesForm = false;

	constructor(private formbuilder: FormBuilder,
		private _socketService: SocketService,
		public _authService: AuthService,
		public _assignmentRuleService: AssignmentAutomationSettingsService,
		public snackBar: MatSnackBar,
		public dialog: MatDialog,
		public _appStateService: GlobalStateService) {

		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
		this.subscriptions.push(_socketService.getSocket().subscribe(socket => {
			this.socket = socket;
		}));


		this.subscriptions.push(_assignmentRuleService.fetchingCases.subscribe(data => {

			this.fetching = data;
		}));
		this.subscriptions.push(_socketService.getSocket().subscribe(socket => {
			this.socket = socket;
		}));



		this.subscriptions.push(_authService.getRequestState().subscribe(requestState => {
			this.loading = requestState;
		}));

		this.subscriptions.push(_assignmentRuleService.RulesList.subscribe(list => {
			//console.log(list);
			if (list && list.length) {
				this.RulesList = list;
				this.UpdateRulesMap(list)
				// list.map(rule => {
				//   if (this.rulesMap[rule._id] == undefined) {
				//     this.rulesMap[rule._id] = {};
				//   }

				//   if (!this.rulesMap[rule._id].selected) {
				//     this.rulesMap[rule._id].selected = false;
				//     this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
				//   }
				// });
			}
		}));
		this.subscriptions.push(_assignmentRuleService.filterKeys.subscribe(keys => {
			this.filterKeys = keys
		}));
		this.assignmentRuleForm = formbuilder.group({
			'ruleName': [
				null,
				[
					Validators.required,
					Validators.maxLength(50),

				],
				this.CheckRuleName.bind(this)
			],
			'ruleKeyValue':
				[
					null,
					[
						Validators.required
					]
				],
			'ruleKeyName':
				[
					null,
					[
						Validators.required
					],
					this.FilterKeys.bind(this)
				],
			'ruleKeyType':
				[
				],
			'ruleKeyOperator':
				[
				],
		});

	}


	ngOnInit() {
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	AddAssignmentRule() {

		if (this.assignmentRuleForm.valid) {
			this._authService.setRequestState(true);
			let rule = {
				ruleName: this.assignmentRuleForm.get('ruleName').value,
				type: (this.assignmentRuleForm.get('ruleKeyType').value) ? this.assignmentRuleForm.get('ruleKeyType').value : 'any',
				key: this.assignmentRuleForm.get('ruleKeyName').value,
				value: this.assignmentRuleForm.get('ruleKeyValue').value,
				operator: this.assignmentRuleForm.get('ruleKeyOperator').value,

			}

			this._assignmentRuleService.AddNewRule(rule).subscribe(data => {

				if (data) {
					this._authService.setRequestState(false);


					//this._authService.updateAutomatedMessages(this.assignmentRuleForm.get('hashTag').value, this.assignmentRuleForm.get('ruleName').value);
					//this.assignmentRuleForm.reset();



					//this.RulesList = this.RulesList.concat(rule);


					//this.UpdateRulesMap(this.RulesList);
					this.assignmentRuleForm.reset()
					this.snackBar.openFromComponent(ToastNotifications, {
						data: { img: 'ok', msg: 'Assignment Rule Added Successfully' },
						duration: 3000,
						panelClass: ['user-alert', 'success']
					});

				}
			},
				err => {
					this.snackBar.openFromComponent(ToastNotifications, {
						data: { img: 'warning', msg: 'Cannot Add Assignment Rule' },
						duration: 3000,
						panelClass: ['user-alert', 'error']
					});
				})


		}
	}

	DeleteAssignmetRule(id: string) {
		//console.log(id);

		event.preventDefault();

		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are You Sure You Want To Delete the Assignment Rule' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				this._authService.setRequestState(true);

				this._assignmentRuleService.DeleteNewRule({ id: id }).subscribe(data => {

					if (data.status == 'ok') {
						this._authService.setRequestState(false);

						this.snackBar.openFromComponent(ToastNotifications, {
							data: { img: 'ok', msg: 'Assignment Rule Deleted Successfully' },
							duration: 3000,
							panelClass: ['user-alert', 'success']
						});

					}
				},
					err => {
						this.snackBar.openFromComponent(ToastNotifications, {
							data: { img: 'warning', msg: 'Cannot Delete Assignment Rule' },
							duration: 3000,
							panelClass: ['user-alert', 'error']
						});
					})

			}
		})
	}




	//After Edit Button Events
	Edit(event: Event, hashTag: string) {
		event.preventDefault();
		// this.editingMessagesMap[hashTag].error = false;
		// if (!this.editingMessagesMap[hashTag].ruleName) {
		//   this.editingMessagesMap[hashTag].error = true;
		//   return
		// };
		// this.socket.emit('editAutomatedResponse', {
		//   hashTag: hashTag,
		//   ruleName: this.editingMessagesMap[hashTag].ruleName
		// }, (response) => {
		//   if (response.status == 'ok') {

		//     this._authService.EditupdateAutomatedMessages(
		//       response.hashTag,
		//       this.editingMessagesMap[response.hashTag].ruleName
		//     );
		//     this.editingMessagesMap[hashTag].selected = false;
		//     this.snackBar.openFromComponent(ToastNotifications, {
		//       data: { img: 'ok', msg: 'Automated Message Edited Successfully' },
		//       duration: 3000,
		//       panelClass: ['user-alert', 'success']
		//     })
		//   }

		// });

	}

	CancelEdit(previousRule) {

		this.rulesMap[previousRule._id].operator = previousRule.operator;
		this.rulesMap[previousRule._id].type = previousRule.type;
		this.rulesMap[previousRule._id].key = previousRule.key;
		this.rulesMap[previousRule._id].value = previousRule.value;
		this.rulesMap[previousRule._id].selected = false;

	}

	toggleRulesForm() {
		this.showRulesForm = !this.showRulesForm;
	}

	EditRule(id: string) {
		return this.rulesMap[id].selected
	}

	CheckEdit(id: string) {
		return this.rulesMap[id].selected;
	}
	CheckDelete(id: string) {
		return //this.deleting[id];
	}


	EnableEdit(_id: string) {
		if (!_id) return;
		this.rulesMap[_id].selected = true;
	}

	// CancelEdit(id: string, previousCriteria: string, previousMatchingCriteria: string) {
	//   this.rulesMap[id].criteria = previousCriteria;
	//   this.rulesMap[id].matchingCriteria = previousMatchingCriteria;
	//   this.rulesMap[id].selected = false;
	// }

	SubmitEdit(id: string) {

		this._assignmentRuleService.EditRule({
			_id: id,
			key: this.rulesMap[id].key,
			value: this.rulesMap[id].value,
			type: this.rulesMap[id].type,
			operator: this.rulesMap[id].operator
		}).subscribe(response => {
			this.rulesMap[id].selected = false;
			if (response.status == 'ok') {
				this.snackBar.openFromComponent(ToastNotifications, {
					data: { img: 'ok', msg: 'Rule Edited Successfully' },
					duration: 3000,
					panelClass: ['user-alert', 'success']
				});
			}
		});
	}

	DeleteCase(id: string) {
		this.dialog.open(ConfirmationDialogComponent, {
			panelClass: ['confirmation-dialog'],
			data: { headermsg: 'Are You Sure You Want To Delete Case' }
		}).afterClosed().subscribe(data => {
			if (data == 'ok') {
				// this.deleting[id] = true;
				// this._chatBotSettings.DeleteCase(id).subscribe(response => {
				//   delete this.deleting[id];
				//   if (response.status == 'assigned') {
				//     this.snackBar.openFromComponent(ToastNotifications, {
				//       data: { img: 'warning', msg: 'Case Has Already Been Assigned To One Of The StateMachines' },
				//       duration: 3000,
				//       panelClass: ['user-alert', 'error']
				//     });
				//   }
				// }, err => {
				//   delete this.deleting[id];
				// });
			}
		});

	}
	CheckRuleName(control: FormControl): Observable<any> {

		let name = this.assignmentRuleForm.get('ruleName');
		for (let i = 0; i < this.RulesList.length; i++) {
			if (this.RulesList[i].ruleName == name.value) {
				return Observable.of({ 'matched': true });
			}

		}
		return Observable.of(null);
	}
	FilterKeys(control: FormControl): Observable<any> {

		let keys = this.assignmentRuleForm.get('ruleKeyName').value;

		let pattern = new RegExp(keys, 'gi');
		if (this.filterKeys.indexOf(keys) !== -1) return Observable.of(null)
		let matched = false;
		this.filterKeys.map(key => {

			if ((key as string).match(pattern)) {
				matched = true
			}
			return key
		});
		if (matched) return Observable.of(null)

		else {

			this._assignmentRuleService.GetFilters(keys).subscribe(data => {

			},
				err => {
					console.log("error in get filters");

				});
			return Observable.of(null)
		}


	}


	UpdateRulesMap(list: Array<any>) {
		list.map(rule => {
			if (this.rulesMap[rule._id] == undefined) {
				this.rulesMap[rule._id] = {};
			}

			if (!this.rulesMap[rule._id].selected) {
				this.rulesMap[rule._id].selected = false;
				this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
			}
		})

	}

}
