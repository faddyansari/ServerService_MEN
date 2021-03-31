import { UtilityService } from './../../../../../../services/UtilityServices/UtilityService';
import { FormDesignerService } from './../../../../../../services/LocalServices/FormDesignerService';
import { AgentService } from './../../../../../../services/AgentService';
import { TicketAutomationService } from './../../../../../../services/LocalServices/TicketAutomationService';
import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TicketTemplateSevice } from '../../../../../../services/LocalServices/TicketTemplateService';
import { Subscription, Observable } from 'rxjs';

import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalStateService } from '../../../../../../services/GlobalStateService';
import { PopperContent } from 'ngx-popper';
import { TicketsService } from '../../../../../../services/TicketsService';
import { AuthService } from '../../../../../../services/AuthenticationService';

@Component({
	selector: 'app-add-ticket-templates',
	templateUrl: './add-ticket-templates.component.html',
	styleUrls: ['./add-ticket-templates.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AddTicketTemplatesComponent implements OnInit {
	@Input() TicketTemplateObject: any;
	@ViewChild('cannedMessages') cannedMessages: PopperContent
	public newTemplateForm: FormGroup;
	selectedTemplate = undefined;
	subscriptions: Subscription[] = [];
	groups = [];
	agents = [];
	all_agents = [];
	watch_agents = [];
	allTemplates = [];
	all_Forms = [];
	automatedResponses = [];
	defaultConstantValues = undefined;
	cloneTemplate = false;
	loadingMoreAgents = false;
	ended = false;
	nsp = '';
	email = '';
	message = '';
	whiteSpace = /^[^\s]+(\s+[^\s]+)*$/;
	tagPattern = /^[ \t]*#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])[ \t]*((,)?#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z]))*$/;
	selectedTags = [];
	selectedWatchers = [];
	formChanges: any;
	config: any = {
		placeholder: 'Enter your message here ...',
		height: 250,
		toolbar: [
			['style', ['style', 'bold', 'italic', 'underline']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['fontName', ['fontName']],
			['para', ['ul', 'ol', 'paragraph']],
			['height', ['height']],
			// ['insert', ['linkDialogShow', 'unlink', 'hr']],
			['view', ['codeview', 'undo', 'redo']],
			['help', ['help']]
		],

	};
	package: any;

	constructor(private formbuilder: FormBuilder,
		private _authService: AuthService,
		private _ticketTemplateService: TicketTemplateSevice,
		private _ticketAutomationSvc: TicketAutomationService,
		private _ticketService: TicketsService,
		private _globalStateService: GlobalStateService,
		private _agentService: AgentService,
		private _utilityService: UtilityService,
		private _formService: FormDesignerService,
		public snackBar: MatSnackBar,
		private dialog: MatDialog) {

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.ticketTemplate;
				if (!this.package.allowed) {
					this._globalStateService.NavigateTo('/noaccess');
				}
			}

		}));
		this.nsp = this._ticketTemplateService.Agent.nsp;
		this.email = this._ticketTemplateService.Agent.email;

		this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(data => {
			if (data) {
				data.map(val => {
					this.groups.push({ display: val.group_name, value: val.group_name })
				})
			}

		}));

		this.subscriptions.push(this._formService.WholeForm.subscribe(data => {
			if (data) {
				this.all_Forms = data;
			}
		}));

		this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
			this.all_agents = agents;
			this.watch_agents = agents;
		}));

		this.subscriptions.push(this._ticketTemplateService.cloneTemplate.subscribe(data => {
			if (data) {
				this.cloneTemplate = data;
			}
		}));

		this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(data => {
			if (data.status == "ok") {
				this.automatedResponses = data.AutomatedResponses;
			}
		}));

		this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(data => {
			if (data && data.length) {
				this.allTemplates = data;
			}
			else {
				this.allTemplates = [];
			}
		}));
	}

	ngOnInit() {
		this.newTemplateForm = this.formbuilder.group({
			'templateName': [this.TicketTemplateObject.templateName, Validators.required],
			'templateDesc': [this.TicketTemplateObject.templateDesc],
			'availableFor': [this.TicketTemplateObject.availableFor, Validators.required],
			'groupName': [this.TicketTemplateObject.groupName],
			'subject': [this.TicketTemplateObject.subject, [Validators.required, Validators.pattern(this.whiteSpace)]],
			'status': [this.TicketTemplateObject.status, Validators.required],
			'priority': [this.TicketTemplateObject.priority, Validators.required],
			'group': [this.TicketTemplateObject.group],
			'agent': [this.TicketTemplateObject.agent],
			'cannedForm': [this.TicketTemplateObject.cannedForm],
			'watchers': [this.TicketTemplateObject.watchers],
			'tags': [this.TicketTemplateObject.tags,
			[
				Validators.maxLength(32),
			]
			],
			'message': [this.TicketTemplateObject.message]
		});

		//to populate agent according to selected template.
		this.subscriptions.push(this._ticketTemplateService.selectedTemplate.subscribe(data => {
			if (data) {
				this.selectedTemplate = data;
				if (this.selectedTemplate && this.selectedTemplate.agent && this.selectedTemplate.agent.email) { this.newTemplateForm.get('agent').setValue(this.selectedTemplate.agent.email) }
				else this.newTemplateForm.get('agent').setValue({})
				if (this.selectedTemplate.group) {
					this.subscriptions.push(this._ticketService.getAgentsAgainstGroup([this.newTemplateForm.get('group').value]).subscribe(agents => {
						if (agents && agents.length) {
							this.all_agents = agents;
						}
						else {
							this.all_agents = []
						}
					}));
				} else {
					this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(agents => {
						this.all_agents = agents;
					}));
				}
				if (this.selectedTemplate.tags && this.selectedTemplate.tags.length) this.selectedTags = this.selectedTemplate.tags;
				if (this.selectedTemplate.watchers && this.selectedTemplate.watchers.length) this.selectedWatchers = this.selectedTemplate.watchers;
			}
			else {
				this.selectedTemplate = undefined;
			}
		}));
		this.onValueChanges();
	}

	onValueChanges() {
		this.newTemplateForm.valueChanges.subscribe(val => {
			this.formChanges = val;
		})
	}

	ParseAgent(agent) {
		let emailKeyVal = {};
		if (!Object.keys(agent).length) {
			emailKeyVal = '';
		}
		else {
			emailKeyVal['email'] = agent;
		}
		return emailKeyVal;
	}


	AddTicketTemplate() {
		if (this.allTemplates && this.allTemplates.filter(data => data.templateName.toLowerCase().trim() == this.newTemplateForm.get('templateName').value.toLowerCase().trim()).length > 0) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Ticket Template name already exists!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'warning']
			});
			return;
		}
		else {
			if (this.selectedTags && this.selectedTags.length) {
				this.newTemplateForm.get('tags').setValue(this.selectedTags)
			}
			if (this.selectedWatchers && this.selectedWatchers.length) {
				this.newTemplateForm.get('watchers').setValue(this.selectedWatchers)
			}
			let template = {
				nsp: this.nsp,
				templateName: this.newTemplateForm.get('templateName').value,
				templateDesc: this.newTemplateForm.get('templateDesc').value,
				availableFor: this.newTemplateForm.get('availableFor').value,
				groupName: this.newTemplateForm.get('groupName').value && this.newTemplateForm.get('groupName').value.length ? this.newTemplateForm.get('groupName').value : [],
				subject: this.newTemplateForm.get('subject').value,
				status: this.newTemplateForm.get('status').value,
				priority: this.newTemplateForm.get('priority').value,
				group: this.newTemplateForm.get('group').value,
				agent: this.ParseAgent(this.newTemplateForm.get('agent').value),
				cannedForm: (this.newTemplateForm.get('cannedForm').value),
				tags: this.newTemplateForm.get('tags').value,
				watchers: this.newTemplateForm.get('watchers').value,
				message: this.newTemplateForm.get('message').value,
				created: { date: new Date().toISOString(), by: this.email }
			}
			this._ticketTemplateService.AddTicketTemplate(template).subscribe(res => {
				if (res.status == "ok") {
				}
			});
		}
	}

	loadMoreAgents(agentsFromDB) {
		if (!this.ended && !this.loadingMoreAgents) {
			this.loadingMoreAgents = true;
			this._agentService.getMoreAgentsObs(agentsFromDB).subscribe(response => {
				this.all_agents = this.all_agents.concat(response.agents);
				this.ended = response.ended;
				this.loadingMoreAgents = false;
			});
		}
	}

	Cancel() {
		// console.log(this.formChanges);
		if (this.formChanges) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to leave?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._ticketTemplateService.AddTemplate.next(false);
					this._ticketTemplateService.selectedTemplate.next(undefined);
				} else {
					return;
				}
			});
		}
		else {
			this._ticketTemplateService.AddTemplate.next(false);
			this._ticketTemplateService.selectedTemplate.next(undefined);
		}

	}

	AddCannedMessage(hashtag) {

		let result = '';
		this.automatedResponses.map(val => {
			if (val.hashTag == hashtag) {
				result = val.responseText;
			}
		});
		this.newTemplateForm.get('message').setValue(this.newTemplateForm.get('message').value + ' ' + result.toString());
		this.cannedMessages.hide();
	}

	GetAvailableAgents() {
		// console.log("group", this.newTemplateForm.get('group').value);
		if (this.newTemplateForm.get('group').value) {

			this._ticketService.getAgentsAgainstGroup([this.newTemplateForm.get('group').value]).subscribe(agents => {
				if (agents && agents.length) {
					// console.log(agents);
					this.newTemplateForm.get('agent').setValue({})
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

	onDeSelect(event: any) {
		this.selectedWatchers = event;
	}

	UpdateTicketTemplate() {
		//console.log(this.selectedWatchers);

		if (this.selectedTags && this.selectedTags.length) {
			this.newTemplateForm.get('tags').setValue(this.selectedTags)
		}
		if (this.selectedWatchers && this.selectedWatchers.length) {
			this.newTemplateForm.get('watchers').setValue(this.selectedWatchers)
		}
		let updatedTemplate = {
			nsp: this.nsp,
			templateName: this.newTemplateForm.get('templateName').value,
			templateDesc: this.newTemplateForm.get('templateDesc').value,
			availableFor: this.newTemplateForm.get('availableFor').value,
			groupName: this.newTemplateForm.get('groupName').value && this.newTemplateForm.get('groupName').value.length ? this.newTemplateForm.get('groupName').value : [],
			subject: this.newTemplateForm.get('subject').value,
			status: this.newTemplateForm.get('status').value,
			priority: this.newTemplateForm.get('priority').value,
			group: this.newTemplateForm.get('group').value,
			agent: this.ParseAgent(this.newTemplateForm.get('agent').value),
			cannedForm: this.newTemplateForm.get('cannedForm').value,
			tags: this.newTemplateForm.get('tags').value,
			message: this.newTemplateForm.get('message').value,
			watchers: this.newTemplateForm.get('watchers').value,
			created: this.TicketTemplateObject.created,
		}

		this.subscriptions.push(this._ticketTemplateService.UpdateTicketTemplate(this.selectedTemplate._id, updatedTemplate).subscribe(response => {
			if (response.status == 'ok') {
			}
		}));
	}

	GotoAR() {
		this._globalStateService.NavigateForce('/settings/general/automated-responses');
	}

	ngOnDestroy() {
		this._ticketTemplateService.AddTemplate.next(false);
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

}