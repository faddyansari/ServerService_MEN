import { UtilityService } from './../../../../../../services/UtilityServices/UtilityService';
import { TicketsService } from './../../../../../../services/TicketsService';
import { TicketAutomationService } from './../../../../../../services/LocalServices/TicketAutomationService';
import { TicketSecnarioAutomationService } from './../../../../../../services/LocalServices/TicketSecnarioAutomationService';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../../../services/AuthenticationService';
import { IDatePickerConfig } from 'ng2-date-picker';
import { GlobalStateService } from '../../../../../../services/GlobalStateService';

@Component({
	selector: 'app-add-ticket-scenario-automation',
	templateUrl: './add-ticket-scenario-automation.component.html',
	styleUrls: ['./add-ticket-scenario-automation.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AddTicketScenarioAutomationComponent implements OnInit {
	@Input() TicketScenarioObject: any;
	nsp = '';
	email = '';
	selectedTags = [];
	selectedWatchers = [];
	selectedAgent = [];
	subscriptions: Subscription[] = [];
	allScenarios = [];
	priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
	stateList = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
	cloneScenario = false;
	public scenarioForm: FormGroup;
	selectedscenario = undefined;
	all_agents = [];
	watch_agents = [];
	originalAgents = [];
	ended = false;
	agent: any;
	loadingMoreAgents = false;
	groups = [];
	formChanges: any;
	tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
	package: any;

	datePickerConfig: IDatePickerConfig = {
		format: 'MM-DD-YYYY HH:mm',
		unSelectOnClick: false,
		closeOnSelect: true,
		hideInputContainer: false,
		hideOnOutsideClick: true,
		showGoToCurrent: true
	}

	public config: any = {
		placeholder: 'Add Note..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
		]
	}

	constructor(private formbuilder: FormBuilder,
		private _scenarioService: TicketSecnarioAutomationService,
		private _ticketAutomationSvc: TicketAutomationService,
		public snackBar: MatSnackBar,
		private _utilityService: UtilityService,
		private _appStateService: GlobalStateService,
		private _ticketService: TicketsService,
		private dialog: MatDialog,
		private _authService: AuthService) {

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.scenarioAutomation;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}

		}));

		this.nsp = this._scenarioService.Agent.nsp;
		this.email = this._scenarioService.Agent.email;

		this.subscriptions.push(this._scenarioService.AllScenarios.subscribe(data => {
			if (data && data.length) {
				this.allScenarios = data;
			}
			else {
				this.allScenarios = [];
			}
		}));

		this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(data => {
			if (data) {
				this.groups = data;
			}

		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(data => {
			if (data) {
				this.all_agents = data;
				this.watch_agents = data;
				this.originalAgents = data;
			}

		}));

		this.subscriptions.push(this._authService.getAgent().subscribe(data => {
			if (data) {
				this.agent = data.email;
			}

		}));

		this.subscriptions.push(this._scenarioService.cloneScenario.subscribe(data => {
			this.cloneScenario = data;
		}));

		this.subscriptions.push(this._scenarioService.selectedScenario.subscribe(data => {
			if (data) {
				this.selectedscenario = data;
				this.selectedscenario.actions.map(act => {
					if (act.scenarioName == 'tagAssign') {

						this.selectedTags = act.scenarioValue
					}
					if (act.scenarioName == 'watcherAssign') {
						this.selectedWatchers = act.scenarioValue

					}
				})
			}
			else {
				this.selectedscenario = undefined;
			}
		}));


	}

	ngOnInit() {

		this.scenarioForm = this.formbuilder.group({
			'scenarioTitle': [this.TicketScenarioObject.scenarioTitle,
			[
				Validators.required,
				Validators.minLength(2)
			]],

			'scenarioDesc': [this.TicketScenarioObject.scenarioDesc,
			[
				Validators.minLength(2)
			]],
			'availableFor': [this.TicketScenarioObject.availableFor, []],
			'groupName': [this.TicketScenarioObject.groupName],
			'actions': this.formbuilder.array(this.TransformActions(this.TicketScenarioObject.actions), Validators.required)

		});
		this.onValueChanges();

		// if (this.scenarioForm.get('actions').value.some(action => action.scenarioName == "groupAssign")) {
		//   console.log("yes");

		//   // this.subscriptions.push(this._ticketService.getAgentsAgainstGroup([this.sce.get('group').value]).subscribe(agents => {
		//   //   if (agents && agents.length) {
		//   //     this.all_agents = agents;
		//   //   }
		//   //   else {
		//   //     this.all_agents = []
		//   //   }
		//   // }));
		// } else {
		//   console.log("no");

		//   this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(agents => {
		//     this.all_agents = agents;
		//   }));
		// }
	}


	onValueChanges() {
		this.scenarioForm.valueChanges.subscribe(val => {
			this.formChanges = val;
		})
	}
	GetAvailableAgents(ev) {
		if (ev.target.value) {
			this._ticketService.getAgentsAgainstGroup([ev.target.value]).subscribe(agents => {
				if (agents && agents.length) {
					this.all_agents = agents;
				}
				else {
					this.all_agents = []
				}
			});
		} else {
			this._utilityService.getAllAgentsListObs().subscribe(agents => {
				this.all_agents = agents;
			});
		}
	}

	TransformActions(actions?: Array<any>): FormGroup[] {
		let fb: FormGroup[] = [];
		actions.map(action => {
			fb.push(this.formbuilder.group({
				scenarioName: [action.scenarioName, [Validators.required]],
				scenarioValue: [action.scenarioValue, []]
			}));

		});

		return fb;
	}

	loadMoreAgents(agentsFromDB) {
		if (!this.ended && !this.loadingMoreAgents) {
			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(agentsFromDB).subscribe(response => {
				this.all_agents = this.all_agents.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}

	SearchAgent(value) {
		if (value) {
			if (!this.selectedAgent.length) {
				let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this._utilityService.SearchAgent(value).subscribe((response) => {
					if (response && response.agentList.length) {
						response.agentList.forEach(element => {
							if (!agents.filter(a => a.email == element.email).length) {
								agents.push(element);
							}
						});
					}
					this.all_agents = agents;
				});
			} else {
				let agents = this.all_agents.filter(a => a.email.includes((value as string).toLowerCase()));
				this.all_agents = agents;
			}
		} else {
			this.all_agents = this.originalAgents;
			this.ended = false;
		}
	}
	LoadMoreAgent() {
		if (!this.ended && !this.loadingMoreAgents && !this.selectedAgent.length) {
			this.loadingMoreAgents = true;
			this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(response => {
				this.all_agents = this.all_agents.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}

	moveUp(index: number) {
		if (index >= 1) {
			this.swap((this.scenarioForm.controls.actions as FormArray).controls, index, index - 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'No action above, Not allowed!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
	}

	moveDown(index: number) {
		if (index < (this.scenarioForm.get('actions') as FormArray).length - 1) {
			this.swap((this.scenarioForm.controls.actions as FormArray).controls, index, index + 1)
		}
		else {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'No action below, Not allowed!'
				},
				duration: 2000,
				panelClass: ['user-alert', 'warning']
			});
		}
	}

	swap(array: any[], index1: any, index2: any) {
		let temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	}

	GetAvailableActions(i) {
		let actionList = {
			'agentAssign': 'Assign To Agent',
			'groupAssign': 'Assign To Group',
			'null1': '------------------',
			'priorityAssign': 'Set Priority',
			'stateAssign': 'Set State',
			'viewStateAssign': 'Set ViewState',
			'snoozeAssign': 'Set Snooze',
			'null2': '------------------',
			'noteAssign': 'Add Note',
			'tagAssign': 'Add Tag',
			'taskAssign': 'Add Task',
			'watcherAssign': 'Add Watcher'
			// 'null3': '------------------',
			// 'emailToGroup': 'Send Email to Group',
			// 'emailToAgent': 'Send Email to Agent',

		}
		let actions = this.scenarioForm.get('actions') as FormArray;

		actions.controls.map((control, index) => {
			// if (actions.controls[index].get('scenarioName').value == "stateAssign" && actions.controls[index].get('scenarioValue').value == "CLOSED") {
			//   delete actionList['agentAssign'];
			// }
			if (actionList[actions.controls[index].get('scenarioName').value] && index != i) {
				delete actionList[actions.controls[index].get('scenarioName').value]
			}
		});
		return actionList;
	}


	GetControls(name: string) {
		return (this.scenarioForm.get(name) as FormArray).controls;
	}

	AddAction() {
		let fb: FormGroup = this.formbuilder.group({
			scenarioName: [''],
			scenarioValue: ['']

		})
		let actions = this.scenarioForm.get('actions') as FormArray;
		actions.push(fb);
	}

	DeleteAction(index, name) {
		// console.log(name)
		let actions = this.scenarioForm.get('actions') as FormArray;
		actions.removeAt(index);
		if (name == 'groupAssign') {
			this.all_agents = this.originalAgents;
		}
	}

	AddTicketScenario() {
		if (this.allScenarios && this.allScenarios.filter(data => data.scenarioTitle.toLowerCase().trim() == this.scenarioForm.get('scenarioTitle').value.toLowerCase().trim()).length > 0) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Ticket Scenario name already exists!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		}
		else {
			let scenario = {
				nsp: this.nsp,
				scenarioTitle: this.scenarioForm.get('scenarioTitle').value,
				scenarioDesc: this.scenarioForm.get('scenarioDesc').value,
				availableFor: this.ParseAvailabeFor(this.scenarioForm.get('availableFor').value),
				groupName: this.scenarioForm.get('groupName').value && this.scenarioForm.get('groupName').value.length ? this.scenarioForm.get('groupName').value : [],
				actions: this.ParseActions(this.scenarioForm.get('actions') as FormArray),
				created: { date: new Date().toISOString(), by: this.email }
			}
			// console.log(scenario);

			this._scenarioService.AddTicketScenario(scenario).subscribe(res => {
				if (res.status == "ok") {
				}
			});
		}
	}

	UpdateTicketScenario() {
		let scenario = {
			nsp: this.nsp,
			scenarioTitle: this.scenarioForm.get('scenarioTitle').value,
			scenarioDesc: this.scenarioForm.get('scenarioDesc').value,
			availableFor: this.scenarioForm.get('availableFor').value,
			groupName: this.scenarioForm.get('groupName').value && this.scenarioForm.get('groupName').value.length ? this.scenarioForm.get('groupName').value : [],
			actions: this.ParseActions(this.scenarioForm.get('actions')),
			created: this.TicketScenarioObject.created
		}

		this.subscriptions.push(this._scenarioService.updateScenario(this.selectedscenario._id, scenario).subscribe(response => {
			if (response.status == 'ok') {
			}
		}));
	}

	Cancel() {
		if (this.formChanges) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._scenarioService.AddScenario.next(false);
					this._scenarioService.selectedScenario.next(undefined);
				} else {
					return;
				}
			});
		}
		else {
			this._scenarioService.AddScenario.next(false);
			this._scenarioService.selectedScenario.next(undefined);
		}

	}

	ParseAvailabeFor(avFor) {
		let str = ''
		if (avFor == "me") str = this.agent;
		else str = avFor;
		return str;
	}

	ParseActions(formArray) {
		let actions = [];
		formArray.controls.map(control => {
			switch (control.get('scenarioName').value) {
				case 'tagAssign':
					control.get('scenarioValue').value = this.selectedTags;
					break;
				case 'watcherAssign':
					control.get('scenarioValue').value = this.selectedWatchers;
					break;

				default:
					control.get('scenarioValue').value = control.get('scenarioValue').value;
			}
			let obj = {

				scenarioName: control.get('scenarioName').value,
				scenarioValue: control.get('scenarioValue').value,
			}
			actions.push(obj);
		})
		return actions;
	}

	ngOnDestroy() {
		this._scenarioService.AddScenario.next(false);

		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}
}
