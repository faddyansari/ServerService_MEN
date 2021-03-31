import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CRMService } from '../../../../services/crmService';
import { AuthService } from '../../../../services/AuthenticationService';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-conversation-details',
  templateUrl: './conversation-details.component.html',
  styleUrls: ['./conversation-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationDetailsComponent implements OnInit {

  MessageList: Array<any> = []
  Conversation: any;
  subscriptions: Subscription[] = [];
  scrollHeight = 0;
  loading = false;
  selectedCustomer: any;
  agent: any;
  
  constructor(private _crmService: CRMService,private _authService: AuthService) {
    // console.log('Archives Loaded');
    this.subscriptions.push(_crmService.getLoadingVariable().subscribe(data => {
      this.loading = data;
    }));

    this.subscriptions.push(_crmService.getSelectedCustomer().subscribe(customer => {
      
      this.selectedCustomer = customer;
    }));


    this.subscriptions.push(_crmService.getCurrentConversation().subscribe(conversation => {
      console.log(conversation);
      
      this.Conversation = conversation;
      this.MessageList = conversation.msgList;
    }));

    this.subscriptions.push(this._authService.Agent.subscribe(data => {
      this.agent = data;
    }));

    // this.subscriptions.push(_crmService.getConversationsList(this.selectedCustomer.deviceID).subscribe(conversations => {
    //   this.conversationList = conversations;
    // }));

  }


  ngOnInit() {
  }

  toggleChat() {
    this._crmService.viewingConversation.next(false);
  }
}
