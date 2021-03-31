"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationsService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var PushNotificationsService = /** @class */ (function () {
    function PushNotificationsService(_routerService) {
        this._routerService = _routerService;
        this.permission = this.isSupported() ? 'default' : 'denied';
    }
    PushNotificationsService.prototype.isSupported = function () {
        return 'Notification' in window;
    };
    PushNotificationsService.prototype.requestPermission = function () {
        var self = this;
        if ('Notification' in window) {
            Notification.requestPermission(function (status) {
                return self.permission = status;
            });
        }
    };
    PushNotificationsService.prototype.NotificationClick = function (options) {
        var currentlocation = String(window.location);
        var notiflocation = window.location.origin + options.url;
        if (currentlocation == notiflocation) {
            window.focus();
        }
        else {
            window.focus();
            //this._routerService.NavigateTo(options.url);//Has a bug that needs to be resolved.
            window.open(notiflocation, "_self"); //temporary solution
        }
    };
    PushNotificationsService.prototype.create = function (title, options) {
        var _this = this;
        var self = this;
        return new Observable_1.Observable(function (obs) {
            if (!('Notification' in window)) {
                console.log('Notifications are not available in this environment');
                obs.complete();
            }
            if (self.permission !== 'granted') {
                console.log("The user hasn't granted you permission to send push notifications");
                obs.complete();
            }
            var _notify = new Notification(title, options);
            _notify.onshow = function (e) {
                return obs.next({
                    notification: _notify,
                    event: e
                });
            };
            if (options.url) {
                _notify.onclick = function (e) { _this.NotificationClick(options); };
            }
            _notify.onerror = function (e) {
                return obs.error({
                    notification: _notify,
                    event: e
                });
            };
            _notify.onclose = function () {
                return obs.complete();
            };
        });
    };
    PushNotificationsService.prototype.generateNotification = function (source) {
        var self = this;
        source.forEach(function (item) {
            var options = {
                body: item.alertContent,
                icon: item.icon,
                url: item.url,
                renotify: false,
                tag: item.tag ? item.tag : ''
            };
            var notify = self.create(item.title, options).subscribe();
        });
    };
    PushNotificationsService = __decorate([
        core_1.Injectable()
    ], PushNotificationsService);
    return PushNotificationsService;
}());
exports.PushNotificationsService = PushNotificationsService;
//# sourceMappingURL=NotificationService.js.map