import { Injectable } from '@angular/core';

//RxJs Imsports
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//End RxJs Imports

//Services
import { SocketService } from "../services/SocketService";
import { AuthService } from './AuthenticationService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastNotifications } from '../app/dialogs/SnackBar-Dialog/toast-notifications.component';
import { PushNotificationsService } from './NotificationService';

@Injectable()

export class CallingService {

    private callRecieved: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private SelfAgent: any;
    //Version2 Work
    private rtcPeerConnection;
    remoteStream: BehaviorSubject<MediaStream> = new BehaviorSubject(undefined);
    localStream: BehaviorSubject<MediaStream> = new BehaviorSubject(undefined);
    remote_sender: BehaviorSubject<string> = new BehaviorSubject('');
    remote_username: BehaviorSubject<string> = new BehaviorSubject('');
    listAudioEvents = [];
    selectedAgent: BehaviorSubject<any> = new BehaviorSubject('');
    public socket: SocketIOClient.Socket;
    private config = undefined;
    timeoutID: BehaviorSubject<any> = new BehaviorSubject(undefined);
    noAnswerTimeout: BehaviorSubject<any> = new BehaviorSubject(undefined);
    minutes: BehaviorSubject<number> = new BehaviorSubject(0);
    seconds: BehaviorSubject<number> = new BehaviorSubject(0);
    isRemoteSession = false;

    //Retry Call
    count: BehaviorSubject<number> = new BehaviorSubject(5);
    showRetry: BehaviorSubject<boolean> = new BehaviorSubject(false);
    retryInterval_ID: BehaviorSubject<any> = new BehaviorSubject(undefined);

    //Call Event Behaviors
    callConnect: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callAccepted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callRejected: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callSelfEnded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callStart: BehaviorSubject<boolean> = new BehaviorSubject(false);
    callEnd: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //Caller Tune
    callerTune: BehaviorSubject<any> = new BehaviorSubject({
        src: '../assets/sounds/simple_cool_tone.mp3',
        state: false
    });
    callerTuneEnd: BehaviorSubject<any> = new BehaviorSubject({
        src: '../assets/sounds/beep_mp3.mp3'
    });

    //Call Behaviors
    micEnabled: BehaviorSubject<boolean> = new BehaviorSubject(true);
    audioEnabled: BehaviorSubject<boolean> = new BehaviorSubject(true);

    //Call Record

    //Candidate
    localCandidates = [];
    remoteCandidates = [];

    //Call Events Track
    callEventList = [];
    missedCallsLog = [];
    callLogs = [];

    constructor(private _socket: SocketService, private _authService: AuthService, private snackBar: MatSnackBar, private _browserNotifs: PushNotificationsService, private dialog: MatDialog) {
        // console.log('Calling Service Contructor');
        this._socket.getSocket().subscribe((data) => {
            if (data) {
                this.socket = data;
                //Socket Events
                this.getICEServers();
                this.socket.on('answerOffer', (data) => {

                    // console.log(this.rtcPeerConnection);

                    this.remote_sender.next(data.sender);
                    this.remote_username.next(data.name);
                    //Calling Behaviours
                    this.CallerTune(true);
                    this.callAccepted.next(false);
                    this.callStart.next(true);
                    this.callRejected.next(false);
                    this.callSelfEnded.next(false);
                    this.callEnd.next(false);
                    this.seconds.next(0);
                    this.minutes.next(0);
                    //Answer Offer
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
                        if (stream) {
                            this.addLocalStream(stream);
                        }
                        this.createPeerConnection();
                        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
                        this.rtcPeerConnection.createAnswer()
                            .then(desc => this.rtcPeerConnection.setLocalDescription(desc))
                            .catch(e => console.log(e));

                        this.callRecieved.next(true);
                    }).catch((err) => {
                        this.Self_End(data.sender, 'User does not have mic enabled!');
                        alert(data.sender + ' called you, please enable your mic to allow calls.');
                        // console.log('An error ocurred when accessing media devices');
                        // console.log(err);
                    });

                });

                this.socket.on('missedCall', (data) => {
                    this._browserNotifs.generateNotification([{
                        'title': 'Missed Call!',
                        'alertContent': data.sender + ' called you while you were busy..',
                        'icon': "../assets/img/favicon.ico",
                        'tag': 1
                    }]);
                    // alert('User is already on call please wait...');
                    // console.log('User is already on call please wait...');
                });


                this.socket.on('closeAllDialogs', (data) => {
                    this.dialog.closeAll();
                    this.CallerTune(false);
                })

                this.socket.on('acceptCall', (data) => {
                    //Calling Behaviours
                    this.callAccepted.next(true);
                    this.callStart.next(false);
                    this.callRejected.next(false);
                    this.callSelfEnded.next(false);
                    this.callEnd.next(false);
                    this.CallerTune(false);
                    this.startCallTimer();
                    this.localCandidates.map(event => {
                        console.log('Sending Candidates now to: ' + data.sender);
                        // console.log(event.candidate);
                        this.socket.emit('candidate', {
                            target: data.sender,
                            type: 'candidate',
                            label: event.candidate.sdpMLineIndex,
                            id: event.candidate.sdpMid,
                            candidate: event.candidate
                        });
                    })
                    this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
                        // console.log('Target:');
                        // console.log(data.sender);
                        this.remoteCandidates.map(candidate => {
                            // console.log('Remote Candidates: ');
                            // console.log(candidate);
                            this.rtcPeerConnection.addIceCandidate(candidate);
                        });
                        this.isRemoteSession = true;
                    });
                    // console.log(this.rtcPeerConnection);
                })

