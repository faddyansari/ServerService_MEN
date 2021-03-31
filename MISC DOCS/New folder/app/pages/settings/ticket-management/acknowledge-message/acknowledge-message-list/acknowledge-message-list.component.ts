import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AcknowledgeMessageService } from '../../../../../../services/LocalServices/AcknowledgeMessageService';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-acknowledge-message-list',
  templateUrl: './acknowledge-message-list.component.html',
  styleUrls: ['./acknowledge-message-list.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AcknowledgeMessageListComponent implements OnInit {

  allAckMessage = [];
  subscriptions: Subscription[] = [];
  constructor(private _ackMessageSvc: AcknowledgeMessageService, private dialog: MatDialog) {
    this._ackMessageSvc.getAllAckMessages();
    this.subscriptions.push(this._ackMessageSvc.AllAckMessages.subscribe(data => {
      if (data && data.length) {
        this.allAckMessage = data;
      }
      else {
        this.allAckMessage = [];
      }
      
    }));
  }
  ngOnInit() {
  }

  editMessage(message) {
    this._ackMessageSvc.selectedAckMessage.next(message);
  }

  deleteMessage(name) {
    this.dialog.open(ConfirmationDialogComponent, {
      panelClass: ['confirmation-dialog'],
      data: { headermsg: "Are you sure want to delete this acknowledgement message?" }
    }).afterClosed().subscribe(data => {
      if (data == 'ok') {
        if (this.allAckMessage && this.allAckMessage.length) {
          let ind = this.allAckMessage.findIndex(x => x.name == name)
          this.allAckMessage.splice(ind, 1);
          this._ackMessageSvc.deleteAckMessage(this.allAckMessage);
        }
      }
    });
  }

  toggleActivation(name, flag) {
    this.allAckMessage.forEach(val => {
      if (val.activated && val.name != name) {
        val.activated = false;
        return;
      }
      else {
        let index = this.allAckMessage.findIndex(res=>res.name ==name);
        this.allAckMessage[index].activated = flag;
        this._ackMessageSvc.toggleActivation(this.allAckMessage,flag).subscribe(res => {

        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

}
