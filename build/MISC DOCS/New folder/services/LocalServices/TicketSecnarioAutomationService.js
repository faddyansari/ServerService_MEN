"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketSecnarioAutomationService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketSecnarioAutomationService = /** @class */ (function () {
    function TicketSecnarioAutomationService(_socket, _authService, http, _notificationService, snackbar, _agentService) {
        var _this = this;
        this.http = http;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this._agentService = _agentService;
        this.subscriptions = [];
        this.AddScenario = new BehaviorSubject_1.BehaviorSubject(false);
        this.cloneScenario = new BehaviorSubject_1.BehaviorSubject(false);
        this.Agent = undefined;
        this.selectedScenario = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.AllScenarios = new BehaviorSubject_1.BehaviorSubject([]);
        this.agentsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.groupList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.teamsList = new BehaviorSubject_1.BehaviorSubject(undefined);
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
                _this.getAllScenarios();
            }
        });
        _authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent = data;
            }
        });
        //     this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(agentList => {
        //         this.agentsList.next(agentList);
        //     }));
        //     this.subscriptions.push(this._ticketAutomationSvc.Groups.subscribe(groups => {
        //         this.groupList.next(groups);
        //     }));
        //     this.subscriptions.push(this._teamSvc.Teams.subscribe(teams => {
        //         this.teamsList.next(teams);
        //     }));
    }
    // //CRUD OF POLICY
    TicketSecnarioAutomationService.prototype.AddTicketScenario = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/addScenario', { scenarioObj: obj, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        // console.log(response);
                        _this.AllScenarios.getValue().unshift(data.scenarioInserted);
                        _this.AllScenarios.next(_this.AllScenarios.getValue());
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Ticket Scenario added Successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                        _this.AddScenario.next(false);
                        _this.cloneScenario.next(false);
                        _this.selectedScenario.next(undefined);
                        observer.next({ status: 'ok', scenario: data.scenarioInserted });
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
    TicketSecnarioAutomationService.prototype.getAllScenarios = function () {
        var _this = this;
        this.socket.emit('getAllScenarios', {}, function (response) {
            if (response.status == 'ok') {
                _this.AllScenarios.next(response.scenarios);
            }
            else {
                _this.AllScenarios.next([]);
            }
        });
    };
    TicketSecnarioAutomationService.prototype.deleteScenario = function (id) {
        var _this = this;
        this.socket.emit('deleteScenario', { id: id }, function (response) {
            if (response.status == 'ok') {
                var index = _this.AllScenarios.getValue().findIndex(function (obj) { return obj._id == id; });
                _this.AllScenarios.getValue().splice(index, 1);
                _this.getAllScenarios();
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
                        msg: 'Error in deleting scenario,Please Try again!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    TicketSecnarioAutomationService.prototype.updateScenario = function (sid, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateScenario', { sid: sid, scenarioUpd: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket Scenario Updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    var index = _this.AllScenarios.getValue().findIndex(function (a) { return a._id == sid; });
                    _this.AllScenarios.getValue()[index] = response.scenarioUpdated;
                    _this.AllScenarios.next(_this.AllScenarios.getValue());
                    _this.AddScenario.next(false);
                    _this.selectedScenario.next(undefined);
                    observer.next({ status: 'ok', policy: response.scenarioUpdated });
                    observer.complete();
                }
                else {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'warning',
                            msg: 'Error in updating Ticket Scenario, Please Try again!'
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
    TicketSecnarioAutomationService = __decorate([
        core_1.Injectable()
    ], TicketSecnarioAutomationService);
    return TicketSecnarioAutomationService;
}());
exports.TicketSecnarioAutomationService = TicketSecnarioAutomationService;
//# sourceMappingURL=TicketSecnarioAutomationService.js.map