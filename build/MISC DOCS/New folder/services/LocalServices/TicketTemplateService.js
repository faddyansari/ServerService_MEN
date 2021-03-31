"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketTemplateSevice = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketTemplateSevice = /** @class */ (function () {
    function TicketTemplateSevice(_socket, _authService, http, _notificationService, snackbar) {
        var _this = this;
        this.http = http;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.AddTemplate = new BehaviorSubject_1.BehaviorSubject(false);
        this.cloneTemplate = new BehaviorSubject_1.BehaviorSubject(false);
        this.Agent = undefined;
        this.selectedTemplate = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllTemplates = new BehaviorSubject_1.BehaviorSubject([]);
        this.ticketServiceURL = '';
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getAllTicketTemplates();
            }
        });
        _authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent = data;
            }
        });
    }
    TicketTemplateSevice.prototype.getAutomatedResponseAgainstAgent = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getResponseByAgent', {}, function (response) {
                if (response.status == 'ok') {
                    observer.next({ status: "ok", AutomatedResponses: response.cannedResponses });
                    observer.complete();
                }
                else {
                    observer.next({ status: "error" });
                    observer.complete();
                }
            });
        });
    };
    //CRUD OF TEMPLATE
    TicketTemplateSevice.prototype.AddTicketTemplate = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // console.log(obj);
            // this.socket.emit('addTicketTemplate', { templateObj: obj }, (response) => {
            //     if (response.status == 'ok') {
            //         this.AllTemplates.getValue().unshift(response.templateInserted);
            //         this.AllTemplates.next(this.AllTemplates.getValue());
            //         this.snackbar.openFromComponent(ToastNotifications, {
            //             data: {
            //                 img: 'ok',
            //                 msg: 'Ticket Template added Successfully!'
            //             },
            //             duration: 2000,
            //             panelClass: ['user-alert', 'success']
            //         });
            //         this.AddTemplate.next(false);
            //         this.cloneTemplate.next(false);
            //         this.selectedTemplate.next(undefined);
            //         observer.next({ status: 'ok', template: response.templateInserted })
            //         observer.complete();
            //     }
            //     else {
            //         this.snackbar.openFromComponent(ToastNotifications, {
            //             data: {
            //                 img: 'warning',
            //                 msg: 'Error in adding Ticket Template, Try again!'
            //             },
            //             duration: 2000,
            //             panelClass: ['user-alert', 'error']
            //         });
            //         observer.next({ status: 'error' });
            //         observer.complete();
            //     }
            // });
            _this.http.post(_this.ticketServiceURL + '/addTicketTemplate', { templateObj: obj, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.AllTemplates.getValue().unshift(data.templateInserted);
                        _this.AllTemplates.next(_this.AllTemplates.getValue());
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Template added Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        _this.AddTemplate.next(false);
                        _this.cloneTemplate.next(false);
                        _this.selectedTemplate.next(undefined);
                        observer.next({ status: 'ok', template: data.templateInserted });
                        observer.complete();
                    }
                    else {
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: data.msg
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                        observer.next({ status: 'error' });
                        observer.complete();
                    }
                }
            });
        });
    };
    TicketTemplateSevice.prototype.getAllTicketTemplates = function () {
        var _this = this;
        this.socket.emit('getAllTicketTemplatesByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllTemplates.next(response.templates);
            }
            else {
                _this.AllTemplates.next([]);
            }
        });
    };
    TicketTemplateSevice.prototype.DeleteTicketTemplate = function (id) {
        var _this = this;
        this.socket.emit('deleteTicketTemplate', { id: id }, function (response) {
            if (response.status == 'ok') {
                var index = _this.AllTemplates.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllTemplates.getValue().splice(index, 1);
                _this.getAllTicketTemplates();
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: response.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in deleting Ticket Template, Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    TicketTemplateSevice.prototype.UpdateTicketTemplate = function (tid, template) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateTicketTemplate', { tid: tid, ticketTemplate: template }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket Template Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllTemplates.getValue().findIndex(function (a) { return a._id == tid; });
                    _this.AllTemplates.getValue()[index] = response.templateEdited;
                    _this.AddTemplate.next(false);
                    _this.selectedTemplate.next(undefined);
                    observer.next({ status: 'ok', policy: response.templateEdited });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ticket Template, Try again!'
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
    TicketTemplateSevice = __decorate([
        core_1.Injectable()
    ], TicketTemplateSevice);
    return TicketTemplateSevice;
}());
exports.TicketTemplateSevice = TicketTemplateSevice;
//# sourceMappingURL=TicketTemplateService.js.map