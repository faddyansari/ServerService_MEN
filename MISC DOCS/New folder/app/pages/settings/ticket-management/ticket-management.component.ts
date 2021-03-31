import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GlobalStateService } from '../../../../services/GlobalStateService';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-ticket-management',
	templateUrl: './ticket-management.component.html',
	styleUrls: ['./ticket-management.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketManagementComponent implements OnInit {

	@Input() activeTab: string;
	permissions : any;
	subscriptions: Subscription[] = [];
	agent: any;
	package: any;
	constructor(public _globalStateServie: GlobalStateService, _authService: AuthService) {
		// console.log('Ticket Management Component');
		// console.log(_globalStateServie.currentRoute);
		this.subscriptions.push(_authService.getPackageInfo().subscribe(pkg => {
            // console.log(data);
			if(pkg){
				this.package = pkg.tickets;
			}	
		}));
		this.subscriptions.push(_authService.getAgent().subscribe(agent => {
			if(agent) this.agent = agent;
		}));
		this.subscriptions.push(_authService.getSettings().subscribe(data => {
            // console.log(data);
            if (data && data.permissions) {
				this.permissions = data.permissions.settings.ticketManagement;
                // console.log(this.permissions);			
			}
			
		}));	
	}

	ngOnInit() {
	}

	public STOPPROPAGATION(event: Event) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		this._globalStateServie.setSettingsMenu(false);
	}

	setActiveTab(state: string) {
		this.activeTab = state;
	}

	ngOnDestroy(){
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		})
	}
}
