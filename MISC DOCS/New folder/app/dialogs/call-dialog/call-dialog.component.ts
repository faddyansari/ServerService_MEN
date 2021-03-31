import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallingService } from '../../../services/CallingService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../SnackBar-Dialog/toast-notifications.component';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-call-dialog',
	templateUrl: './call-dialog.component.html',
	styleUrls: ['./call-dialog.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class CallDialogComponent implements OnInit {

	@ViewChild('self_audio') self_audio: ElementRef;
	@ViewChild('remote_audio') remote_audio: ElementRef;

	public user: any;
	public selectedAgent: any;
	public subscriptions: Subscription[] = [];

	callConnect = false;
	callAccepted = false;
	callRejected = false;
	callSelfEnded = false;
	callStart = false;
	callEnd = false;
	callTime: number = 0;
	alreadyOnCall = false;
	micEnabled = true;
	audioEnabled = true;
	callerTune: any;
	callerTuneEnd: any;
	// timeOutId : any = '';
	seconds: number = 0;
	minutes: number = 0;

	//Retry Timer
	count: number = 3;
	showRetry: boolean = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _callingService: CallingService, private snackBar: MatSnackBar, private _router: ActivatedRoute) {
		//console.log(data);
		this.user = data;
		this._callingService.createOffer(this.user.type == 'Visitors' ? this.user.id || this.user._id : this.user.email);
		// this.subscriptions.push(this._router.params.subscribe(params => {
		// 	if (params.data) {
		// 		this.agent = params.data;
		// 	}
		// }));

		this.subscriptions.push(this._callingService.callAccepted.subscribe(data => {
			this.callAccepted = data;
			// this.timer();
		}));
		this.subscriptions.push(this._callingService.callRejected.subscribe(data => {
			// clearInterval(this.timeOutId);
			this.callRejected = data;
		}));
		this.subscriptions.push(this._callingService.callSelfEnded.subscribe(data => {
			this.callSelfEnded = data;
			// clearInterval(this.timeOutId);
		}));
		this.subscriptions.push(this._callingService.callConnect.subscribe(data => {
			this.callConnect = data;
		}));
		this.subscriptions.push(this._callingService.callStart.subscribe(data => {
			this.callStart = data;
		}));
		this.subscriptions.push(this._callingService.callEnd.subscribe(data => {
			// clearInterval(this.timeOutId);
			this.callEnd = data;
		}));
		this.subscriptions.push(this._callingService.micEnabled.subscribe(data => {
			this.micEnabled = data;
		}));
		this.subscriptions.push(this._callingService.audioEnabled.subscribe(data => {
			this.audioEnabled = data;
		}));

		this.subscriptions.push(this._callingService.seconds.subscribe(data => {
			this.seconds = data;
		}));
		this.subscriptions.push(this._callingService.minutes.subscribe(data => {
			this.minutes = data;
		}));
		this.subscriptions.push(this._callingService.count.subscribe(data => {
			this.count = data;
		}));
		this.subscriptions.push(this._callingService.showRetry.subscribe(data => {
			this.showRetry = data;
		}));
		this.subscriptions.push(this._callingService.callerTune.subscribe(data => {
			this.callerTune = data;
		}));
		this.subscriptions.push(this._callingService.callerTuneEnd.subscribe(data => {
			this.callerTuneEnd = data;
		}));


	}

	ngOnInit() {
		(this.self_audio.nativeElement as HTMLAudioElement).muted = true;
		this.subscriptions.push(this._callingService.localStream.subscribe(stream => {
			if (stream) {
				console.log('Self Stream');

				//console.log(stream.getAudioTracks());

				(this.self_audio.nativeElement as HTMLAudioElement).srcObject = stream;
			}

		}));
		this.subscriptions.push(this._callingService.remoteStream.subscribe(stream => {


			if (stream) {
				console.log('Remote Stream');

				//(stream.getAudioTracks());
				(this.remote_audio.nativeElement as HTMLAudioElement).srcObject = stream;
			}
		}));
	}


	ngAfterViewInit() {

	}

	ngOnDestroy() {
		this.subscriptions.map(subscription => {
			subscription.unsubscribe();
		});

	}

	endCall() {
		// clearInterval(this.timeOutId);
		if (this.callConnect) {
			this._callingService.Self_End(this.user.email);
		} else {
			this._callingService.EndCall();
		}
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'ok',
				msg: 'Call ended' + this._callingService.getDurationinWords(this.minutes, this.seconds)
			},
			duration: 3000,
			panelClass: ['user-alert', 'success']
		});
	}
	reCall() {
		this._callingService.createOffer(this.user.type == 'Visitors' ? this.user.id || this.user._id : this.user.email);
	}

	ToggleMic() {
		this._callingService.ToggleMic();
	}

	ToggleAudio() {
		this._callingService.ToggleAudio();
	}

	showEvents() {
		this._callingService.showEvents();
	}

}
