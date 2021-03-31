import { TicketSecnarioAutomationService } from './../../../../../services/LocalServices/TicketSecnarioAutomationService';
import { Component, OnInit } from '@angular/core';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/AuthenticationService';

@Component({
	selector: 'app-ticket-scenario-automation',
	templateUrl: './ticket-scenario-automation.component.html',
	styleUrls: ['./ticket-scenario-automation.component.css']
})
export class TicketScenarioAutomationComponent implements OnInit {
	ticketScenarioObject = undefined;
	subscriptions: Subscription[] = [];
	addScenario = false;
	selectedScenario = undefined;
	nsp = '';
	email = '';
	package: any;
	constructor(private _authService: AuthService,private _appStateService: GlobalStateService, private _scenarioService: TicketSecnarioAutomationService) {
		this._appStateService.contentInfo.next('');
		this._appStateService.breadCrumbTitle.next('Ticket Management');
		this.nsp = this._scenarioService.Agent.nsp;
		this.email = this._scenarioService.Agent.email;
		this.ticketScenarioObject = {
			nsp: '',
			scenarioTitle: '',
			scenarioDesc: '',
			availableFor: 'allagents',
			groupName: [],
			actions: [{ scenarioName: '', scenarioValue: '' }],
			created: { date: new Date().toISOString(), by: this.email },
			lastModified: { date: '', by: '' }
		};

		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {

			if (pkg) {
				this.package = pkg.tickets.scenarioAutomation;
				if (!this.package.allowed) {
					this._appStateService.NavigateTo('/noaccess');
				}
			}

		}));
		this.subscriptions.push(this._scenarioService.AddScenario.subscribe(data => {
			this.addScenario = data;
		}));

		this.subscriptions.push(this._scenarioService.selectedScenario.subscribe(data => {
			this.selectedScenario = data;
		}));
	}

	ngOnInit() {
	}

	AddScenario() {
		this._scenarioService.AddScenario.next(true);
	}

}
