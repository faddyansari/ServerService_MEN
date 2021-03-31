import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PostmessageService {

  private NSP = '';


  public NegotiateReadyEvent: Subject<any> = new Subject();
  public HelpReadyToGiveSession: Subject<any> = new Subject();
  public startSupportChat: Subject<any> = new Subject();
  public msgNotification: BehaviorSubject<number> = new BehaviorSubject(0);

  public popupBlockContent = "Popup Blocked. Please Follow the Link : 'https://support.google.com/chrome/answer/95472?co=GENIE.Platform%3DDesktop&hl=en' to Enable Popup Window";

  private payload: any;

  constructor() {
    //console.log('PostMessage Service Initialized');
    window.addEventListener('message', (e) => {
      this.MessageRecieved(e);
    });
  }

  private MessageRecieved(event: MessageEvent) {
    //console.log(event.data);
    if (!event.data.msg) {

      // console.log('Missing Msg Property');
      return;
    }
    switch (event.data.msg) {
      case 'popUpBlocked':
        window.alert(this.popupBlockContent)
        break;

      case 'helpLoadingInitiated':
       // console.log("helpLoadingInitiated")
        this.HelpReadyToGiveSession.next(true);
        break;

      case 'HelpIsLoaded':
      
        this.NegotiateReadyEvent.next(true);
        break;

      case "helpClose":
        break;

      case "MessageNotification":
      
        this.msgNotification.next(event.data.payload);
        break;

      case "HideNotification":
        this.msgNotification.next(0);
        break;

      case "InitiateChatSupport":
        this.startSupportChat.next(true);
        break;


      default:
        
        throw new Error('Invalid Message Please Check Your Message');
    }
  }

}
