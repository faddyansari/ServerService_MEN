import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketHistoryComponent implements OnInit {
  @Input('visitor_ticket_history') visitor_ticket_history: any;
  @Output('threadId') threadId = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setSelectedThread(_id) {
    this.threadId.emit(_id);
  }

  seeCMID(ticket) {
		let res = ticket.subject.split('/');
		if (res && res.length) {
			if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
				
				if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
					return false
				}
				else return true
			}
		}
		else return false
	}

}
