import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CallingService } from '../../../services/CallingService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';

@Component({
  selector: 'app-reciever-call-dialog',
  templateUrl: './reciever-call-dialog.component.html',
  styleUrls: ['./reciever-call-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecieverCallDialogComponent implements OnInit {

  public agent_email: any;
  public agent_username: any;
  public subscriptions: Subscription[] = [];

  @ViewChild('self_audio') self_audio: ElementRef;
  @ViewChild('remote_audio') remote_audio: ElementRef;

  callAccepted = false;
  callRejected = false;
  callSelfEnded = false;
  callStart = false;
  callEnd = false;
  callTime: number = 0;
  micEnabled = true;
  audioEnabled = true;
  callerTune: any;


  seconds: number = 0;
  minutes: number = 0;

  constructor(private _callingService: CallingService, private snackBar: MatSnackBar) {
    this._callingService.remote_sender.subscribe(data => {
      this.agent_email = data;
    });
    this._callingService.remote_username.subscribe(data => {
      this.agent_username = data;
    });
    this._callingService.callAccepted.subscribe(data => {
      this.callAccepted = data;
    });
    this._callingService.callRejected.subscribe(data => {
      this.callRejected = data;
    });
    this._callingService.callSelfEnded.subscribe(data => {
      this.callSelfEnded = data;
    });
    this._callingService.callStart.subscribe(data => {
      this.callStart = data;
    });
    this._callingService.callEnd.subscribe(data => {
      this.callEnd = data;
    });
    this._callingService.seconds.subscribe(data => {
      this.seconds = data;
    })
    this._callingService.minutes.subscribe(data => {
      this.minutes = data;
    });
    this._callingService.micEnabled.subscribe(data => {
      this.micEnabled = data;
    });
    this._callingService.audioEnabled.subscribe(data => {
      this.audioEnabled = data;
    });
    this._callingService.callerTune.subscribe(data => {
      this.callerTune = data;
    });

  }

  ngOnInit() {

    (this.self_audio.nativeElement as HTMLAudioElement).muted = true;
    this.subscriptions.push(this._callingService.localStream.subscribe(stream => {
      if (stream) {
        if (this.self_audio.nativeElement) {
          (this.self_audio.nativeElement as HTMLAudioElement).srcObject = stream;
        }

      }

    }));
    this.subscriptions.push(this._callingService.remoteStream.subscribe(stream => {
      if (stream) {
        if (this.remote_audio.nativeElement) {
          (this.remote_audio.nativeElement as HTMLAudioElement).srcObject = stream;
        }

      }

    }))
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.map(subscription => {
      subscription.unsubscribe();
    });
  }

  acceptCall() {
    //console.log('Call Accepted!');
    this._callingService.AcceptCall(this.agent_email);
  }

  rejectCall() {
    this._callingService.RejectCall(this.agent_email);
  }
  endCall() {
    this._callingService.Self_End(this.agent_email);
    this.snackBar.openFromComponent(ToastNotifications, {
      data: {
        img: 'ok',
        msg: 'Call ended' + this._callingService.getDurationinWords(this.minutes, this.seconds)
      },
      duration: 3000,
      panelClass: ['user-alert', 'success']
    });
  }

  ToggleMic() {
    this._callingService.ToggleMic();
  }

  ToggleAudio() {
    this._callingService.ToggleAudio();
  }

}
