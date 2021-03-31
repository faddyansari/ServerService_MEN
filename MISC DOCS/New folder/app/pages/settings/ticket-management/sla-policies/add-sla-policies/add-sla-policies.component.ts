import { UtilityService } from './../../../../../../services/UtilityServices/UtilityService';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, } from '@angular/material/dialog';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { SLAPoliciesService } from '../../../../../../services/LocalServices/SLAPoliciesService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../../services/AuthenticationService';
import { GlobalStateService } from '../../../../../../services/GlobalStateService';

@Component({
	selector: 'app-add-sla-policies',
	templateUrl: './add-sla-policies.component.html',
	styleUrls: ['./add-sla-policies.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AddSlaPoliciesComponent implements OnInit {
	@Input() PolicyObject: any;
	nsp = '';
	email = '';
	endedAgents = false;
	loadingMoreAgents = false;
	disableButton = false;
	
	selectedPolicy = undefined;
	subscriptions: Subscription[] = [];
	allSLAPolicies = [];
	Groups = [];
	Teams = [];
	groupList = [];
	agentList_original = [];
	teamsList = [];
	public srcList = ['LiveChat', 'Email', 'Panel'];

	public agentsList = [];
	AgentsList = [];
	selectedOption = '';
	setReminder = false;
	tempArr = [];
	formChanges: any;
	selectedWatchers = [];
	public policyForm: FormGroup;
	private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	endedRemResv = false;
	loadingMoreAgentsRemResv = false;
	selectedAgentRemResv = [];
	endedRemResp = false;
	loadingMoreAgentsRemResp = false;
	selectedAgentRemResp = [];
	endedVioResv = false;
	loadingMoreAgentsVioResv = false;
	selectedAgentVioResv = [];
	endedVioResp = false;
	loadingMoreAgentsVioResp = false;
	selectedAgentVioResp = [];
	package: any;
	constructor(private _authService: AuthService, private _appStateService: GlobalStateService, private formbuilder: FormBuilder, private dialog: MatDialog, public snackBar: MatSnackBar, private _slaPolicyService: SLAPoliciesService, private _utilityService: UtilityService) {

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.SLA;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}

		}));
		this.nsp = this._slaPolicyService.Agent.nsp;
		this.email = this._slaPolicyService.Agent.email;

		this.subscriptions.push(this._slaPolicyService.groupList.subscribe(data => {
			if (data) {
				this.Groups = data;
				this.Groups.map(val => {
					this.groupList.push({ display: val.group_name, value: val.group_name })
				})
			}
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			this.AgentsList = agents;
			this.agentList_original = agents;
		}));


		this.subscriptions.push(this._slaPolicyService.selectedSLAPolicy.subscribe(data => {
			if (data) {
				this.selectedPolicy = data;
				this.PolicyObject = this.selectedPolicy;
				if (this.selectedPolicy.reminderResolution.length || this.selectedPolicy.reminderResponse.length) {
					this.setReminder = true;
				}
				else {
					this.setReminder = false;
				}
			}
			else {
				this.selectedPolicy = undefined;
			}
		}));

		this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(data => {
			if (data && data.length) {
				this.allSLAPolicies = data;
			}
			else {
				this.allSLAPolicies = [];
			}
		}));
	}

	ngOnInit() {
		this.policyForm = this.formbuilder.group({
			'policyName': [this.PolicyObject.policyName,
			[
				Validators.required,
				Validators.minLength(2)
			]],

			'policyDesc': [this.PolicyObject.policyDesc,
			[
				Validators.minLength(2)
			]],

			'policyApplyTo': this.formbuilder.array(this.TransformApplyTo(this.PolicyObject.policyApplyTo), Validators.required),

			'policyTarget': this.formbuilder.array(this.TransformPolicyTarget(this.PolicyObject.policyTarget), Validators.required),
			'reminderResponse': this.formbuilder.array(this.TransformReminder(this.PolicyObject.reminderResponse)),
			'reminderResolution': this.formbuilder.array(this.TransformReminder(this.PolicyObject.reminderResolution)),
			'violationResponse': this.formbuilder.array(this.TransformViolation(this.PolicyObject.violationResponse)),
			'violationResolution': this.formbuilder.array(this.TransformViolation(this.PolicyObject.violationResolution))
		});
		this.onValueChanges();
	}

	onValueChanges() {
		this.policyForm.valueChanges.subscribe(val => {
			this.formChanges = val;
		})
	}
	TransformApplyTo(applyTo?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		applyTo.map(res => {
			fb.push(this.formbuilder.group({
				name: [res.name, Validators.required],
				value: [res.value, Validators.required]
			}));
		});
		return fb;
	}

	addApplyTo() {
		let val = this.formbuilder.group({
			name: ['', Validators.required],
			value: [[], Validators.required]
		});

		let form = this.policyForm.get('policyApplyTo') as FormArray
		form.push(val);
	}


	setSLAreminders() {
		this.setReminder = true;
	}
	UnsetReminder() {
		this.setReminder = false;
	}

	TransformPolicyTarget(target?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		target.map(to => {
			fb.push(this.formbuilder.group({
				priority: [to.priority, Validators.required],
				responseTimeKey: [to.responseTimeKey, Validators.required],
				responseTimeVal: [to.responseTimeVal, Validators.required],
				resolvedTimeKey: [to.resolvedTimeKey, Validators.required],
				resolvedTimeVal: [to.resolvedTimeVal, Validators.required],
				hours: [to.hours, Validators.required],
				emailActivationReminder: [to.emailActivationReminder, Validators.required],
				emailActivationEscalation: [to.emailActivationEscalation, Validators.required],
			}));
		});
		return fb;
	}

	TransformReminder(remind?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		remind.map(rem => {
			fb.push(this.formbuilder.group({
				type: [rem.type],
				responsetimeKey: [rem.responsetimeKey],
				responsetimeVal: [rem.responsetimeVal],
				resolvedtimeKey: [rem.resolvedtimeKey],
				resolvedtimeVal: [rem.resolvedtimeVal],
				emails: [rem.emails],
				notifyTo: [rem.notifyTo]
			}));
		});
		return fb;
	}

	TransformViolation(violation?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		violation.map(vio => {
			fb.push(this.formbuilder.group({
				type: [vio.type],
				duration: [vio.duration, Validators.required],
				emails: [vio.emails],
				notifyTo: [vio.notifyTo]
			}));
		});
		return fb;
	}

	GetControls(name) {

		return (this.policyForm.get(name) as FormArray).controls;
	}

	deleteReminder(index, name) {
		let reminder = this.policyForm.get(name) as FormArray;
		reminder.removeAt(index);
	}

	deleteViolation(index, name) {
		let violation = this.policyForm.get(name) as FormArray;
		violation.removeAt(index);
	}

	GetAvailableApplyTo(i) {
		let applyToList = {
			'group': 'Group',
			'source': 'Source',
			// 'state': 'State'
		}
		let applyTo = this.policyForm.get('policyApplyTo') as FormArray;

		applyTo.controls.map((control, index) => {

			if (applyToList[applyTo.controls[index].get('name').value] && index != i) delete applyToList[applyTo.controls[index].get('name').value]
		});
		return applyToList;
	}

	GetAvailableViolationDurations(j) {
		let violate = {
			'0_mins': 'Immediately',
			'30_mins': 'After 30 Minutes',
			'1_hour': 'After 1 hours',
			'2_hour': 'After 2 hours',
			'4_hour': 'After 4 hours',
			'8_hour': 'After 8 hours',
			'12_hour': 'After 12 hours',
			'1_week': 'After 1 week',
			'2_week': 'After 2 weeks',
			'1_day': 'After 1 day',
			'2_day': 'After 2 days',

		}

		let violation = this.policyForm.get('violationResolution') as FormArray;
		violation.controls.map((control, index) => {
			if (violate[violation.controls[index].get('duration').value] && index != j) {
				delete violate[violation.controls[index].get('duration').value]
			}

		});
		return violate;
	}

	// GetAvailableViolation(index) {
	//   this.tempArr = Array.from(this.arr);
	//   let violation = this.policyForm.get('violationResolution') as FormArray;
	//   let ind = this.tempArr.findIndex(data => data.value == violation.controls[index].get('duration').value);
	//   if (ind != -1) {
	//     this.tempArr = this.tempArr.slice(ind + 1, this.tempArr.length);
	//   }
	//   return this.tempArr;
	// }

	DeleteApplyTo(index) {
		let applyTo = this.policyForm.get('policyApplyTo') as FormArray;
		applyTo.removeAt(index);
	}

	addReminder(name) {
		let val = this.formbuilder.group({
			type: [name],
			responsetimeKey: ['15', []],
			responsetimeVal: ['mins', []],
			resolvedtimeKey: ['15', []],
			resolvedtimeVal: ['mins', []],
			time: ['8hours', []],
			emails: [[], []],

			notifyTo: [['Assigned Agent'], []]
		});

		let form = this.policyForm.get(name) as FormArray
		form.push(val);

	}

	addViolation(name) {
		let val = this.formbuilder.group({
			type: name == 'violationResolution' ? ['resolution'] : ['response'],
			time: ['', []],
			duration: ['', []],
			emails: [[], []],

			notifyTo: [['Assigned Agent'], []]
		});

		let form = this.policyForm.get(name) as FormArray
		form.push(val);
	}

	AddPolicy() {
		if (this.allSLAPolicies && this.allSLAPolicies.filter(data => data.policyName.toLowerCase().trim() == this.policyForm.get('policyName').value.toLowerCase().trim()).length > 0) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Policy name already exists!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		}
		else {
			let policy = {
				nsp: this.nsp,
				policyName: this.policyForm.get('policyName').value,
				policyDesc: this.policyForm.get('policyDesc').value,
				policyTarget: this.ParseTarget(this.policyForm.get('policyTarget')),//.value,
				policyApplyTo: this.policyForm.get('policyApplyTo').value,
				reminderResponse: this.setReminder ? this.ParseReminderResponse(this.policyForm.get('reminderResponse')) : [],//this.policyForm.get('reminderResponse').value : [],
				reminderResolution: this.setReminder ? this.ParseReminderResolve(this.policyForm.get('reminderResolution')) : [],//this.policyForm.get('reminderResolution').value : [],
				violationResponse: this.ParseViolation(this.policyForm.get('violationResponse')),//this.policyForm.get('violationResponse').value : [],
				violationResolution: this.ParseViolation(this.policyForm.get('violationResolution')),//this.policyForm.get('violationResolution').value : [],
				activated: false,
				created: { date: new Date().toISOString(), by: this.email },
				order: this.allSLAPolicies.length + 1
			}
			// console.log(policy)
			this._slaPolicyService.AddPolicy(policy).subscribe(res => {
				if (res.status == "ok") {
				}
			});
		}
	}
	ParseViolation(violation) {
		let violate = [];
		violation.controls.map(control => {

			let obj = {
				type: control.get('type').value,
				time: control.get('duration').value ? this.ConvertToSingleUnit(control.get('duration').value) : '',
				duration: control.get('duration').value ? control.get('duration').value : '',
				emails: control.get('emails').value,
				notifyTo: control.get('notifyTo').value
			}
			violate.push(obj);
		})
		return violate;
	}

	ParseTarget(targets) {
		let target = [];
		targets.controls.map(control => {
			let obj = {
				priority: control.get('priority').value.toUpperCase(),
				responseTimeKey: control.get('responseTimeKey').value,
				responseTimeVal: control.get('responseTimeVal').value,
				resolvedTimeKey: control.get('resolvedTimeKey').value,
				resolvedTimeVal: control.get('resolvedTimeVal').value,
				timeResolved: this.ConvertToSingleUnit(control.get('resolvedTimeKey').value + '_' + control.get('resolvedTimeVal').value),
				timeResponse: this.ConvertToSingleUnit(control.get('responseTimeKey').value + '_' + control.get('responseTimeVal').value),
				hours: null,
				emailActivationEscalation: control.get('emailActivationEscalation').value,
				emailActivationReminder: control.get('emailActivationReminder').value,

			}
			target.push(obj);
		})
		return target;
	}

	ParseReminderResponse(reminder) {
		let remind = [];
		reminder.controls.map(control => {

			let obj = {
				type: control.get('type').value,
				responsetimeKey: control.get('responsetimeKey').value,
				responsetimeVal: control.get('responsetimeVal').value,
				// time: this.ConvertToSingleUnit(control.get('responsetimeKey').value + control.get('responsetimeVal').value),
				notifyTo: control.get('notifyTo').value,
				emails: control.get('emails').value,
				time: control.get('responsetimeKey').value && control.get('responsetimeVal').value ? this.ConvertToSingleUnit(control.get('responsetimeKey').value + '_' + control.get('responsetimeVal').value) : '',
			}
			remind.push(obj);
		})
		return remind;
	}

	ParseReminderResolve(reminder) {
		let remind = [];
		reminder.controls.map(control => {

			let obj = {
				type: control.get('type').value,
				resolvedtimeKey: control.get('resolvedtimeKey').value,
				resolvedtimeVal: control.get('resolvedtimeVal').value,
				emails: control.get('emails').value,

				time: this.ConvertToSingleUnit(control.get('resolvedtimeKey').value + '_' + control.get('resolvedtimeVal').value),
				notifyTo: control.get('notifyTo').value
			}
			remind.push(obj);
		})
		return remind;
	}

	// ConvertToEmail(emails) {
	// 	console.log(emails);
		
	// 	let convertedEmails = [];
	// 	emails.map(res => {
	// 		if (res == 'Assigned Agent') {
	// 			this.AgentsList.filter(data => {
	// 				if (data.first_name + data.last_name == res) {
	// 					convertedEmails.push(data.email);
	// 				}
	// 			})
	// 		}
	// 	})
	// 	return convertedEmails;
	// }

	ConvertToSingleUnit(time) {
		let key = Number(time.split('_')[0]);
		let val = time.split('_')[1];
		let convertedTime: number;
		switch (val) {
			case 'mins':
				convertedTime = key;
				break;
			case 'hour':
				convertedTime = key * 60;
				break;
			case 'day':
				convertedTime = key * 1440;
				break;
			case 'week':
				convertedTime = key * 10080;
				break;
			case 'month':
				convertedTime = key * 43800;
				break;
		}
		return convertedTime;
	}

	Validate(ind, respkey, respVal, resvKey, resvVal) {
		let RespTime = this.ConvertToSingleUnit(respkey + '_' + respVal);
		let ResvTime = this.ConvertToSingleUnit(resvKey + '_' + resvVal);
		if (RespTime > ResvTime) {
			document.getElementById(ind).style.backgroundColor = "red";
			this.disableButton = true;
		}
		else {
			document.getElementById(ind).style.backgroundColor = "white";
			this.disableButton = false;
		}
	}

	UpdatePolicy() {
		let updatedpolicy = {
			nsp: this.nsp,
			policyName: this.policyForm.get('policyName').value,
			policyDesc: this.policyForm.get('policyDesc').value,
			policyTarget: this.ParseTarget(this.policyForm.get('policyTarget')),
			policyApplyTo: this.policyForm.get('policyApplyTo').value,
			reminderResponse: this.ParseReminderResponse(this.policyForm.get('reminderResponse')),
			reminderResolution: this.ParseReminderResolve(this.policyForm.get('reminderResolution')),
			violationResponse: this.ParseViolation(this.policyForm.get('violationResponse')),
			violationResolution: this.ParseViolation(this.policyForm.get('violationResolution')),
			activated: this.PolicyObject.activated,
			created: this.PolicyObject.created,
			order: this.PolicyObject.order
		}
		this._slaPolicyService.updateSLAPolicy(this.selectedPolicy._id, updatedpolicy).subscribe(res => {
			if (res.status == "ok") {
			}
		});
	}

	Cancel() {
		if (this.formChanges) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._slaPolicyService.selectedSLAPolicy.next(undefined);
					this._slaPolicyService.AddSLAPolicy.next(false);
				} else {
					return;
				}
			});
		}
		else {
			this._slaPolicyService.selectedSLAPolicy.next(undefined);
			this._slaPolicyService.AddSLAPolicy.next(false);
		}
	}

	loadMoreRemResp() {
		if (!this.endedRemResp && !this.loadingMoreAgentsRemResp && !this.selectedAgentRemResp.length) {
			this.loadingMoreAgentsRemResp = true;
			this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(response => {
				this.AgentsList = this.AgentsList.concat(response.agents);
				this.endedRemResp = response.ended;
				this.loadingMoreAgentsRemResp = false;
			});
		}
	}
	loadMoreRemResv() {
		if (!this.endedRemResv && !this.loadingMoreAgentsRemResv && !this.selectedAgentRemResv.length) {
			this.loadingMoreAgentsRemResv = true;
			this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(response => {
				this.AgentsList = this.AgentsList.concat(response.agents);
				this.endedRemResv = response.ended;
				this.loadingMoreAgentsRemResv = false;
			});
		}
	}
	loadMoreVioResp() {
		if (!this.endedVioResp && !this.loadingMoreAgentsVioResp && !this.selectedAgentVioResp.length) {
			this.loadingMoreAgentsVioResp = true;
			this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(response => {
				this.AgentsList = this.AgentsList.concat(response.agents);
				this.endedVioResp = response.ended;
				this.loadingMoreAgentsVioResp = false;
			});
		}
	}
	loadMoreVioResv() {
		if (!this.endedVioResv && !this.loadingMoreAgentsVioResv && !this.selectedAgentVioResv.length) {
			this.loadingMoreAgentsVioResv = true;
			this._utilityService.getMoreAgentsObs(this.AgentsList[this.AgentsList.length - 1].first_name).subscribe(response => {
				this.AgentsList = this.AgentsList.concat(response.agents);
				this.endedVioResv = response.ended;
				this.loadingMoreAgentsVioResv = false;
			});
		}
	}
	onSearchRemResp(value) {
		if (value) {
			if (!this.selectedAgentRemResp.length) {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.AgentsList = agents;
				});
			} else {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this.AgentsList = agents;
			}
		} else {
			this.AgentsList = this.agentList_original;
			this.endedRemResp = false;
		}
	}
	onSearchRemResv(value) {
		if (value) {
			if (!this.selectedAgentRemResv.length) {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.AgentsList = agents;
				});
			} else {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this.AgentsList = agents;
			}
		} else {
			this.AgentsList = this.agentList_original;
			this.endedRemResv = false;
		}
	}
	onSearchVioResp(value) {
		if (value) {
			if (!this.selectedAgentVioResp.length) {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.AgentsList = agents;
				});
			} else {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this.AgentsList = agents;
			}
		} else {
			this.AgentsList = this.agentList_original;
			this.endedVioResp = false;
		}
	}
	onSearchVioResv(value) {
		if (value) {
			if (!this.selectedAgentVioResv.length) {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.AgentsList = agents;
				});
			} else {
				let agents = this.AgentsList.filter(a => a.email.includes((value as string).toLowerCase()));
				this.AgentsList = agents;
			}
		} else {
			this.AgentsList = this.agentList_original;
			this.endedVioResv = false;
		}
	}

	ngOnDestroy() {
		this._slaPolicyService.AddSLAPolicy.next(false);
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
		this.PolicyObject.reminderResolution.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		});
		this.PolicyObject.reminderResponse.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		});
		this.PolicyObject.violationResolution.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		});
		this.PolicyObject.violationResponse.map(res=>{
			res.emails = [];
			res.notifyTo = ['Assigned Agent'];

		})
	}
}
