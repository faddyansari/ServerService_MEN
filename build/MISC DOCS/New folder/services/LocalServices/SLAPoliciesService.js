"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLAPoliciesService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var SLAPoliciesService = /** @class */ (function () {
    function SLAPoliciesService(_socket, _authService, _notificationService, snackbar, _utilityService, _ticketAutomationSvc) {
        var _this = this;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this._utilityService = _utilityService;
        this._ticketAutomationSvc = _ticketAutomationSvc;
        this.subscriptions = [];
        this.Agent = undefined;
        //SLA POLICY BS
        this.reOrderPolicy = new BehaviorSubject_1.BehaviorSubject(false);
        this.AddSLAPolicy = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedSLAPolicy = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllSLAPolicies = new BehaviorSubject_1.BehaviorSubject([]);
        this.changeInReorder = new BehaviorSubject_1.BehaviorSubject(false);
        //INTERNAL POLICY BS
        this.reOrderInternalPolicy = new BehaviorSubject_1.BehaviorSubject(false);
        this.AddInternalSLAPolicy = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedInternalSLAPolicy = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllInternalSLAPolicies = new BehaviorSubject_1.BehaviorSubject([]);
        this.reOrderIntPolicy = new BehaviorSubject_1.BehaviorSubject(false);
        this.changeInReorderInt = new BehaviorSubject_1.BehaviorSubject(false);
        this.agentsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.groupList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.teamsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _authService.getAgent().subscribe(function (data) {
                    if (data) {
                        _this.Agent = data;
                        _this.getAllSLAPolicies();
                        if (_this.Agent.nsp == '/sbtjapaninquiries.com') {
                            _this.getAllInternalSLAPolicies();
                        }
                    }
                });
            }
        });
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentList) {
            _this.agentsList.next(agentList);
        }));
        this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(function (groups) {
            _this.groupList.next(groups);
        }));
    }
    SLAPoliciesService.prototype.toggleSLAPolicyActivation = function (id, flag) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('activateSLAPolicy', { pid: id, activated: flag }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllSLAPolicies.getValue().findIndex(function (a) { return a._id == id; });
                    _this.AllSLAPolicies.getValue()[index].activated = flag;
                    _this.AllSLAPolicies.getValue()[index].lastModified = response.lastModified;
                    _this.AllSLAPolicies.next(_this.AllSLAPolicies.getValue());
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating SLA Policy, Please Try again!'
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
    SLAPoliciesService.prototype.AddPolicy = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('AddPolicy', { policyObj: obj, }, function (response) {
                if (response.status == 'ok') {
                    _this.AllSLAPolicies.getValue().unshift(response.policyInserted);
                    _this.AllSLAPolicies.next(_this.AllSLAPolicies.getValue());
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.AddSLAPolicy.next(false);
                    observer.next({ status: 'ok', policy: response.policyInserted });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in craeting SLA Policy'
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
    SLAPoliciesService.prototype.reOrder = function (callerid, calleeorder, calleeid, callerorder) {
        var _this = this;
        this.socket.emit('reOrder', { callerid: callerid, calleeorder: calleeorder, calleeid: calleeid, callerorder: callerorder }, function (response) {
            if (response.status == 'ok') {
                _this.getAllSLAPolicies();
            }
            else {
                _this.AllSLAPolicies.next([]);
            }
        });
    };
    SLAPoliciesService.prototype.getAllSLAPolicies = function () {
        var _this = this;
        this.socket.emit('getAllPoliciesByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllSLAPolicies.next(response.policies);
            }
            else {
                _this.AllSLAPolicies.next([]);
            }
        });
    };
    SLAPoliciesService.prototype.deleteSLAPolicy = function (id) {
        var _this = this;
        this.socket.emit('deleteSLAPolicy', { id: id }, function (response) {
            if (response.status == 'ok') {
                var index = _this.AllSLAPolicies.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllSLAPolicies.getValue().splice(index, 1);
                _this.AllSLAPolicies.next(_this.AllSLAPolicies.getValue());
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'SLA Policy deleted successfully'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in deleting SLA Policy,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    SLAPoliciesService.prototype.updateSLAPolicy = function (sid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateSLAPolicy', { sid: sid, updatedPolicy: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllSLAPolicies.getValue().findIndex(function (a) { return a._id == sid; });
                    _this.AllSLAPolicies.getValue()[index] = response.policyedited;
                    _this.AddSLAPolicy.next(false);
                    _this.selectedSLAPolicy.next(undefined);
                    observer.next({ status: 'ok', policy: response.policyedited });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating SLA Policy, Please Try again!'
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
    /* #region INTERNAL SLA POLICY */
    SLAPoliciesService.prototype.getAllInternalSLAPolicies = function () {
        var _this = this;
        this.socket.emit('getAllInternalSLAPoliciesByNSP', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllInternalSLAPolicies.next(response.policies);
            }
            else {
                _this.AllInternalSLAPolicies.next([]);
            }
        });
    };
    SLAPoliciesService.prototype.AddInternalPolicy = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('AddInternalPolicy', { policyObj: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.AllInternalSLAPolicies.getValue().unshift(response.policyInserted);
                    _this.AllInternalSLAPolicies.next(_this.AllInternalSLAPolicies.getValue());
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    _this.AddInternalSLAPolicy.next(false);
                    observer.next({ status: 'ok', policy: response.policyInserted });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in adding SLA Policy, Please Try again!'
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
    SLAPoliciesService.prototype.deleteInternalSLAPolicy = function (id) {
        var _this = this;
        this.socket.emit('deleteInternalSLAPolicy', { id: id }, function (response) {
            if (response.status == 'ok') {
                var index = _this.AllInternalSLAPolicies.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllInternalSLAPolicies.getValue().splice(index, 1);
                _this.AllInternalSLAPolicies.next(_this.AllSLAPolicies.getValue());
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
                        msg: 'Error in deleting SLA Policy,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    SLAPoliciesService.prototype.updateInternalSLAPolicy = function (sid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateInternalSLAPolicy', { sid: sid, updatedPolicy: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllInternalSLAPolicies.getValue().findIndex(function (a) { return a._id == sid; });
                    _this.AllInternalSLAPolicies.getValue()[index] = response.policyedited;
                    _this.AllInternalSLAPolicies.next(_this.AllInternalSLAPolicies.getValue());
                    _this.AddSLAPolicy.next(false);
                    _this.selectedInternalSLAPolicy.next(undefined);
                    observer.next({ status: 'ok', policy: response.policyedited });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating SLA Policy, Please Try again!'
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
    SLAPoliciesService.prototype.reOrderInternalSLA = function (callerid, calleeorder, calleeid, callerorder) {
        var _this = this;
        this.socket.emit('reOrderInternalSLA', { callerid: callerid, calleeorder: calleeorder, calleeid: calleeid, callerorder: callerorder }, function (response) {
            if (response.status == 'ok') {
                _this.getAllInternalSLAPolicies();
            }
            else {
                _this.AllInternalSLAPolicies.next([]);
            }
        });
    };
    SLAPoliciesService.prototype.toggleInternalSLAPolicyActivation = function (id, flag) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('activateInternalPolicy', { pid: id, activated: flag }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'SLA Policy Activated/De-activated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllInternalSLAPolicies.getValue().findIndex(function (a) { return a._id == id; });
                    _this.AllInternalSLAPolicies.getValue()[index].activated = flag;
                    _this.AllInternalSLAPolicies.getValue()[index].lastModified = response.lastModified;
                    _this.AllInternalSLAPolicies.next(_this.AllInternalSLAPolicies.getValue());
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in activating/de-activating SLA Policy, Please Try again!'
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
    SLAPoliciesService = __decorate([
        core_1.Injectable()
    ], SLAPoliciesService);
    return SLAPoliciesService;
}());
exports.SLAPoliciesService = SLAPoliciesService;
//# sourceMappingURL=SLAPoliciesService.js.map