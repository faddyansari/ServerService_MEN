import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../services/AuthenticationService';
import { Contactservice } from '../../../../services/ContactService';

@Component({
  selector: 'app-contacts-nav',
  templateUrl: './contacts-nav.component.html',
  styleUrls: ['./contacts-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsNavComponent implements OnInit {

  public agent: any;
  sortBy = 'ALL';
  public onlineCount: any;
  public offlineCount: any;
  showContacts = true;
  showConversations = false;
  contactList = [];
  conversationList = [];
  public subscriptions: Subscription[] = [];
  
  constructor(
    private _contactService: Contactservice,
    private _authService: AuthService
  ) { 
    this.subscriptions.push(_authService.getAgent().subscribe(data => {
      this.agent = data;
    }));
    this.subscriptions.push(_contactService.contactsCount.subscribe(list => {
      this.contactList = list;
      this.onlineCount = this.contactList.filter(data => data.status == true).length;
      this.offlineCount = this.contactList.filter(data => data.status == false).length;
    }));
    this.subscriptions.push(_contactService.conversationList.subscribe(data => {
      this.conversationList = data.filter(a => a.messages.length);
    }));
    this.subscriptions.push(_contactService.sortBy.subscribe(data => {
      this.sortBy = data;
    }));
    this.subscriptions.push(_contactService.showContacts.subscribe(data => {
      this.showContacts = data;
    }));
    this.subscriptions.push(_contactService.showConversations.subscribe(data => {
      this.showConversations = data;
    }));
  }

  ngOnInit() {
  }


  setFilter(filter: string) {
    this._contactService.showContacts.next(true);
    this._contactService.showConversations.next(false);
    this._contactService.selectedThread.next(undefined);
    this._contactService.sortBy.next(filter);
    this._contactService.RetrieveContacts('0',filter);
  }

  displayConversations(){
    this._contactService.showContacts.next(false);
    this._contactService.showConversations.next(true);
    // this._contactService.selectedThread.next({});
    this._contactService.sortBy.next('');
  }

}
