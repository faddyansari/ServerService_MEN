"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgeMessageService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var AcknowledgeMessageService = /** @class */ (function () {
    function AcknowledgeMessageService(_socket, _notificationService, snackbar) {
        var _this = this;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.AddAckMessage = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedAckMessage = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllAckMessages = new BehaviorSubject_1.BehaviorSubject([]);
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getAllAckMessages();
            }
        });
    }
    AcknowledgeMessageService.prototype.toggleActivation = function (obj, flag) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updatePropertyAckMsg', { obj: obj }, function (response) {
                if (response.status == 'ok') {
                    if (flag) {
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Acknowledge Message Activated Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Acknowledge Message de-activated Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    _this.AllAckMessages.next(response.message);
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating survey, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    //CRUD OF SURVEY
    AcknowledgeMessageService.prototype.addAckMessage = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updatePropertyAckMsg', { obj: obj }, function (response) {
                if (response.status == 'ok') {
                    console.log(response);
                    _this.AllAckMessages.next(response.message);
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Acknowledge Message added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.AddAckMessage.next(false);
                    observer.next({ status: 'ok', message: response.message });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in adding Ack. message, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    AcknowledgeMessageService.prototype.getAllAckMessages = function () {
        var _this = this;
        this.socket.emit('getAckMsgbyNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllAckMessages.next(response.ackMsg_data);
            }
            else {
                _this.AllAckMessages.next([]);
            }
        });
    };
    AcknowledgeMessageService.prototype.deleteAckMessage = function (obj) {
        var _this = this;
        this.socket.emit('updatePropertyAckMsg', { obj: obj }, function (response) {
            if (response.status == 'ok') {
                _this.AllAckMessages.next(response.message);
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Acknowledge Message deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Erroe in deleting Ack. message,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    AcknowledgeMessageService.prototype.updateAckMessage = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updatePropertyAckMsg', { obj: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Acknowledge Message Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.AllAckMessages.next(response.message);
                    _this.AddAckMessage.next(false);
                    _this.selectedAckMessage.next(undefined);
                    observer.next({ status: 'ok', survey: response.surveyUpdated });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ack. message, Please Try again!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'error']
                    });
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    AcknowledgeMessageService = __decorate([
        core_1.Injectable()
    ], AcknowledgeMessageService);
    return AcknowledgeMessageService;
}());
exports.AcknowledgeMessageService = AcknowledgeMessageService;
//# sourceMappingURL=AcknowledgeMessageService.js.map