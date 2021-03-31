"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesAndPermissionsService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var toast_notifications_component_1 = require("../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var Observable_1 = require("rxjs/Observable");
var RolesAndPermissionsService = /** @class */ (function () {
    function RolesAndPermissionsService(_socket, _authService, _appStateService, snackBar) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this.snackBar = snackBar;
        this.defaultPermissions = new BehaviorSubject_1.BehaviorSubject({});
        this.authPermissions = new BehaviorSubject_1.BehaviorSubject({});
        this.permissions = new BehaviorSubject_1.BehaviorSubject({});
        this.loading = new BehaviorSubject_1.BehaviorSubject(false);
        this.savedPermissions = new BehaviorSubject_1.BehaviorSubject({});
        this.roles = new BehaviorSubject_1.BehaviorSubject([]);
        _appStateService.breadCrumbTitle.next('User Roles and Permissions');
        // Subscribing Agent Object
        _authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        });
        _authService.permissions.subscribe(function (permissions) {
            if (permissions && Object.keys(permissions).length) {
                // console.log(permissions);
                _this.permissions.next(permissions);
                _this.savedPermissions.next(permissions);
                if (_this.Agent) {
                    _this.roles.next(permissions[_this.Agent.role].settings.rolesAndPermissions.canView);
                }
            }
        });
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getDefaultPermissions();
                // this.getNSPPermissions();
            }
        });
    }
    RolesAndPermissionsService.prototype.getDefaultPermissions = function () {
        var _this = this;
        this.socket.emit('getDefaultPermissions', {}, function (response) {
            if (response.status == 'ok') {
                _this.defaultPermissions.next(response.permissions);
                // console.log(this.defaultPermissions.getValue());
            }
        });
    };
    // getAuthenticationSettings(){
    //     this.socket.emit('getAuthSettings', {}, (response) => {
    //         if (response.status == 'ok') {
    //             this.authPermissions.next(response.authPermissions);
    //             // console.log(this.defaultPermissions.getValue());
    //         }
    //     });
    // }
    // getNSPPermissions() {
    //     this.socket.emit('getNSPPermissions', {}, (response) => {
    //         // console.log(response);
    //         if (response.status == 'ok') {
    //             this.permissions.next(response.permissions);
    //             this.roles.next(Object.keys(response.permissions));
    //             this.savedPermissions.next(response.permissions);
    //         }
    //     });
    // }
    RolesAndPermissionsService.prototype.savePermissions = function (permissions, role) {
        var _this = this;
        this.loading.next(true);
        this.socket.emit('savePermissions', { permissions: permissions, role: role }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                // this.permissions.next(response.permissions);
                // this.selectedAgent.next(response.updatedAgent);
            }
            _this.loading.next(false);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.addRole = function (role) {
        var _this = this;
        this.socket.emit('addRole', { permissions: this.defaultPermissions.getValue(), role: role }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                // console.log(response.permissions);
                // this.permissions.next(response.permissions);
                // this.roles.next(Object.keys(response.permissions));
                // this.selectedAgent.next(response.updatedAgent);
            }
            _this.loading.next(false);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.deleteRole = function (role) {
        var _this = this;
        this.socket.emit('deleteRole', { permissions: this.defaultPermissions.getValue(), role: role }, function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                // this.permissions.next(response.permissions);
                // this.selectedAgent.next(response.updatedAgent);
            }
            _this.loading.next(false);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.showSnackbar = function (response) {
        switch (response.status) {
            case 'ok':
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
                break;
            case 'error':
                this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
                break;
            default:
                break;
        }
    };
    RolesAndPermissionsService.prototype.ToggleAuthPermission = function (role, value) {
        var _this = this;
        this.socket.emit('toggleAuthPermission', { role: role, value: value }, function (response) {
            // console.log(response);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.Toggle2FAPermission = function (role, value) {
        var _this = this;
        this.socket.emit('toggle2FAPermission', { role: role, value: value }, function (response) {
            // console.log(response);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.ToggleForgotPassPermission = function (value) {
        var _this = this;
        this.socket.emit('toggleForgotPassword', { value: value }, function (response) {
            // console.log(response);
            _this.showSnackbar(response);
        });
    };
    RolesAndPermissionsService.prototype.addIP = function (ip) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addAuthIP', { ip: ip }, function (response) {
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    RolesAndPermissionsService.prototype.setSuppressionList = function (emails) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setSuppressionList', { emails: emails }, function (response) {
                observer.next(response.status);
                observer.complete();
            });
        });
    };
    RolesAndPermissionsService.prototype.removeIP = function (ip) {
        this.socket.emit('removeAuthIP', { ip: ip }, function (response) {
            console.log(response);
        });
    };
    RolesAndPermissionsService.prototype.removeAgentFromSuppresionList = function (email) {
        this.socket.emit('removeAgentFromSuppressionList', { email: email }, function (response) {
            console.log(response);
        });
    };
    RolesAndPermissionsService.prototype.Destroy = function () {
        this._appStateService.breadCrumbTitle.next('');
    };
    RolesAndPermissionsService = __decorate([
        core_1.Injectable()
    ], RolesAndPermissionsService);
    return RolesAndPermissionsService;
}());
exports.RolesAndPermissionsService = RolesAndPermissionsService;
//# sourceMappingURL=RolesAndPermissionsService.js.map