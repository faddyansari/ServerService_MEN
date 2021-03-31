import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TicketsService } from '../../../../services/TicketsService';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { TagService } from '../../../../services/TagService';
import { AuthService } from '../../../../services/AuthenticationService';


@Component({
	selector: 'app-ticket-types',
	templateUrl: './ticket-types.component.html',
	styleUrls: ['./ticket-types.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TicketTypesComponent implements OnInit {
	subscriptions: Subscription[] = [];
	verified = true;
	selectedThread: any;
	agent: any;
	redirectURI = '';
	viewState : any;

	totalTicketsCount = 0;
	openTicketsCount = 0;
	pendingTicketsCount = 0;
	solvedTicketsCount = 0;
	closedTicketsCount = 0;
	groupedTicketsCount = 0;


	constructor(private _authService: AuthService,
		public dialog: MatDialog,
		_tagService: TagService,
		private _ticketService: TicketsService,
	) {
		this.subscriptions.push(this._authService.getSettings().subscribe(settings => {

			if (settings) this.verified = settings.verified;
		}));

		this.subscriptions.push(_authService.getAgent().subscribe(data => {
			this.agent = data;
		}));

		this.subscriptions.push(_authService.GetRedirectionURI().subscribe(data => {
			this.redirectURI = data;
		}));

		

		this.subscriptions.push(_ticketService.getSelectedThread().subscribe(selectedThread => {
			this.selectedThread = selectedThread;
		}));
		this.subscriptions.push(_ticketService.getTicketsCount().subscribe(ticketsList => {
			this.openTicketsCount = 0;
			this.pendingTicketsCount = 0;
			this.solvedTicketsCount = 0;
			this.groupedTicketsCount = 0;
			this.closedTicketsCount = 0;
			ticketsList.map(ticket => {
				if (ticket.state == "OPEN") this.openTicketsCount += 1;
				else if (ticket.state == "PENDING") this.pendingTicketsCount += 1;
				else if (ticket.state == "SOLVED") this.solvedTicketsCount += 1;
				else if(ticket.state == "CLOSED") this.closedTicketsCount += 1;

				if (ticket.merged && ticket.mergedTicketIds && ticket.mergedTicketIds.length) this.groupedTicketsCount += 1;
			});
		}));
	}
	ngOnInit() {
	}

	setView(viewState: string) {
	//	this._ticketService.setViewState(viewState);
		this._ticketService.setPagination(0);
	}

	//Go To TicketView 
	setSelectedThread(id: string) {

		this._ticketService.setSelectedThread(id);
	}

	ngOnDestroy(): void {
		//Called once, before the instance is destroyed.
		//Add 'implements OnDestroy' to the class.
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

}
