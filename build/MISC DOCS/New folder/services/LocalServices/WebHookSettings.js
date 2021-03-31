"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHookSettingsService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var WebHookSettingsService = /** @class */ (function () {
    function WebHookSettingsService(_socketService, _authService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.script = new BehaviorSubject_1.BehaviorSubject('');
        this.currentAppToken = new BehaviorSubject_1.BehaviorSubject('');
        this.subscriptions = [];
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            // if (agent.role == 'admin') {
            // }
            _this.subscriptions.push(_this._socketService.getSocket().subscribe(function (socket) {
                _this.socket = socket;
                _this.GetWebhooks();
            }));
        }));
        this.GetCurrentAppToken();
    }
    WebHookSettingsService.prototype.getCustomScript = function () {
        return this.script.asObservable();
    };
    WebHookSettingsService.prototype.GetWebhooks = function () {
        var _this = this;
        this.socket.emit('getWebhooks', {}, function (response) {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                //console.log(response);
                _this.script.next(response.customScript);
            }
        });
    };
    WebHookSettingsService.prototype.SetScript = function (script) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setCustomScript', { script: script }, function (response) {
                if (response.status == 'ok') {
                    _this.script.next(script);
                    observer.next(response);
                    observer.complete();
                }
                else {
                    switch (response.code) {
                        case '500':
                            observer.error('Invalid Input');
                            break;
                        case '501':
                            observer.error('Internal Server Error');
                            break;
                        case '503':
                            observer.error('Your code contains invalid keywords. ');
                            break;
                    }
                }
            });
        });
    };
    WebHookSettingsService.prototype.GenerateAppToken = function () {
        var _this = this;
        this.socket.emit('generateAppToken', function (resp) {
            // console.log('resp');
            // console.log(resp);
            if (resp.status == "ok") {
                _this.currentAppToken.next(resp.uuid);
            }
            else {
                console.log("Error occurred in generating app token");
            }
            // console.log("generated!")
            // this.currentAppToken.next("resp.appToken");
        });
    };
    WebHookSettingsService.prototype.GetCurrentAppToken = function () {
        var _this = this;
        this.socket.emit('getCurrentAppToken', function (resp) {
            if (resp.status == "ok") {
                // console.log('resp GetCurrentAppToken')
                // console.log(resp)
                _this.currentAppToken.next(resp.uuid);
            }
            else {
                console.log("Error occurred in getting the current app token");
            }
        });
    };
    WebHookSettingsService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    WebHookSettingsService = __decorate([
        core_1.Injectable()
    ], WebHookSettingsService);
    return WebHookSettingsService;
}());
exports.WebHookSettingsService = WebHookSettingsService;
//# sourceMappingURL=WebHookSettings.js.map