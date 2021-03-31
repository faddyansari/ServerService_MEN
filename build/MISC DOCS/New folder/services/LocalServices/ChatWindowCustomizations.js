"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWindowCustomizations = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ChatWindowCustomizations = /** @class */ (function () {
    function ChatWindowCustomizations(_authService, _socketService, _appStateService) {
        var _this = this;
        this._authService = _authService;
        this._socketService = _socketService;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.displaySettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        // console.log('Chat window Customizations');
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Window Customizations');
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
            _this.GetChatWindowSettings();
        }));
    }
    ChatWindowCustomizations.prototype.GetChatWindowSettings = function () {
        var _this = this;
        if (!this.displaySettings.getValue()) {
            this.socket.emit('getDisplaySettings', {}, (function (response) {
                if (response.status == 'ok') {
                    _this.displaySettings.next(response.settings);
                }
            }));
        }
    };
    ChatWindowCustomizations.prototype.UpdateChaWindowSettings = function (settingsType, displaySettings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateDisplaySettings', {
                settingsName: settingsType,
                settings: (settingsType == 'chatbubble') ? displaySettings.settings.chatbubble : displaySettings.settings.chatbar,
                barEnabled: (settingsType == 'chatbubble') ? false : true,
                avatarColor: displaySettings.avatarColor,
                barEnabledForDesktop: displaySettings.barEnabledForDesktop,
                barEnabledForMobile: displaySettings.barEnabledForMobile
            }, (function (response) {
                if (response.status == 'ok') {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' });
                }
            }));
        });
    };
    ChatWindowCustomizations.prototype.UpdateChatWindowContentSettings = function (name, settings) {
        var _this = this;
        //console.log(settings);
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateChatWindowForm', {
                settingsName: name,
                settings: settings,
            }, (function (response) {
                if (response.status == 'ok') {
                    _this.displaySettings.getValue().settings.chatwindow[name] = settings;
                    _this.displaySettings.next(_this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' });
                }
            }));
        });
    };
    ChatWindowCustomizations.prototype.UpdateBackgroundImage = function (link, name) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateBackgroundImage', {
                links: link,
                name: name
            }, (function (response) {
                if (response.status == 'ok') {
                    _this.displaySettings.getValue().settings.chatwindow['themeSettings'].bgImage = { links: link, name: name };
                    _this.displaySettings.next(_this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' });
                }
            }));
        });
    };
    ChatWindowCustomizations.prototype.RemoveBackGroundImage = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('removeBackgroundImage', {}, (function (response) {
                if (response.status == 'ok') {
                    _this.displaySettings.getValue().settings.chatwindow['themeSettings'].bgImage = {};
                    _this.displaySettings.next(_this.displaySettings.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    //TODO. Send Proper Error After Recieving Errors From Server.
                    observer.error({ error: 'error' });
                }
            }));
        });
    };
    ChatWindowCustomizations.prototype.GetDisplaySettings = function () {
        return this.displaySettings.asObservable();
    };
    ChatWindowCustomizations.prototype.RGBAToHexAString = function (rgba) {
        if (new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba))
            return rgba;
        var sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);
        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);
        for (var R in rgba) {
            var r = rgba[R];
            if (r.indexOf("%") > -1) {
                var p = r.substr(0, r.length - 1) / 100;
                if (parseInt(R) < 3) {
                    rgba[R] = Math.round(p * 255);
                }
                else {
                    rgba[R] = p;
                }
            }
        }
        console.log(this.RGBAToHexA(rgba));
        return this.RGBAToHexA(rgba);
    };
    ChatWindowCustomizations.prototype.RGBAToHexA = function (rgba) {
        //console.log(rgba);
        var r = (+rgba[0]).toString(16), g = (+rgba[1]).toString(16), b = (+rgba[2]).toString(16), a = Math.round(+rgba[3] * 255).toString(16);
        if (!a)
            a = 'F';
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;
        //console.log(a);
        return "#" + r + g + b + a;
    };
    ChatWindowCustomizations.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatWindowCustomizations = __decorate([
        core_1.Injectable()
    ], ChatWindowCustomizations);
    return ChatWindowCustomizations;
}());
exports.ChatWindowCustomizations = ChatWindowCustomizations;
//# sourceMappingURL=ChatWindowCustomizations.js.map