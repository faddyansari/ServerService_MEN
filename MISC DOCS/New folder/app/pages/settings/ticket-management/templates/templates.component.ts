// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { GlobalStateService } from '../../../../../services/GlobalStateService';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Subscription } from 'rxjs/Subscription';
// import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
// import { UtilityService } from '../../../../../services/UtilityServices/UtilityService';

// @Component({
// 	selector: 'app-templates',
// 	templateUrl: './templates.component.html',
// 	styleUrls: ['./templates.component.scss'],
// 	encapsulation : ViewEncapsulation.None
// })
// export class TemplatesComponent implements OnInit {

	
// 	subscriptions: Subscription[] = [];
// 	public newTemplateForm: FormGroup;
// 	groups: any
// 	agent: any
// 	formArray = []
	
// 	showForm = false;

// 	constructor(private formbuilder: FormBuilder, private _utilityService: UtilityService, private tickAuto: TicketAutomationService, private _appStateService: GlobalStateService) {
// 		this._appStateService.contentInfo.next('');
// 		this._appStateService.breadCrumbTitle.next('Ticket Management');

// 		this.subscriptions.push(tickAuto.Groups.subscribe(data => {
// 			if (data) {
// 				this.groups = data.map(g => g.group_name);
// 			}
// 		}));


// 		this.subscriptions.push(_utilityService.getAllAgentsListObs().subscribe(data => {
// 			if (data) {
// 				this.agent = data.map(a => a.nickname);
// 				//console.log(this.agent);
// 			}
// 		}));

// 		this.newTemplateForm = this.formbuilder.group({
// 			'title': [null, Validators.required],
// 			'description': [],
// 			'availFor': ["groupagent", Validators.required],
// 			'subject': [null, Validators.required],
// 			'status': [null, Validators.required],
// 			'priority': [null, Validators.required],
// 			'group': [null, Validators.required],
// 			'agent': [null, Validators.required],
// 			'message': [null, Validators.required]
// 		});

// 	}

// 	ngOnInit() {
// 	}

// 	public ShowForm() {
// 		this.showForm = !this.showForm;
// 	}

// 	save() {
// 		this.formArray.push(this.newTemplateForm.value)
// 		console.log(this.formArray);
// 		this.newTemplateForm.reset()
// 		this.newTemplateForm.get('availFor').setValue("groupagent")

// 	}
// }
