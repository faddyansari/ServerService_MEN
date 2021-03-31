import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../services/AuthenticationService';

@Component({
	selector: 'app-analytics-tickets',
	templateUrl: './analytics-tickets.component.html',
	styleUrls: ['./analytics-tickets.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticsTicketsComponent implements OnInit {

	agent: any;
	constructor(private _authService: AuthService) {
		_authService.getAgent().subscribe(agent => {
			if(agent) this.agent = agent;
		})
	}
	ngOnInit() {
	}
	ngAfterViewInit() {
	}

}
