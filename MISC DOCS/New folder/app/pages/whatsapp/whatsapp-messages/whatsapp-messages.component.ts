import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-whatsapp-messages',
  templateUrl: './whatsapp-messages.component.html',
  styleUrls: ['./whatsapp-messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhatsappMessagesComponent implements OnInit {

  @ViewChild('scrollContainer') ScrollContainer: ElementRef;


  _messages = [];
  _tempMessages = [];
  _contactID = '';
  @Input() agentEmail = '';
  @Input() customerName = '';
  @Input() customerNo = '';
  @Input() autoscroll = true;
  @Output() GetMoreMessages = new EventEmitter();
  @Output() UnsetReadCount = new EventEmitter();
  @Output() ReSendMessage = new EventEmitter();
  @Output() _CancelUpload = new EventEmitter();
  @Output() __ResendAttachment = new EventEmitter();

  @Input('contacatID') set contacatID(value: any) {
    if (this._contactID != value) {
      this.autoscroll = true;
      this._contactID = value;
      this.UnsetReadCount.emit({ unset: true });
    }
  }
  @Input('messages') set messages(value: any) {
    // console.log('Value Recieved ', value);
    this._messages = value
    if (value && value.length && value[value.length - 1].autoScroll) this.autoscroll = true;
    setTimeout(() => {
      if (this.autoscroll) {
        this.scrollToBottom();
      }
      if (this.scrollTop == 0) {
        this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
      }
    }, 300);
  }

  @Input('tempMessages') set tempMessages(value: any) {
    // value.map(msg => {
    //   if (msg.attachment && !msg.errored && !msg._id && msg.uploading) {
    //     console.log('Temp Message Recieved ', msg);
    //     /**
    //      * @process
    //      * 1. Upload File
    //      * 2. Send To Server
    //      */
    //   }
    // })
    this._tempMessages = value;
    setTimeout(() => {
      if (this.autoscroll) {
        this.scrollToBottom();
      }
      if (this.scrollTop == 0) {
        this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
      }
    }, 300);
  }




  @HostListener('click', ['$event'])
  onBlur(event: any): void {
    // Do something
    this.UnsetReadCount.emit({ unset: true });
  }

  subscriptions: Subscription[] = [];
  LoadMore: Subject<any> = new Subject();
  ReSendEvent: Subject<any> = new Subject();

  scrollTop = 0;
  scrollHeight = 0;

  constructor() {

    this.subscriptions.push(this.LoadMore.debounceTime(1000).subscribe(data => {
      this.GetMoreMessages.emit(data);
    }));

    this.subscriptions.push(this.ReSendEvent.debounceTime(2000).subscribe(data => {
      this.ReSendMessage.emit(data);
    }));

  }

  ngOnInit() {
    // console.log('Agent Email', this.agentEmail);
  }


  ScrollChanged(event: UIEvent) {
    if (!this.ScrollContainer || !this.ScrollContainer.nativeElement) return;
    let movedTop = (Math.round((event.target as HTMLElement).scrollTop) < this.scrollTop);
    if (!movedTop && Math.round((event.target as HTMLElement).scrollTop + (event.target as HTMLElement).clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight - 10) {
      this.autoscroll = true;
    }

    if (movedTop && (Math.round((event.target as HTMLElement).scrollTop) <= this.ScrollContainer.nativeElement.scrollHeight - 10)) {
      this.autoscroll = false;
    }

    if (movedTop && (Math.round((event.target as HTMLElement).scrollTop) <= 0)) {

      if (this._messages.length) this.LoadMore.next({ lastMessageID: this._messages[0].timestamp });

    }
    this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
    this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
  }

  private scrollToBottom(): void {
    if (this.autoscroll != true) {
      return
    }
    try {
      setTimeout(() => {
        this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
      }, 300);
    } catch (err) { }
  }

  ResolveMessages() {
    if (this._tempMessages.length) return ([...this._messages, ...this._tempMessages]);
    else return this._messages;
  }

  Resend(msg) {
    delete msg.autoScroll;
    msg.status = 'sending';
    this.ReSendEvent.next(msg);

  }

  CancelUpload(sentTime) {
    // console.log('Cancel Upload Message OCmponent');
    this._CancelUpload.emit(sentTime)
  }

  _Resent(errorType, msg) {
    // console.log('Resent')
    this.__ResendAttachment.emit({ errorType: errorType, msg: msg });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => { subscription.unsubscribe(); });
  }

  ngAfterViewInit() {

    this.scrollToBottom();

  }


}
