"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecieverCallDialogComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var RecieverCallDialogComponent = /** @class */ (function () {
    function RecieverCallDialogComponent(_callingService, snackBar) {
        var _this = this;
        this._callingService = _callingService;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this.callAccepted = false;
        this.callRejected = false;
        this.callSelfEnded = false;
        this.callStart = false;
        this.callEnd = false;
        this.callTime = 0;
        this.micEnabled = true;
        this.audioEnabled = true;
        this.seconds = 0;
        this.minutes = 0;
        this._callingService.remote_sender.subscribe(function (data) {
            _this.agent_email = data;
        });
        this._callingService.remote_username.subscribe(function (data) {
            _this.agent_username = data;
        });
        this._callingService.callAccepted.subscribe(function (data) {
            _this.callAccepted = data;
        });
        this._callingService.callRejected.subscribe(function (data) {
            _this.callRejected = data;
        });
        this._callingService.callSelfEnded.subscribe(function (data) {
            _this.callSelfEnded = data;
        });
        this._callingService.callStart.subscribe(function (data) {
            _this.callStart = data;
        });
        this._callingService.callEnd.subscribe(function (data) {
            _this.callEnd = data;
        });
        this._callingService.seconds.subscribe(function (data) {
            _this.seconds = data;
        });
        this._callingService.minutes.subscribe(function (data) {
            _this.minutes = data;
        });
        this._callingService.micEnabled.subscribe(function (data) {
            _this.micEnabled = data;
        });
        this._callingService.audioEnabled.subscribe(function (data) {
            _this.audioEnabled = data;
        });
        this._callingService.callerTune.subscribe(function (data) {
            _this.callerTune = data;
        });
    }
    RecieverCallDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.self_audio.nativeElement.muted = true;
        this.subscriptions.push(this._callingService.localStream.subscribe(function (stream) {
            if (stream) {
                if (_this.self_audio.nativeElement) {
                    _this.self_audio.nativeElement.srcObject = stream;
                }
            }
        }));
        this.subscriptions.push(this._callingService.remoteStream.subscribe(function (stream) {
            if (stream) {
                if (_this.remote_audio.nativeElement) {
                    _this.remote_audio.nativeElement.srcObject = stream;
                }
            }
        }));
    };
    RecieverCallDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RecieverCallDialogComponent.prototype.acceptCall = function () {
        //console.log('Call Accepted!');
        this._callingService.AcceptCall(this.agent_email);
    };
    RecieverCallDialogComponent.prototype.rejectCall = function () {
        this._callingService.RejectCall(this.agent_email);
    };
    RecieverCallDialogComponent.prototype.endCall = function () {
        this._callingService.Self_End(this.agent_email);
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Call ended' + this._callingService.getDurationinWords(this.minutes, this.seconds)
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
        });
    };
    RecieverCallDialogComponent.prototype.ToggleMic = function () {
        this._callingService.ToggleMic();
    };
    RecieverCallDialogComponent.prototype.ToggleAudio = function () {
        this._callingService.ToggleAudio();
    };
    __decorate([
        core_1.ViewChild('self_audio')
    ], RecieverCallDialogComponent.prototype, "self_audio", void 0);
    __decorate([
        core_1.ViewChild('remote_audio')
    ], RecieverCallDialogComponent.prototype, "remote_audio", void 0);
    RecieverCallDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-reciever-call-dialog',
            templateUrl: './reciever-call-dialog.component.html',
            styleUrls: ['./reciever-call-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RecieverCallDialogComponent);
    return RecieverCallDialogComponent;
}());
exports.RecieverCallDialogComponent = RecieverCallDialogComponent;
//# sourceMappingURL=reciever-call-dialog.component.js.map