import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../../../../services/ChatService';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-list-inbox',
  templateUrl: './chat-list-inbox.component.html',
  styleUrls: ['./chat-list-inbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatListInboxComponent implements OnInit, OnDestroy {

  @Input() searchValue: string;

  subscriptions: Subscription[] = [];
  chatList = [];
  selectedConversation: any = {};
  scrollHeight = 0;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  loadingMorechats: any;

  constructor(private _chatService: ChatService) {

    this.subscriptions.push(this._chatService.AllConversations.subscribe(data => {
      this.chatList = data;


    }));

    this.subscriptions.push(_chatService.getLoading('MOREINBOXCHATS').subscribe(data => {
      this.loadingMorechats = data;
    }));

    this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(conversation => {
      this.selectedConversation = conversation;



      //conversation.messages[conversation.messages.length -1]
    }));


  }

  ngOnInit() {
  }

  CheckAttachmentType(data) {
    return (typeof data === 'string');
  }

  ngOnDestroy() {

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
  }

  ScrollChanged(event: UIEvent) {
    if (Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
      this._chatService.getMoreArchivesInboxChats();
    }
    this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.loadingMorechats) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
      // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
    }
  }

}
