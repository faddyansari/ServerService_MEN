import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AcknowledgeMessageService } from '../../../../../../services/LocalServices/AcknowledgeMessageService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { TicketTemplateSevice } from '../../../../../../services/LocalServices/TicketTemplateService';
import { GlobalStateService } from '../../../../../../services/GlobalStateService';
import { PopperContent } from 'ngx-popper';
import { ConfirmationDialogComponent } from '../../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToastNotifications } from '../../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { PreviewAckMessageComponent } from '../../../../../dialogs/preview-ack-message/preview-ack-message.component';

@Component({
  selector: 'app-add-acknowledge-message',
  templateUrl: './add-acknowledge-message.component.html',
  styleUrls: ['./add-acknowledge-message.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddAcknowledgeMessageComponent implements OnInit {
  subscriptions: Subscription[] = [];
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  whiteSpaceRegex = /^[^-\s][a-zA-Z0-9_\s-]+$/;

  @ViewChild('cannedResponsePopper') cannedResponsePopper: PopperContent;
  @ViewChild('insertPlaceholder') insertPlaceholder: PopperContent
  ackMessagesList = [];
  ackMessageForm: FormGroup;
  automatedResponses = [];
  formChanges: any;
  selectedMessage = undefined;
  ticketFields = [{ name: "Ticket ID", value: "{{ticket.id}}" }, { name: "Ticket Priority", value: "{{ticket.priority}}" }, { name: "Ticket State", value: "{{ticket.state}}" }, { name: "Ticket Source", value: "{{ticket.source}}" }, { name: "Ticket Assigned Agent", value: "{{ticket.assignedTo}}" }];
  requestorFields = [{ name: "Visitor Name", value: "{{visitor.name}}" }, { name: "Visitor Email", value: "{{visitor.email}}" }]
  pills = {
    'tickets': true,
    'requestor': false,
  }
  config: any = {
    placeholder: 'Enter message..',
    toolbar: [
      ['style', ['bold', 'italic', 'underline']],
      ['fontname', ['fontname']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['fontstyle', ['backcolor']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['200']],
      ['insert', ['linkDialogShow', 'unlink']],
      ['view', ['fullscreen', 'undo', 'redo']]
    ]
  };
  constructor(private formbuilder: FormBuilder, private _ackMessagesvc: AcknowledgeMessageService, private dialog: MatDialog, public snackBar: MatSnackBar, private _ticketTemplateService: TicketTemplateSevice, private _globalStateService: GlobalStateService) {
    this.subscriptions.push(this._ackMessagesvc.AllAckMessages.subscribe(res => {
      if (res && res.length) {
        this.ackMessagesList = res;
      }
    }));
    this.subscriptions.push(this._ticketTemplateService.getAutomatedResponseAgainstAgent().subscribe(data => {
      if (data.status == "ok") {
        this.automatedResponses = data.AutomatedResponses;
      }
    }));
    this.subscriptions.push(this._ackMessagesvc.selectedAckMessage.subscribe(data => {
      if(data){
        this.selectedMessage = data;
      
      }
    }));
  }

  ngOnInit() {
    this.ackMessageForm = this.formbuilder.group({
      'name':
        [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(this.whiteSpaceRegex)
          ],
        ],
        'disabledFor':
        [
          [],
          [
            Validators.required,
            Validators.pattern(this.emailPattern)
          ],
        ],
      'message':
        [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(this.whiteSpaceRegex)
          ],
        ],
    });
    if(this.selectedMessage){
      this.ackMessageForm.get('name').setValue(this.selectedMessage.name);
      this.ackMessageForm.get('message').setValue(this.selectedMessage.message);
      this.ackMessageForm.get('disabledFor').setValue(this.selectedMessage.disabledFor);

    }
  }


  GotoAR(ev) {
    if (ev) {
      this._globalStateService.NavigateForce('/settings/general/automated-responses');
    }
  }
  ClosePopper() {
    this.insertPlaceholder.hide();
  }
  InsertCannedMessage(hashTag) {
    let result = '';
    this.automatedResponses.map(val => {
      if (val.hashTag == hashTag) {
        result = val.responseText;
      }
    });
    this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
    this.cannedResponsePopper.hide();
  }
  setPillActive(pill) {
    Object.keys(this.pills).map(key => {
      if (key == pill) {
        this.pills[key] = true;
      } else {
        this.pills[key] = false;
      }
    })
  }
  AddTicketField(name) {
    let result = '';
    this.ticketFields.map(val => {
      if (val.name == name) {
        result = val.value;
      }
    });
    this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
  }
  AddRequestorField(name) {
    let result = '';
    this.requestorFields.map(val => {
      if (val.name == name) {
        result = val.value;
      }
    });
    this.ackMessageForm.get('message').setValue(this.ackMessageForm.get('message').value + ' ' + result.toString());
  }
  CancelAckMessage() {
    if (this.ackMessageForm.get('name').value || this.ackMessageForm.get('message').value) {
      this.dialog.open(ConfirmationDialogComponent, {
        panelClass: ['confirmation-dialog'],
        data: { headermsg: 'Are you sure want to leave?' }
      }).afterClosed().subscribe(data => {
        if (data == 'ok') {
          this._ackMessagesvc.selectedAckMessage.next(undefined);
          this._ackMessagesvc.AddAckMessage.next(false);
        } else {
          return;
        }
      });
    }
    else {
      this._ackMessagesvc.selectedAckMessage.next(undefined);
      this._ackMessagesvc.AddAckMessage.next(false);
    }
  }
  UpdateAckMessage() {
    let obj = {
      name: this.ackMessageForm.get('name').value,
      message: this.ackMessageForm.get('message').value,
      disabledFor:this.ackMessageForm.get('disabledFor').value,
      activated: this.selectedMessage.activated
    }
    if(obj.name.toLowerCase().trim() != this.selectedMessage.name.toLowerCase().trim()){
     
      if (this.ackMessagesList && this.ackMessagesList.filter(data => data.name.toLowerCase().trim() == obj.name.toLowerCase().trim()).length > 0) {
        this.snackBar.openFromComponent(ToastNotifications, {
          data: {
            img: 'warning',
            msg: 'Ack. message name already exists!'
          },
          duration: 3000,
          panelClass: ['user-alert', 'warning']
        });
        return;
      }
      else{
        console.log("in else");
        
        let index = this.ackMessagesList.findIndex(x => x.name == this.selectedMessage.name);
        this.ackMessagesList[index] = obj;
        this._ackMessagesvc.updateAckMessage(this.ackMessagesList).subscribe(res => {
          if (res.status == "ok") {
          }
        });
      }
    }
    else{
      let index = this.ackMessagesList.findIndex(x => x.name == this.selectedMessage.name);
      this.ackMessagesList[index] = obj;
      this._ackMessagesvc.updateAckMessage(this.ackMessagesList).subscribe(res => {
        if (res.status == "ok") {
        }
      });
    }
  }
  PreviewAckMessage() {
      let ackPreviewObj = {
        name: this.ackMessageForm.get('name').value,
        message: this.ackMessageForm.get('message').value,
      }

      this.dialog.open(PreviewAckMessageComponent, {
        panelClass: ['small-dialog'],
        disableClose: true,
        autoFocus: true,
        data: ackPreviewObj

      }).afterClosed().subscribe(data => {
      });
  }
  AddAckMessage() {
    if (this.ackMessagesList && this.ackMessagesList.filter(data => data.name.toLowerCase().trim() == this.ackMessageForm.get('name').value.toLowerCase().trim()).length > 0) {
      this.snackBar.openFromComponent(ToastNotifications, {
        data: {
          img: 'warning',
          msg: 'Ack. message name already exists!'
        },
        duration: 3000,
        panelClass: ['user-alert', 'warning']
      });
      return;
    }
    else {
      let obj = {
        name: this.ackMessageForm.get('name').value,
        message: this.ackMessageForm.get('message').value,
        disabledFor:this.ackMessageForm.get('disabledFor').value,
        activated: false
      }
      if (this.ackMessagesList && !this.ackMessagesList.length) this.ackMessagesList = [];
      let temp = Array.from(this.ackMessagesList);
      temp.push(obj);
      this._ackMessagesvc.addAckMessage(temp).subscribe(res => {
        if (res.status == "ok") {
        }
      });
    }
  }
  ngOnDestroy() {
    this._ackMessagesvc.AddAckMessage.next(false);
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

}
