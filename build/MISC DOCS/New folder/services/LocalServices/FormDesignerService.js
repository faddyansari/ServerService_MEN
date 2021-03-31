"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDesignerService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var FormDesignerService = /** @class */ (function () {
    function FormDesignerService(_socket, _authService, http, _notificationService, snackbar) {
        var _this = this;
        this.http = http;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.AddForm = new BehaviorSubject_1.BehaviorSubject(false);
        this.subscriptions = [];
        this.Agent = undefined;
        this.selectedForm = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.Field = new BehaviorSubject_1.BehaviorSubject([]);
        this.Forms = new BehaviorSubject_1.BehaviorSubject([]);
        this.WholeForm = new BehaviorSubject_1.BehaviorSubject([]);
        this.Actions = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.ticketServiceURL = '';
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getForms();
                _this.GetFormActions();
            }
        });
        _authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent = data;
                // this.getForms();
            }
        });
    }
    FormDesignerService.prototype.getForms = function () {
        var _this = this;
        this.socket.emit('getFormsByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.WholeForm.next(response.form_data);
                // console.log(this.WholeForm);
                //     if (this.selectedForm.getValue()) {
                //         response.form_data.form.map(foo => {
                //             if (foo.formName == this.selectedForm.getValue().formName) {
                //                 this.selectedForm.next(foo);
                //                 return;
                //             }
                //         });
                //     }
                //  else {
                //     this.selectedForm.next({});
                // }
            }
        });
    };
    FormDesignerService.prototype.GetFormActions = function () {
        var _this = this;
        this.socket.emit('getActionsUrls', {}, function (response) {
            if (response.status == 'ok') {
                _this.Actions.next(response.actions);
            }
        });
    };
    FormDesignerService.prototype.DeleteForm = function (id) {
        var _this = this;
        this.socket.emit('deleteForm', { id: id }, function (response) {
            if (response.status == 'ok') {
                // console.log(this.WholeForm.getValue());
                var index = _this.WholeForm.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.WholeForm.getValue().splice(index, 1);
                //delete this line by fixing live update issue
                _this.getForms();
                // console.log(this.WholeForm.getValue());
                _this.WholeForm.next(_this.Forms.getValue());
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Form Deleted Successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Form Not Deleted!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    FormDesignerService.prototype.UpdateForm = function (fid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateForm', { fid: fid, UpdatedForm: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Form Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.WholeForm.getValue().findIndex(function (a) { return a._id == fid; });
                    _this.WholeForm.getValue()[index] = response.formUpdated;
                    _this.AddForm.next(false);
                    _this.selectedForm.next(undefined);
                    observer.next({ status: 'ok', wholeForm: response.formUpdated });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating form, Please Try again!'
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
    FormDesignerService.prototype.insertForm = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/insertForm', { obj: obj, email: _this.Agent.email, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        // this.selectedForm.next(response.forminserted.formFields);
                        _this.WholeForm.getValue().unshift(data.forminserted);
                        _this.WholeForm.next(_this.WholeForm.getValue());
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Form Designed Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        _this.AddForm.next(false);
                        // this.selectedForm.next(undefined);
                        observer.next({ status: 'ok', wholeForm: data.forminserted });
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
    FormDesignerService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    FormDesignerService = __decorate([
        core_1.Injectable()
    ], FormDesignerService);
    return FormDesignerService;
}());
exports.FormDesignerService = FormDesignerService;
//# sourceMappingURL=FormDesignerService.js.map