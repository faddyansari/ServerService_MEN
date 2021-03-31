"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallingService = void 0;
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var toast_notifications_component_1 = require("../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var CallingService = /** @class */ (function () {
    function CallingService(_socket, _authService, snackBar, _browserNotifs, dialog) {
        var _this = this;
        this._socket = _socket;
        this._authService = _authService;
        this.snackBar = snackBar;
        this._browserNotifs = _browserNotifs;
        this.dialog = dialog;
        this.callRecieved = new BehaviorSubject_1.BehaviorSubject(false);
        this.remoteStream = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.localStream = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.remote_sender = new BehaviorSubject_1.BehaviorSubject('');
        this.remote_username = new BehaviorSubject_1.BehaviorSubject('');
        this.listAudioEvents = [];
        this.selectedAgent = new BehaviorSubject_1.BehaviorSubject('');
        this.config = undefined;
        this.timeoutID = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.noAnswerTimeout = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.minutes = new BehaviorSubject_1.BehaviorSubject(0);
        this.seconds = new BehaviorSubject_1.BehaviorSubject(0);
        this.isRemoteSession = false;
        //Retry Call
        this.count = new BehaviorSubject_1.BehaviorSubject(5);
        this.showRetry = new BehaviorSubject_1.BehaviorSubject(false);
        this.retryInterval_ID = new BehaviorSubject_1.BehaviorSubject(undefined);
        //Call Event Behaviors
        this.callConnect = new BehaviorSubject_1.BehaviorSubject(false);
        this.callAccepted = new BehaviorSubject_1.BehaviorSubject(false);
        this.callRejected = new BehaviorSubject_1.BehaviorSubject(false);
        this.callSelfEnded = new BehaviorSubject_1.BehaviorSubject(false);
        this.callStart = new BehaviorSubject_1.BehaviorSubject(false);
        this.callEnd = new BehaviorSubject_1.BehaviorSubject(false);
        //Caller Tune
        this.callerTune = new BehaviorSubject_1.BehaviorSubject({
            src: '../assets/sounds/simple_cool_tone.mp3',
            state: false
        });
        this.callerTuneEnd = new BehaviorSubject_1.BehaviorSubject({
            src: '../assets/sounds/beep_mp3.mp3'
        });
        //Call Behaviors
        this.micEnabled = new BehaviorSubject_1.BehaviorSubject(true);
        this.audioEnabled = new BehaviorSubject_1.BehaviorSubject(true);
        //Call Record
        //Candidate
        this.localCandidates = [];
        this.remoteCandidates = [];
        //Call Events Track
        this.callEventList = [];
        this.missedCallsLog = [];
        this.callLogs = [];
        // console.log('Calling Service Contructor');
        this._socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                //Socket Events
                _this.getICEServers();
                _this.socket.on('answerOffer', function (data) {
                    // console.log(this.rtcPeerConnection);
                    _this.remote_sender.next(data.sender);
                    _this.remote_username.next(data.name);
                    //Calling Behaviours
                    _this.CallerTune(true);
                    _this.callAccepted.next(false);
                    _this.callStart.next(true);
                    _this.callRejected.next(false);
                    _this.callSelfEnded.next(false);
                    _this.callEnd.next(false);
                    _this.seconds.next(0);
                    _this.minutes.next(0);
                    //Answer Offer
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
                        if (stream) {
                            _this.addLocalStream(stream);
                        }
                        _this.createPeerConnection();
                        _this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
                        _this.rtcPeerConnection.createAnswer()
                            .then(function (desc) { return _this.rtcPeerConnection.setLocalDescription(desc); })
                            .catch(function (e) { return console.log(e); });
                        _this.callRecieved.next(true);
                    }).catch(function (err) {
                        _this.Self_End(data.sender, 'User does not have mic enabled!');
                        alert(data.sender + ' called you, please enable your mic to allow calls.');
                        // console.log('An error ocurred when accessing media devices');
                        // console.log(err);
                    });
                });
                _this.socket.on('missedCall', function (data) {
                    _this._browserNotifs.generateNotification([{
                            'title': 'Missed Call!',
                            'alertContent': data.sender + ' called you while you were busy..',
                            'icon': "../assets/img/favicon.ico",
                            'tag': 1
                        }]);
                    // alert('User is already on call please wait...');
                    // console.log('User is already on call please wait...');
                });
                _this.socket.on('closeAllDialogs', function (data) {
                    _this.dialog.closeAll();
                    _this.CallerTune(false);
                });
                _this.socket.on('acceptCall', function (data) {
                    //Calling Behaviours
                    _this.callAccepted.next(true);
                    _this.callStart.next(false);
                    _this.callRejected.next(false);
                    _this.callSelfEnded.next(false);
                    _this.callEnd.next(false);
                    _this.CallerTune(false);
                    _this.startCallTimer();
                    _this.localCandidates.map(function (event) {
                        console.log('Sending Candidates now to: ' + data.sender);
                        // console.log(event.candidate);
                        _this.socket.emit('candidate', {
                            target: data.sender,
                            type: 'candidate',
                            label: event.candidate.sdpMLineIndex,
                            id: event.candidate.sdpMid,
                            candidate: event.candidate
                        });
                    });
                    _this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(function () {
                        // console.log('Target:');
                        // console.log(data.sender);
                        _this.remoteCandidates.map(function (candidate) {
                            // console.log('Remote Candidates: ');
                            // console.log(candidate);
                            _this.rtcPeerConnection.addIceCandidate(candidate);
                        });
                        _this.isRemoteSession = true;
                    });
                    // console.log(this.rtcPeerConnection);
                });
                _this.socket.on('rejectCall', function (data) {
                    //Calling Behaviours
                    _this.callAccepted.next(false);
                    _this.callStart.next(false);
                    _this.callRejected.next(true);
                    _this.callSelfEnded.next(false);
                    _this.callEnd.next(false);
                    _this.CallerTune(false);
                    console.log('Call rejected by the remote agent');
                    _this.EndCall(true);
                    _this.startCallRetryTimer();
                });
                _this.socket.on('disconnectCall', function (data) {
                    //    this.Self_End(this.)
                    _this.EndCall();
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Call disconnected!'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                });
                _this.socket.on('selfEnd', function (data) {
                    //Calling Behaviours
                    console.log('Remote Agent Ended Call!');
                    _this.callAccepted.next(false);
                    _this.callStart.next(false);
                    if (!_this.callEnd.getValue()) {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Call ended' + _this.getDurationinWords(_this.minutes.getValue(), _this.seconds.getValue())
                            },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    _this.callRejected.next(false);
                    _this.callSelfEnded.next(true);
                    _this.callEnd.next(false);
                    clearInterval(_this.timeoutID.getValue());
                    console.log('The remote agent ended the call');
                    _this.EndCall();
                });
                _this.socket.on('candidate', function (event) {
                    console.log('Candidate Recieved!');
                    // console.log(event);
                    // console.log(this.rtcPeerConnection.remoteDescription);
                    var candidate = new RTCIceCandidate(event.candidate);
                    if (_this.rtcPeerConnection && _this.rtcPeerConnection.remoteDescription) {
                        _this.rtcPeerConnection.addIceCandidate(candidate);
                    }
                    else {
                        _this.remoteCandidates.push(candidate);
                    }
                });
            }
        });
        this._authService.getAgent().subscribe(function (agent) {
            _this.SelfAgent = agent;
        });
    }
    CallingService.prototype.getICEServers = function () {
        var _this = this;
        this.socket.emit('getICEServers', {}, function (response) {
            // console.log('Ice Servers',response)
            if (response.servers) {
                _this.config = response.servers;
            }
        });
    };
    CallingService.prototype.CallRecieved = function () {
        return this.callRecieved.asObservable();
    };
    //Version 2 Work
    CallingService.prototype.onIceCandidate = function (event) {
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
    };
    CallingService.prototype.onAddStream = function (event) {
        // remoteVideo.src = URL.createObjectURL(event.stream);
        this.callEventList.push('Got Remote Stream!');
        this.remoteStream.next(event.stream);
        if (this.remoteStream.getValue().getAudioTracks().length > 0) {
            this.addAudioEvent('Remote user is sending Audio');
        }
        else {
            this.addAudioEvent('Remote user is not sending Audio');
        }
        // console.log(this.listAudioEvents);
    };
    CallingService.prototype.createPeerConnection = function () {
        var _this = this;
        this.rtcPeerConnection = new RTCPeerConnection(this.config);
        this.rtcPeerConnection.onicecandidate = function (e) { _this.onIceCandidate(e); };
        this.rtcPeerConnection.onaddstream = function (e) { _this.onAddStream(e); };
        this.rtcPeerConnection.onconnectionstatechange = function (e) { _this.RTCConnectionStateHandler(e); };
        this.rtcPeerConnection.oniceconnectionstatechange = function (e) { _this.ICEConnectionStateHandler(e); };
        this.rtcPeerConnection.onsignalingstatechange = function (e) { _this.RTCSignalingStateHandler(e); };
        this.rtcPeerConnection.addStream(this.localStream.getValue());
    };
    CallingService.prototype.RTCConnectionStateHandler = function (event) {
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
    };
    CallingService.prototype.ICEConnectionStateHandler = function (event) {
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
    };
    CallingService.prototype.RTCSignalingStateHandler = function (event) {
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
    };
    CallingService.prototype.addAudioEvent = function (event) {
        this.listAudioEvents.push(event);
    };
    CallingService.prototype.addLocalStream = function (stream) {
        this.localStream.next(stream);
    };
    CallingService.prototype.setLocalAndOffer = function (sessionDescription, target) {
        var _this = this;
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
        }, function (response) {
            if (response && response.recieverStatus) {
                if (response.callStatus) {
                    _this.EndCall();
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'User is already on call please wait..'
                        },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                }
                else {
                    console.log('CALL CONNECTED!');
                    _this.callConnect.next(true);
                    _this.CallerTune(true);
                    _this.callAccepted.next(false);
                    _this.callStart.next(true);
                    _this.callRejected.next(false);
                    _this.callSelfEnded.next(false);
                    _this.callEnd.next(false);
                    _this.seconds.next(0);
                    _this.minutes.next(0);
                }
            }
            else {
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
    };
    CallingService.prototype.setLocalAndAnswer = function (sessionDescription) {
        this.rtcPeerConnection.setLocalDescription(sessionDescription);
    };
    CallingService.prototype.createOffer = function (target) {
        var _this = this;
        //Calling Behaviours
        this.ResetCallingEvents();
        this.callEventList = [];
        //Create Offer
        // this.callConnect.next(true);
        this.selectedAgent.next(target);
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
            if (stream) {
                _this.addLocalStream(stream);
            }
            // console.log(stream);
            // console.log(this.rtcPeerConnection);
            _this.createPeerConnection();
            var offerOptions = {
                offerToReceiveAudio: 1
            };
            _this.rtcPeerConnection.createOffer(offerOptions)
                .then(function (desc) { return _this.setLocalAndOffer(desc, target); })
                .catch(function (e) { return console.log(e); });
        }).catch(function (err) {
            alert('An error ocurred when accessing media devices, please enable your mic.');
            _this.Self_End(target);
            // console.log('An error ocurred when accessing media devices');
            // console.log(err);
        });
        console.log('No Answer timeout started');
        this.noAnswerTimeout.next(setTimeout(function () {
            if (!_this.callAccepted.getValue()) {
                _this.Self_End(_this.selectedAgent.getValue());
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'No answer. Please try again...'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
            clearTimeout(_this.noAnswerTimeout.getValue());
        }, 60000));
    };
    //Version 2 work end
    CallingService.prototype.AcceptCall = function (remote_agent) {
        var _this = this;
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
        }, function (response) {
        });
        this.localCandidates.map(function (event) {
            console.log('Sending Candidates now to: ' + remote_agent);
            // console.log(event.candidate);
            _this.socket.emit('candidate', {
                target: remote_agent,
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate
            });
        });
        this.remoteCandidates.map(function (candidate) {
            // console.log('Remote Candidates: ');
            // console.log(candidate);
            _this.rtcPeerConnection.addIceCandidate(candidate);
        });
    };
    CallingService.prototype.RejectCall = function (remote_agent) {
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
    };
    CallingService.prototype.Self_End = function (remote_agent, error) {
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
    };
    CallingService.prototype.EndCall = function (rejected) {
        if (rejected === void 0) { rejected = false; }
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
        }
        else {
            this.callRejected.next(false);
            this.callEnd.next(true);
        }
        this.clearWebRTC();
        this.CallerTune(false);
    };
    CallingService.prototype.clearWebRTC = function () {
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
    };
    CallingService.prototype.RemoveStreams = function () {
        if (this.localStream.getValue()) {
            var localTracks = this.localStream.getValue().getTracks();
            localTracks.forEach(function (track) {
                track.stop();
            });
        }
    };
    CallingService.prototype.updateCallTimer = function () {
        this.seconds.next(this.seconds.getValue() + 1);
        if (this.seconds.getValue() == 60) {
            this.seconds.next(0);
            this.minutes.next(this.minutes.getValue() + 1);
        }
    };
    CallingService.prototype.updateCallRetryTimer = function () {
        this.count.next(this.count.getValue() - 1);
        if (this.count.getValue() == 0) {
            this.showRetry.next(true);
            clearInterval(this.retryInterval_ID.getValue());
        }
    };
    CallingService.prototype.startCallTimer = function () {
        var _this = this;
        this.timeoutID.next(setInterval(function () {
            _this.updateCallTimer();
        }, 1000));
    };
    CallingService.prototype.startCallRetryTimer = function () {
        var _this = this;
        this.count.next(5);
        this.showRetry.next(false);
        this.retryInterval_ID.next(setInterval(function () {
            _this.updateCallRetryTimer();
        }, 1000));
    };
    CallingService.prototype.ToggleMic = function () {
        this.micEnabled.next(!this.micEnabled.getValue());
        this.localStream.getValue().getAudioTracks()[0].enabled = this.micEnabled.getValue();
        this.localStream.next(this.localStream.getValue());
    };
    CallingService.prototype.ToggleAudio = function () {
        this.audioEnabled.next(!this.audioEnabled.getValue());
        this.remoteStream.getValue().getAudioTracks()[0].enabled = this.audioEnabled.getValue();
        this.remoteStream.next(this.remoteStream.getValue());
    };
    CallingService.prototype.CallerTune = function (state) {
        this.callerTune.getValue().state = state;
    };
    CallingService.prototype.showEvents = function () {
        console.log(this.callEventList);
    };
    CallingService.prototype.getDurationinWords = function (minutes, seconds) {
        var msg = '';
        if (minutes) {
            if (minutes == 1) {
                if (seconds == 1) {
                    msg += minutes + ' minute and ' + seconds + ' second';
                }
                else {
                    msg += minutes + ' minute and ' + seconds + ' seconds';
                }
            }
            else {
                if (seconds == 1) {
                    msg += minutes + ' minutes and ' + seconds + ' second';
                }
                else {
                    msg += minutes + ' minutes and ' + seconds + ' seconds';
                }
            }
        }
        else if (seconds) {
            if (seconds == 1) {
                msg += seconds + ' second ';
            }
            else {
                msg += seconds + ' seconds ';
            }
        }
        if (minutes || seconds) {
            // console.log(minutes, seconds);
            return ' with duration ' + msg;
        }
        else {
            return msg;
        }
    };
    CallingService.prototype.ResetCallingEvents = function () {
        this.callConnect.next(false);
        this.callAccepted.next(false);
        this.callRejected.next(false);
        this.callSelfEnded.next(false);
        this.callStart.next(false);
        this.callEnd.next(false);
        this.seconds.next(0);
        this.minutes.next(0);
    };
    CallingService.prototype.dummyCallNotif = function () {
        this.socket.emit('dummyCallNotif', {}, function (response) {
        });
    };
    CallingService = __decorate([
        core_1.Injectable()
    ], CallingService);
    return CallingService;
}());
exports.CallingService = CallingService;
//# sourceMappingURL=CallingService.js.map