                this.socket.on('rejectCall', (data) => {
                    //Calling Behaviours
                    this.callAccepted.next(false);
                    this.callStart.next(false);
                    this.callRejected.next(true);
                    this.callSelfEnded.next(false);
                    this.callEnd.next(false);
                    this.CallerTune(false);
                    console.log('Call rejected by the remote agent');
                    this.EndCall(true);
                    this.startCallRetryTimer();
                });

                this.socket.on('disconnectCall', (data) => {
                    //    this.Self_End(this.)
                    this.EndCall();
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Call disconnected!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                });
                this.socket.on('selfEnd', (data) => {
                    //Calling Behaviours
                    console.log('Remote Agent Ended Call!');
                    this.callAccepted.next(false);
                    this.callStart.next(false);
                    if (!this.callEnd.getValue()) {
                        this.snackBar.openFromComponent(ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Call ended' + this.getDurationinWords(this.minutes.getValue(), this.seconds.getValue())
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    this.callRejected.next(false);
                    this.callSelfEnded.next(true);
                    this.callEnd.next(false);
                    clearInterval(this.timeoutID.getValue());
                    console.log('The remote agent ended the call');
                    this.EndCall();
                });

                this.socket.on('candidate', (event) => {

                    console.log('Candidate Recieved!');
                    // console.log(event);
                    // console.log(this.rtcPeerConnection.remoteDescription);

                    var candidate = new RTCIceCandidate(event.candidate);
                    if (this.rtcPeerConnection && this.rtcPeerConnection.remoteDescription) {
                        this.rtcPeerConnection.addIceCandidate(candidate);
                    } else {
                        this.remoteCandidates.push(candidate);
                    }

                });
            }

        });

        this._authService.getAgent().subscribe(agent => {
            this.SelfAgent = agent;
        });


    }

    public getICEServers() {
        this.socket.emit('getICEServers', {}, (response) => {
            // console.log('Ice Servers',response)
            if (response.servers) {
                this.config = response.servers;
            }

        });
    }

    public CallRecieved(): Observable<boolean> {
        return this.callRecieved.asObservable();
    }

    //Version 2 Work
    onIceCandidate(event) {
        if (event.candidate) {
            this.localCandidates.push(event);
            // this.socket.emit('candidate', {
            //     target: this.selectedAgent.getValue() ? this.selectedAgent.getValue() : this.remote_sender.getValue(),
            //     type: 'candidate',
            //     label: event.candidate.sdpMLineIndex,
            //     id: event.candidate.sdpMid,
            //     candidate: event.candidate
            // });
        }
    }

    onAddStream(event) {
        // remoteVideo.src = URL.createObjectURL(event.stream);
        this.callEventList.push('Got Remote Stream!');
        this.remoteStream.next(event.stream);
        if (this.remoteStream.getValue().getAudioTracks().length > 0) {
            this.addAudioEvent('Remote user is sending Audio');
        } else {
            this.addAudioEvent('Remote user is not sending Audio');
        }
        // console.log(this.listAudioEvents);
    }
    createPeerConnection() {
        this.rtcPeerConnection = new RTCPeerConnection(this.config);
        this.rtcPeerConnection.onicecandidate = (e) => { this.onIceCandidate(e) };
        this.rtcPeerConnection.onaddstream = (e) => { this.onAddStream(e) };
        this.rtcPeerConnection.onconnectionstatechange = (e) => { this.RTCConnectionStateHandler(e); }
        this.rtcPeerConnection.oniceconnectionstatechange = (e) => { this.ICEConnectionStateHandler(e); }
        this.rtcPeerConnection.onsignalingstatechange = (e) => { this.RTCSignalingStateHandler(e); }
        this.rtcPeerConnection.addStream(this.localStream.getValue());
    }

    RTCConnectionStateHandler(event) {
        switch (this.rtcPeerConnection.connectionState) {
            case "connected":
                console.log('WebRTC Call Connected!');
                this.callEventList.push('Call Connected!');
                // The connection has become fully connected
                break;
            case "disconnected":
                console.log('WebRTC Call disconnected!');
                this.callEventList.push('Call Disconnected!');
                break;
            case "failed":
                console.log('WebRTC Call failed!');
                this.callEventList.push('Call Failed!');
                // One or more transports has terminated unexpectedly or in an error
                break;
            case "closed":
                console.log('WebRTC Connection closed!');
                this.callEventList.push('Call Closed!');
                // The connection has been closed
                break;
        }
    }
    ICEConnectionStateHandler(event) {
        switch (this.rtcPeerConnection.iceConnectionState) {
            case "new":
                console.log('WebRTC ICE candidate new!');
                this.callEventList.push('ICE Candidate connectionState new!');
                break;
            case "checking":
                console.log('WebRTC ICE candidate checking!');
                this.callEventList.push('ICE Candidate connectionState checking!');
                break;
            case "connected":
                console.log('WebRTC ICE candidate connected!');
                this.callEventList.push('ICE Candidate connectionState connected!');
                break;
            case "completed":
                console.log('WebRTC ICE candidate completed!');
                this.callEventList.push('ICE Candidate connectionState completed!');
                break;
            case "disconnected":
                console.log('WebRTC ICE candidate disconnected!');
                this.callEventList.push('ICE Candidate connectionState dicconnected!');
                break;
            case "failed":
                console.log('WebRTC ICE candidate failed!');
                this.callEventList.push('ICE Candidate connectionState failed!');
                break;
            case "closed":
                console.log('WebRTC ICE candidate closed!');
                this.callEventList.push('ICE Candidate connectionState closed!');
                break;
        }
    }

    RTCSignalingStateHandler(event) {
        switch (this.rtcPeerConnection.signalingState) {
            case "stable":
                console.log('WebRTC signaling state stable');
                this.callEventList.push('WebRTC signaling state stable');
                break;
            case "have-local-offer":
                console.log('WebRTC signaling state have-local-offer');
                this.callEventList.push('WebRTC signaling state have-local-offer');
                break;
            case "have-remote-offer":
                console.log('WebRTC signaling state have-remote-offer');
                this.callEventList.push('WebRTC signaling state have-remote-offer');
                break;
            case "have-local-pranswer":
                console.log('WebRTC signaling state have-local-pranswer');
                this.callEventList.push('WebRTC signaling state have-local-pranswer');
                break;
            case "have-remote-pranswer":
                console.log('WebRTC signaling state have-remote-pranswer');
                this.callEventList.push('WebRTC signaling state have-remote-pranswer');
                break;
        }
    }

    addAudioEvent(event) {
        this.listAudioEvents.push(event);
    }

    addLocalStream(stream) {
        this.localStream.next(stream);
    }

    setLocalAndOffer(sessionDescription, target) {
        this.rtcPeerConnection.setLocalDescription(sessionDescription);
        this.callEventList.push('Local Description Set!');
        // this.localCandidates = [];
        console.log('Create Offer!');
        // console.log(this.selectedAgent.getValue());
        this.socket.emit('createOffer', {
            sender: this.SelfAgent.email,
            reciever: target,
            type: 'offer',
            sdp: sessionDescription
        }, (response) => {
            if (response && response.recieverStatus) {
                if (response.callStatus) {
                    this.EndCall();
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'User is already on call please wait..'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                } else {
                    console.log('CALL CONNECTED!');
                    this.callConnect.next(true);
                    this.CallerTune(true);
                    this.callAccepted.next(false);
                    this.callStart.next(true);
                    this.callRejected.next(false);
                    this.callSelfEnded.next(false);
                    this.callEnd.next(false);
                    this.seconds.next(0);
                    this.minutes.next(0);
                }
            } else {
                // this.EndCall();
                // this.snackBar.openFromComponent(ToastNotifications, {
                //     data: {
                //         img: 'warning',
                //         msg: 'Could not connect call. Please try again...'
                //     },
                //     duration: 3000,
                //     panelClass: ['user-alert', 'error']
                // });
            }
        });
    }
    setLocalAndAnswer(sessionDescription) {
        this.rtcPeerConnection.setLocalDescription(sessionDescription);
    }
    createOffer(target) {
        //Calling Behaviours
        this.ResetCallingEvents();
        this.callEventList = [];
        //Create Offer
        // this.callConnect.next(true);
        this.selectedAgent.next(target);
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            if (stream) {
                this.addLocalStream(stream);
            }
            // console.log(stream);
            // console.log(this.rtcPeerConnection);
            this.createPeerConnection();

            let offerOptions = {
                offerToReceiveAudio: 1
            }

            this.rtcPeerConnection.createOffer(offerOptions)
                .then(desc => this.setLocalAndOffer(desc, target))
                .catch(e => console.log(e));
        }).catch((err) => {
            alert('An error ocurred when accessing media devices, please enable your mic.');
            this.Self_End(target);
            // console.log('An error ocurred when accessing media devices');
            // console.log(err);
        });
        console.log('No Answer timeout started');
        this.noAnswerTimeout.next(
            setTimeout(() => {
                if (!this.callAccepted.getValue()) {
                    this.Self_End(this.selectedAgent.getValue());
                    this.snackBar.openFromComponent(ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'No answer. Please try again...'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                }
                clearTimeout(this.noAnswerTimeout.getValue());
            }, 60000)
        );
    }
    //Version 2 work end

    AcceptCall(remote_agent) {
        this.callAccepted.next(true);
        this.callStart.next(false);
        this.callRejected.next(false);
        this.callSelfEnded.next(false);
        this.callEnd.next(false);
        this.startCallTimer();
        this.socket.emit('acceptCall', {
            sender: this.SelfAgent.email,
            target: remote_agent,
            sdp: this.rtcPeerConnection.localDescription,
            type: 'answer'
        }, (response) => {

        });
        this.localCandidates.map(event => {
            console.log('Sending Candidates now to: ' + remote_agent);
            // console.log(event.candidate);
            this.socket.emit('candidate', {
                target: remote_agent,
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate
            });
        })
        this.remoteCandidates.map(candidate => {
            // console.log('Remote Candidates: ');
            // console.log(candidate);
            this.rtcPeerConnection.addIceCandidate(candidate);
        });
    }

    RejectCall(remote_agent) {
        this.callAccepted.next(false);
        this.callStart.next(false);
        this.callRejected.next(true);
        this.callSelfEnded.next(false);
        this.callEnd.next(false);
        this.EndCall(true);
        this.socket.emit('rejectCall', {
            sender: this.SelfAgent.email,
            target: remote_agent,
            type: 'reject'
        });
    }

    Self_End(remote_agent, error?) {
        this.callAccepted.next(false);
        this.callStart.next(false);
        this.callRejected.next(false);
        this.callSelfEnded.next(true);
        this.callEnd.next(false);
        clearInterval(this.timeoutID.getValue());
        clearTimeout(this.noAnswerTimeout.getValue());
        this.socket.emit('selfEnd', {
            sender: this.SelfAgent.email,
            target: remote_agent,
            type: 'reject',
            error: error ? error : ''
        });
        this.clearWebRTC();
        // this.EndCall();

    }

    EndCall(rejected = false) {
        console.log('Call Ended!');
        this.callAccepted.next(false);
        this.callStart.next(false);
        this.callSelfEnded.next(false);
        clearInterval(this.timeoutID.getValue());
        clearInterval(this.retryInterval_ID.getValue());
        clearTimeout(this.noAnswerTimeout.getValue());
        if (rejected) {
            this.callRejected.next(true);
            this.callEnd.next(false);
        } else {
            this.callRejected.next(false);
            this.callEnd.next(true);
        }
        this.clearWebRTC();
        this.CallerTune(false);
    }

    clearWebRTC() {
        //End Connection
        if (this.rtcPeerConnection) {
            this.rtcPeerConnection.ontrack = null;
            this.rtcPeerConnection.removeTrack = null;
            this.rtcPeerConnection.onicecandidate = null;
            this.rtcPeerConnection.oniceconnectionstatechange = null;
            this.rtcPeerConnection.onsignalingstatechange = null;
            this.rtcPeerConnection.onicegatheringstatechange = null;
            this.rtcPeerConnection.onnegotiationneeded = null;
            this.rtcPeerConnection.close();
        }
        this.RemoveStreams();
        this.remoteCandidates = [];
        this.localCandidates = [];
        this.isRemoteSession = false;
        this.dialog.closeAll();
    }

    RemoveStreams() {
        if (this.localStream.getValue()) {
            let localTracks = this.localStream.getValue().getTracks();
            localTracks.forEach(function (track) {
                track.stop();
            });
        }
    }

    updateCallTimer() {
        this.seconds.next(this.seconds.getValue() + 1);
        if (this.seconds.getValue() == 60) {
            this.seconds.next(0);
            this.minutes.next(this.minutes.getValue() + 1);
        }
    }

    updateCallRetryTimer() {
        this.count.next(this.count.getValue() - 1);
        if (this.count.getValue() == 0) {
            this.showRetry.next(true);
            clearInterval(this.retryInterval_ID.getValue());
        }
    }

    startCallTimer() {
        this.timeoutID.next(setInterval(() => {
            this.updateCallTimer();
        }, 1000));
    }
    startCallRetryTimer() {
        this.count.next(5);
        this.showRetry.next(false);
        this.retryInterval_ID.next(setInterval(() => {
            this.updateCallRetryTimer();
        }, 1000));
    }

    ToggleMic() {
        this.micEnabled.next(!this.micEnabled.getValue());
        this.localStream.getValue().getAudioTracks()[0].enabled = this.micEnabled.getValue();
        this.localStream.next(this.localStream.getValue());
    }
    ToggleAudio() {
        this.audioEnabled.next(!this.audioEnabled.getValue());
        this.remoteStream.getValue().getAudioTracks()[0].enabled = this.audioEnabled.getValue();
        this.remoteStream.next(this.remoteStream.getValue());
    }

    CallerTune(state) {
        this.callerTune.getValue().state = state
    }

    showEvents() {
        console.log(this.callEventList);
    }

    getDurationinWords(minutes, seconds) {
        let msg = '';
        if (minutes) {
            if (minutes == 1) {
                if (seconds == 1) {
                    msg += minutes + ' minute and ' + seconds + ' second'
                } else {
                    msg += minutes + ' minute and ' + seconds + ' seconds'
                }
            } else {
                if (seconds == 1) {
                    msg += minutes + ' minutes and ' + seconds + ' second'
                } else {
                    msg += minutes + ' minutes and ' + seconds + ' seconds'
                }
            }
        } else if (seconds) {
            if (seconds == 1) {
                msg += seconds + ' second '
            } else {
                msg += seconds + ' seconds '
            }
        }
        if (minutes || seconds) {
            // console.log(minutes, seconds);

            return ' with duration ' + msg
        } else {
            return msg;
        }
    }

    ResetCallingEvents() {
        this.callConnect.next(false);
        this.callAccepted.next(false);
        this.callRejected.next(false);
        this.callSelfEnded.next(false);
        this.callStart.next(false);
        this.callEnd.next(false);
        this.seconds.next(0);
        this.minutes.next(0);
    }

    dummyCallNotif() {
        this.socket.emit('dummyCallNotif', {}, response => {

        });
    }
}