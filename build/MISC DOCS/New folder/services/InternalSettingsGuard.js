"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalSettingsGuard = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var InternalSettingsGuard = /** @class */ (function () {
    function InternalSettingsGuard(_globalApplicationState, _authService) {
        var _this = this;
        this._globalApplicationState = _globalApplicationState;
        this.accessRoute = '';
        this.accessSet = false;
        _authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.settings;
            }
        });
        this._globalApplicationState.accessRoute.subscribe(function (route) {
            _this.accessRoute = route;
        });
        this._globalApplicationState.accessSet.subscribe(function (value) {
            _this.accessSet = value;
        });
    }
    InternalSettingsGuard.prototype.canActivateChild = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this._globalApplicationState.accessSet.subscribe(function (value) {
                if (value) {
                    if (_this.accessRoute.match(/\//g).length > 2) {
                        var routes = _this.accessRoute.split('/').filter(Boolean);
                        _this.lastRoute = routes[routes.length - 1];
                        _this.accessRoute = '/' + routes[0] + '/' + routes[1];
                    }
                    var result = false;
                    switch (_this.accessRoute) {
                        case '/settings':
                            result = true;
                            break;
                        case '/settings/general':
                            switch (_this.lastRoute) {
                                case 'automated-responses':
                                    result = _this.permissions.automatedResponses.enabled;
                                    break;
                                case 'roles-and-permissions':
                                    result = _this.permissions.rolesAndPermissions.enabled;
                                    break;
                                case 'auth-settings':
                                    result = true;
                                    break;
                                case 'keyboard-shortcuts':
                                    result = true;
                                    break;
                                case 'response':
                                    result = true;
                                    break;
                                default:
                                    result = false;
                                    break;
                            }
                            break;
                        case '/settings/form-designer':
                            result = _this.permissions.formDesigner.enabled;
                            ;
                            break;
                        case '/settings/assignment-rules':
                            result = _this.permissions.assignmentRules.enabled;
                            break;
                        case '/settings/ticket-management':
                            result = _this.permissions.ticketManagement.enabled;
                            break;
                        case '/settings/chat-settings':
                            result = _this.permissions.chatTimeouts.enabled;
                            break;
                        case '/settings/call-settings':
                            result = _this.permissions.callSettings.enabled;
                            break;
                        case '/settings/contact-settings':
                            result = _this.permissions.callSettings.enabled;
                            break;
                        case '/settings/chat-window':
                            result = _this.permissions.chatWindowSettings.enabled;
                            break;
                        case '/settings/webhooks':
                            result = _this.permissions.webhooks.enabled;
                            break;
                        case '/settings/integerations':
                            result = _this.permissions.integerations.enabled;
                            break;
                        case '/settings/knowledge-base':
                            result = _this.permissions.knowledgeBase.enabled;
                            break;
                        case '/settings/widget-marketing':
                            result = _this.permissions.widgetMarketing.enabled;
                            break;
                        case '/settings/group-management':
                            result = false;
                            break;
                        case '/settings/keyboard-shortcuts':
                            result = false;
                            break;
                        case '/settings/profile':
                            result = false;
                            break;
                        // case '/settings/bulk-marketing-email':
                        // 	result = false;
                        // 	break;
                        default:
                            result = false;
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
                    // if (this._globalApplicationState.getSettingsRouteAccess(this.accessRoute)) {
                    // 	observer.next(true);
                    // 	observer.complete();
                    // } else {
                    // 	// console.log('No Access!');
                    // 	this._globalApplicationState.canAccessPageNotFound.next(true);
                    // 	this._globalApplicationState.NavigateTo('/noaccess');
                    // 	observer.next(false);
                    // 	observer.complete();
                    // }
                }
            });
        });
    };
    InternalSettingsGuard = __decorate([
        core_1.Injectable()
    ], InternalSettingsGuard);
    return InternalSettingsGuard;
}());
exports.InternalSettingsGuard = InternalSettingsGuard;
//# sourceMappingURL=InternalSettingsGuard.js.map