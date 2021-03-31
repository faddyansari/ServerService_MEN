import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { AgentService } from '../../../../../services/AgentService';
import { TicketTemplateSevice } from '../../../../../services/LocalServices/TicketTemplateService';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-templates',
	templateUrl: './ticket-templates.component.html',
	styleUrls: ['./ticket-templates.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketTemplatesComponent implements OnInit {


	subscriptions: Subscription[] = [];

	addTemplate = false;
	selectedTemplate = undefined;
	ticketTemplateObject = undefined;
	nsp = '';
	email = '';
	package: any;

	constructor(private _authService: AuthService,private _appStateService: GlobalStateService, private _ticketTemplateService: TicketTemplateSevice) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');
		this.nsp = this._ticketTemplateService.Agent.nsp;
		this.email = this._ticketTemplateService.Agent.email;
		this.ticketTemplateObject = {
			nsp: '',
			templateName: '',
			templateDesc: '',
			availableFor: 'allagents',
			groupName: [],
			subject: '',
			status: '',
			priority: '',
			group: '',
			agent: {},
			cannedForm: '',
			tags: [],
			watchers: [],
			message: '',
			created: { date: new Date().toISOString(), by: this.email },
			lastModified: { date: '', by: '' }
		};

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
                this.package = pkg.tickets.ticketTemplate;
                if(!this.package.allowed){
                    this._appStateService.NavigateTo('/noaccess');
                }
			}

		}));


		this.subscriptions.push(this._ticketTemplateService.AddTemplate.subscribe(data => {
			this.addTemplate = data;
		}));

		this.subscriptions.push(this._ticketTemplateService.selectedTemplate.subscribe(data => {
			this.selectedTemplate = data;
		}));



	}

	ngOnInit() {
	}

	// save() {
	// 	this.formArray.push(this.newTemplateForm.value)
	// 	console.log(this.formArray);
	// 	this.newTemplateForm.reset()
	// 	this.newTemplateForm.get('availFor').setValue("groupagent")

	// }

	AddTemplate() {
		this._ticketTemplateService.AddTemplate.next(true);
	}
}
