import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { CRMService } from '../../../../services/crmService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConversationListComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  conversationList: Array<any> = []
  selectedConversation: any;
  subscriptions: Subscription[] = [];
  scrollHeight = 0;
  loading = false;
  selectedCustomer: any;
  ifMoreRecentChats: boolean = true;

  constructor(private _crmService: CRMService) {
    this.subscriptions.push(_crmService.getLoadingVariable().subscribe(data => {
      this.loading = data;
    }));

    this.subscriptions.push(_crmService.getSelectedCustomer().subscribe(customer => {
      this.selectedCustomer = customer;
      this.conversationList = this.selectedCustomer.conversations;
    }));


    this.subscriptions.push(_crmService.getCurrentConversation().subscribe(conversation => {
      this.selectedConversation = conversation;
    }));

    this.subscriptions.push(_crmService.ifMoreRecentChats.subscribe(more => {
      this.ifMoreRecentChats = more;
    }));
    // this.subscriptions.push(_crmService.getConversationsList(this.selectedCustomer.deviceID).subscribe(conversations => {
    //   this.conversationList = conversations;
    // }));

  }

  ngOnInit() {
  }

  ScrollChanged($event: UIEvent) {
    if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
      this._crmService.getMoreConversationsFromBackend(this.selectedCustomer.deviceID, this.selectedCustomer.conversations[this.selectedCustomer.conversations.length - 1]._id);
    }
    this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;

  }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.loading) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
    }
  }

  // GetMessages(id){
  //   this.conversationList
  // }

}
