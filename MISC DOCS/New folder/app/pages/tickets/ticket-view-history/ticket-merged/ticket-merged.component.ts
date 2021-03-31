import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ticket-merged',
  templateUrl: './ticket-merged.component.html',
  styleUrls: ['./ticket-merged.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketMergedComponent implements OnInit {
  @Input('selectedThread') selectedThread: any;
  @Output('demergeInfo') demergeInfo = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  Demerge(selectedThreadId, DemergeId) {
    this.demergeInfo.emit({
      selectedThreadId: selectedThreadId,
      DemergeId: DemergeId
    })
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
  ScrollintoView(id: string) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: "start" });
  }
}
