"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAuthGuard = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var MainAuthGuard = /** @class */ (function () {
    function MainAuthGuard(_globalApplicationState, _authService) {
        var _this = this;
        this._globalApplicationState = _globalApplicationState;
        this.accessRoute = '';
        this.accessSet = false;
        this.accessWhatsApp = false;
        _authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions;
            }
        });
        this._globalApplicationState.accessRoute.subscribe(function (route) {
            _this.accessRoute = route;
        });
        this._globalApplicationState.canAccessWhatsApp.subscribe(function (permission) {
            _this.accessWhatsApp = permission;
        });
        this._globalApplicationState.accessSet.subscribe(function (value) {
            _this.accessSet = value;
        });
    }
    MainAuthGuard.prototype.canActivate = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this._globalApplicationState.accessSet.subscribe(function (value) {
                if (value) {
                    if (_this.accessRoute.match(/\//g).length > 1) {
                        var routes = _this.accessRoute.split('/').filter(Boolean);
                        _this.accessRoute = '/' + routes[0];
                    }
                    var result = false;
                    switch (_this.accessRoute) {
                        case '':
                        case '/':
                        case '/home':
                            result = true;
                            break;
                        case '/dashboard':
                            result = _this.permissions.dashboard.enabled;
                            break;
                        case '/chats':
                            result = _this.permissions.chats.enabled;
                            break;
                        case '/tickets':
                            // result = this._globalApplicationState.canAccessTickets.getValue();;
                            result = _this.permissions.tickets.enabled;
                            break;
                        case '/visitors':
                            result = _this.permissions.visitors.enabled;
                            break;
                        case '/settings':
                            result = _this.permissions.settings.enabled;
                            break;
                        case '/agents':
                            result = _this.permissions.agents.enabled;
                            break;
                        case '/contacts':
                            result = false;
                            break;
                        case '/installation':
                            result = _this._globalApplicationState.canAccessInstallation.getValue();
                            break;
                        case '/crm':
                            result = _this.permissions.crm.enabled;
                            break;
                        case '/analytics':
                            result = _this.permissions.analytics.enabled;
                            break;
                        case '/noaccess':
                            result = _this._globalApplicationState.canAccessPageNotFound.getValue();
                            break;
                        case '/whatsapp':
                            result = _this._globalApplicationState.canAccessWhatsApp.getValue();
                            break;
                        default:
                            result = true;
                            break;
                    }
                    if (result) {
                        observer.next(result);
                        observer.complete();
                    }
                    else {
                        // console.log('No Access!');
                        _this._globalApplicationState.canAccessPageNotFound.next(true);
                        _this._globalApplicationState.NavigateTo('/noaccess');
                        observer.next(false);
                        observer.complete();
                    }
                    // if (this._globalApplicationState.getRouteAccess(this.accessRoute)) {
                    // 	observer.next(true);
                    // 	observer.complete();
                    // } else if (this.accessRoute != '/noaccess') {
                    // 	// console.log('No Access!');
                    // 	this._globalApplicationState.canAccessPageNotFound.next(true);
                    // 	this._globalApplicationState.NavigateTo('/noaccess');
                    // 	observer.next(false);
                    // 	observer.complete();
                    // } else {
                    // 	this._globalApplicationState.NavigateTo('/home');
                    // 	observer.next(true);
                    // 	observer.complete();
                    // }
                }
            });
        });
    };
    MainAuthGuard = __decorate([
        core_1.Injectable()
    ], MainAuthGuard);
    return MainAuthGuard;
}());
exports.MainAuthGuard = MainAuthGuard;
//# sourceMappingURL=MainAuthGuard.js.map