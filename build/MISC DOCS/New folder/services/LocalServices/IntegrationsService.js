"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var IntegrationsService = /** @class */ (function () {
    // public fb_appid: BehaviorSubject<string> = new BehaviorSubject("");
    // private chatSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    // private settingsChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingAssignmentSetting: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingFileSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingTranscriptSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingchatTimeoutsSettings: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // private savingGreetingMessage: BehaviorSubject<boolean> = new BehaviorSubject(false);
    function IntegrationsService(_authService, _socketService, http, snackBar) {
        var _this = this;
        this._authService = _authService;
        this._socketService = _socketService;
        this.http = http;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this.FBUrl = '';
        // lets facebook login know where to come back
        this.FB_redirect_uri = location.protocol + "//" + location.host + location.pathname;
        this.FB_subwindow_location = new BehaviorSubject_1.BehaviorSubject("");
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(this._authService.FacebookRestUrl.subscribe(function (url) {
            _this.FBUrl = url;
        }));
    }
    IntegrationsService.prototype.loginFBUser = function () {
        // let loginPageUrl = "https://www.facebook.com/v3.2/dialog/oauth?client_id={app-id}&redirect_uri={redirect-uri}&state={state-param}
        var loginPageUrl = "https://www.facebook.com/v5.0/dialog/oauth";
        window.open(loginPageUrl);
    };
    IntegrationsService.prototype.getFacebookAppId = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.FBUrl + '/getFacebookAppId', { nsp: _this.agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('getFacebookAppId', {}, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        });
    };
    IntegrationsService.prototype.getFbRule = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.FBUrl + '/getFbRule', { nsp: _this.agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        console.log(response);
                        observer.next(response.rules);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('getFbRule', {}, (response) => {
            //     if (response.status == 'ok') {
            //         console.log(response)
            //         observer.next(response.rules);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        });
    };
    IntegrationsService.prototype.setFacebookAppId = function (value) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.FBUrl + '/updateFacebookAppId', { nsp: _this.agent.nsp, app_id: value }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        observer.next(response.app_id);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            // this.socket.emit('updateFacebookAppId', { app_id: value }, (response) => {
            //     if (response.status == 'ok') {
            //         observer.next(response.app_id);
            //         observer.complete();
            //     } else {
            //         observer.next(undefined);
            //         observer.complete();
            //     }
            // })
        });
    };
    IntegrationsService.prototype.setRuleset = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.FBUrl + '/setRuleset', { obj: obj, nsp: _this.agent.nsp }).subscribe(function (res) {
                if (res.json()) {
                    var response = res.json();
                    if (response.status == 'ok') {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Rule updated sucessfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        observer.next(response.obj);
                        observer.complete();
                    }
                    else {
                        observer.next(undefined);
                        observer.complete();
                    }
                }
            });
            //     this.socket.emit('setRuleset', {obj : obj}, (response) => {
            //         if(response.status == 'ok'){
            //             this.snackBar.openFromComponent(ToastNotifications, {
            //                 data: {
            //                   img: 'ok',
            //                   msg: 'Rule updated sucessfully!'
            //                 },
            //                 duration: 2000,
            //                 panelClass: ['user-alert', 'success']
            //               });
            //             observer.next(response.obj);
            //             observer.complete();
            //         }else{
            //             observer.next(undefined);
            //             observer.complete();
            //         }
            //     })
        });
    };
    //#endregion
    IntegrationsService.prototype.Destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    IntegrationsService = __decorate([
        core_1.Injectable()
    ], IntegrationsService);
    return IntegrationsService;
}());
exports.IntegrationsService = IntegrationsService;
//# sourceMappingURL=IntegrationsService.js.map