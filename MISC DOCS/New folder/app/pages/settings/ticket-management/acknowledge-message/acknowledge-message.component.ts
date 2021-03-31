import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TicketAutomationService } from '../../../../../services/LocalServices/TicketAutomationService';
import { AuthService } from '../../../../../services/AuthenticationService';
import { TicketsService } from '../../../../../services/TicketsService';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
import { Subscription } from 'rxjs';
import { AcknowledgeMessageService } from '../../../../../services/LocalServices/AcknowledgeMessageService';

@Component({
  selector: 'app-acknowledge-message',
  templateUrl: './acknowledge-message.component.html',
  styleUrls: ['./acknowledge-message.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AcknowledgeMessageComponent implements OnInit {
  subscriptions: Subscription[] = [];
  addMessage = false;
selectedMessage = undefined;
  constructor(private dialog: MatDialog, private _ackMessageService: AcknowledgeMessageService, private snackBar: MatSnackBar, private _appStateService: GlobalStateService) {
    this._appStateService.contentInfo.next('');
    this._appStateService.breadCrumbTitle.next('Ticket Management');
    
    this.subscriptions.push(this._ackMessageService.AddAckMessage.subscribe(data => {
			this.addMessage = data;
		}));

		this.subscriptions.push(this._ackMessageService.selectedAckMessage.subscribe(data => {
			this.selectedMessage = data;
		}));
   }

  ngOnInit() {
  }

  AddAckMessage(){
		this._ackMessageService.AddAckMessage.next(true);
  }

	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}

}
