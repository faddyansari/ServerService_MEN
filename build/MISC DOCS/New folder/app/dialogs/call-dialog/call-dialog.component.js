"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var CallDialogComponent = /** @class */ (function () {
    function CallDialogComponent(data, _callingService, snackBar, _router) {
        var _this = this;
        this.data = data;
        this._callingService = _callingService;
        this.snackBar = snackBar;
        this._router = _router;
        this.subscriptions = [];
        this.callConnect = false;
        this.callAccepted = false;
        this.callRejected = false;
        this.callSelfEnded = false;
        this.callStart = false;
        this.callEnd = false;
        this.callTime = 0;
        this.alreadyOnCall = false;
        this.micEnabled = true;
        this.audioEnabled = true;
        // timeOutId : any = '';
        this.seconds = 0;
        this.minutes = 0;
        //Retry Timer
        this.count = 3;
        this.showRetry = true;
        //console.log(data);
        this.user = data;
        this._callingService.createOffer(this.user.type == 'Visitors' ? this.user.id || this.user._id : this.user.email);
        // this.subscriptions.push(this._router.params.subscribe(params => {
        // 	if (params.data) {
        // 		this.agent = params.data;
        // 	}
        // }));
        this.subscriptions.push(this._callingService.callAccepted.subscribe(function (data) {
            _this.callAccepted = data;
            // this.timer();
        }));
        this.subscriptions.push(this._callingService.callRejected.subscribe(function (data) {
            // clearInterval(this.timeOutId);
            _this.callRejected = data;
        }));
        this.subscriptions.push(this._callingService.callSelfEnded.subscribe(function (data) {
            _this.callSelfEnded = data;
            // clearInterval(this.timeOutId);
        }));
        this.subscriptions.push(this._callingService.callConnect.subscribe(function (data) {
            _this.callConnect = data;
        }));
        this.subscriptions.push(this._callingService.callStart.subscribe(function (data) {
            _this.callStart = data;
        }));
        this.subscriptions.push(this._callingService.callEnd.subscribe(function (data) {
            // clearInterval(this.timeOutId);
            _this.callEnd = data;
        }));
        this.subscriptions.push(this._callingService.micEnabled.subscribe(function (data) {
            _this.micEnabled = data;
        }));
        this.subscriptions.push(this._callingService.audioEnabled.subscribe(function (data) {
            _this.audioEnabled = data;
        }));
        this.subscriptions.push(this._callingService.seconds.subscribe(function (data) {
            _this.seconds = data;
        }));
        this.subscriptions.push(this._callingService.minutes.subscribe(function (data) {
            _this.minutes = data;
        }));
        this.subscriptions.push(this._callingService.count.subscribe(function (data) {
            _this.count = data;
        }));
        this.subscriptions.push(this._callingService.showRetry.subscribe(function (data) {
            _this.showRetry = data;
        }));
        this.subscriptions.push(this._callingService.callerTune.subscribe(function (data) {
            _this.callerTune = data;
        }));
        this.subscriptions.push(this._callingService.callerTuneEnd.subscribe(function (data) {
            _this.callerTuneEnd = data;
        }));
    }
    CallDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.self_audio.nativeElement.muted = true;
        this.subscriptions.push(this._callingService.localStream.subscribe(function (stream) {
            if (stream) {
                console.log('Self Stream');
                //console.log(stream.getAudioTracks());
                _this.self_audio.nativeElement.srcObject = stream;
            }
        }));
        this.subscriptions.push(this._callingService.remoteStream.subscribe(function (stream) {
            if (stream) {
                console.log('Remote Stream');
                //(stream.getAudioTracks());
                _this.remote_audio.nativeElement.srcObject = stream;
            }
        }));
    };
    CallDialogComponent.prototype.ngAfterViewInit = function () {
    };
    CallDialogComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    CallDialogComponent.prototype.endCall = function () {
        // clearInterval(this.timeOutId);
        if (this.callConnect) {
            this._callingService.Self_End(this.user.email);
        }
        else {
            this._callingService.EndCall();
        }
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Call ended' + this._callingService.getDurationinWords(this.minutes, this.seconds)
            },
            duration: 3000,
            panelClass: ['user-alert', 'success']
        });
    };
    CallDialogComponent.prototype.reCall = function () {
        this._callingService.createOffer(this.user.type == 'Visitors' ? this.user.id || this.user._id : this.user.email);
    };
    CallDialogComponent.prototype.ToggleMic = function () {
        this._callingService.ToggleMic();
    };
    CallDialogComponent.prototype.ToggleAudio = function () {
        this._callingService.ToggleAudio();
    };
    CallDialogComponent.prototype.showEvents = function () {
        this._callingService.showEvents();
    };
    __decorate([
        core_1.ViewChild('self_audio')
    ], CallDialogComponent.prototype, "self_audio", void 0);
    __decorate([
        core_1.ViewChild('remote_audio')
    ], CallDialogComponent.prototype, "remote_audio", void 0);
    CallDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-call-dialog',
            templateUrl: './call-dialog.component.html',
            styleUrls: ['./call-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CallDialogComponent);
    return CallDialogComponent;
}());
exports.CallDialogComponent = CallDialogComponent;
//# sourceMappingURL=call-dialog.component.js.map