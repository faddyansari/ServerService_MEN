"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketAutomationService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var toast_notifications_component_1 = require("../../app/dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketAutomationService = /** @class */ (function () {
    function TicketAutomationService(_socket, _authService, http, _notificationService, snackbar) {
        var _this = this;
        this.http = http;
        this._notificationService = _notificationService;
        this.snackbar = snackbar;
        this.Tag = new BehaviorSubject_1.BehaviorSubject({});
        this.Groups = new BehaviorSubject_1.BehaviorSubject([]);
        this.selectedGroup = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.Ruleset = new BehaviorSubject_1.BehaviorSubject([]);
        this.components = new BehaviorSubject_1.BehaviorSubject([]);
        this.notification = new BehaviorSubject_1.BehaviorSubject('');
        this.condition = [];
        this.subscriptions = [];
        this.conditions = new BehaviorSubject_1.BehaviorSubject([
            {
                id: 1,
                key: "",
                operatorOption: "",
                value: [],
            }
        ]);
        this.defaultCondition = new BehaviorSubject_1.BehaviorSubject([
            {
                id: 1,
                key: "",
                operatorOption: "",
                value: [],
            }
        ]);
        this.finalRuleset = [];
        this.ticketServiceURL = '';
        // console.log("Ticket Automation Service");
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        _authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        });
        // Subscribing Agent Object
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        this.subscriptions.push(_socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getGroups();
                _this.getRuleset();
                _this.socket.on('groupChanges', function (response) {
                    // console.log(response);
                    if (response && response.status == 'ok') {
                        _this.getGroups();
                        // this.Groups.getValue().push(response.group);
                        // this.Groups.next(this.Groups.getValue());
                    }
                    // this.Groups.next(data.group_data);
                });
                _this.socket.on('groupDeleted', function (response) {
                    // console.log(response);
                    if (response && response.status == 'ok') {
                        _this.Groups.getValue().map(function (g, index) {
                            if (g.group_name == response.group_name) {
                                _this.Groups.getValue().splice(index, 1);
                            }
                        });
                        if (_this.selectedGroup.getValue()) {
                            if (_this.selectedGroup.getValue().group_name == response.group_name) {
                                _this.selectedGroup.next(undefined);
                            }
                        }
                        _this.Groups.next(_this.Groups.getValue());
                    }
                    // this.Groups.next(data.group_data);
                });
            }
        }));
    }
    // getGroups() {
    //     this.socket.emit('getGroupByNSP', {}, (data) => {
    //         if (data.status == 'ok') {
    //             // console.log(data);
    //             this.Groups.next(data.group_data);
    //             // console.log(this.Group.getValue());
    //         } else {
    //             this.Groups.next({});
    //         }
    //     });
    // }
    // ToggleActivation(flag,rulename){
    //     this.socket.emit('toggleActivation', { activation: flag, rulename:rulename }, (data) => {
    //         if (data.status == 'ok') {
    //             console.log(data.activation.activated);
    //             this.Ruleset.getValue()[0].activated = data.activation.activated;
    //             this.Ruleset.next(this.Ruleset.getValue())
    //             console.log(this.Ruleset.getValue());
    //             this.snackbar.openFromComponent(ToastNotifications, {
    //                 data: {
    //                     img: 'ok',
    //                     msg: 'Ruleset activated successfully!',
    //                 },
    //                 duration: 2000,
    //                 panelClass: ['user-alert', 'success']
    //             });
    //         } else {
    //         }
    //     });
    // }
    TicketAutomationService.prototype.getGroups = function () {
        var _this = this;
        if (!this.Agent || !Object.keys(this.Agent).length)
            return;
        this.http.post(this.ticketServiceURL + '/getGroupByNSP', { email: this.Agent.email, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    // console.log(data);
                    _this.Groups.next(data.group_data);
                    if (_this.selectedGroup.getValue()) {
                        if (!_this.Groups.getValue().filter(function (g) { return g.group_name == _this.selectedGroup.getValue().group_name; }).length) {
                            _this.selectedGroup.next(undefined);
                        }
                        else {
                            data.group_data.map(function (g) {
                                if (g.group_name == _this.selectedGroup.getValue().group_name) {
                                    _this.selectedGroup.next(g);
                                    return;
                                }
                            });
                        }
                        // console.log(this.Group.getValue());
                    }
                }
                else {
                    _this.Groups.next({});
                }
            }
        });
        // this.socket.emit('getGroupByNSP', {}, (data) => {
        //     // console.log(data);
        //     if (data.status == 'ok') {
        //         // console.log(data);
        //         this.Groups.next(data.group_data);
        //         if (this.selectedGroup.getValue()) {
        //             if(!this.Groups.getValue().filter(g => g.group_name == this.selectedGroup.getValue().group_name).length){
        //                 this.selectedGroup.next(undefined);
        //             }else{
        //                 data.group_data.map(g => {
        //                     if (g.group_name == this.selectedGroup.getValue().group_name) {
        //                         this.selectedGroup.next(g);
        //                         return;
        //                     }
        //                 });
        //             }
        //             // console.log(this.Group.getValue());
        //         }
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    };
    TicketAutomationService.prototype.setSelectedGroup = function (group_name) {
        var _this = this;
        if (group_name) {
            this.Groups.getValue().map(function (g) {
                if (g.group_name == group_name) {
                    _this.selectedGroup.next(g);
                    return;
                }
            });
        }
        else {
            this.selectedGroup.next(undefined);
        }
    };
    TicketAutomationService.prototype.setAutoAssign = function (group_name, auto_assign) {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/setGroupAutoAssign', { group_name: group_name, auto_assign: auto_assign, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_1 = res.json();
                if (response_1.status == 'ok') {
                    _this.Groups.getValue().map(function (group) {
                        if (group.group_name == response_1.group.group_name) {
                            group.auto_assign = auto_assign;
                            return;
                        }
                    });
                    if (_this.selectedGroup.getValue() && _this.selectedGroup.getValue().group_name == response_1.group.group_name) {
                        _this.selectedGroup.getValue().auto_assign = auto_assign;
                        _this.selectedGroup.next(_this.selectedGroup.getValue());
                    }
                    _this.Groups.next(_this.Groups.getValue());
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Settings updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
        });
        // this.socket.emit('setGroupAutoAssign', { group_name: group_name, auto_assign: auto_assign }, (response) => {
        //     if (response.status == 'ok') {
        //         this.Groups.getValue().map(group => {
        //             if (group.group_name == response.group.group_name) {
        //                 group.auto_assign = auto_assign;
        //                 return;
        //             }
        //         });
        //         if (this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == response.group.group_name) {
        //             this.selectedGroup.getValue().auto_assign = auto_assign;
        //             this.selectedGroup.next(this.selectedGroup.getValue());
        //         }
        //         this.Groups.next(this.Groups.getValue())
        //         this.snackbar.openFromComponent(ToastNotifications, {
        //             data: {
        //                 img: 'ok',
        //                 msg: 'Settings updated Successfully!'
        //             },
        //             duration: 2000,
        //             panelClass: ['user-alert', 'success']
        //         });
        //     }
        // })
    };
    TicketAutomationService.prototype.UpdateAgentCount = function (group_name, agent_email) {
        this.Groups.getValue().map(function (element) {
            if (element.group_name == group_name) {
                element.agent_list.filter(function (a) { return a.email == agent_email; })[0].count += 1;
                return element;
            }
        });
        // if(this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == group_name){
        //     this.selectedGroup.getValue().agent_list.filter(a => a.email == agent_email)[0].count += 1;
        //     this.selectedGroup.next(this.selectedGroup.getValue());
        // }
        this.Groups.next(this.Groups.getValue());
    };
    TicketAutomationService.prototype.UpdateRuleSet = function (rulename, group, operator, conditions) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // console.log(rulename, group, operator, conditions);
            // this.finalRuleset.push(name, this.condition, assignment, operator)
            // this.Ruleset.next(this.finalRuleset);
            _this.socket.emit('updateRuleSet', { rulename: rulename, condition: conditions, condtionOperator: operator, assigned_to: group }, function (response) {
                if (response.status == 'ok') {
                    // console.log("rule", this.Ruleset.getValue());
                    // console.log("Ruleset updated ", response.updatedruleSet);
                    _this.Ruleset.next(response.updatedruleSet);
                    // console.log(this.Ruleset.getValue());
                    _this.conditions.next(response.updatedruleSet.ruleset[0].conditions);
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset updated Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok', updatedruleset: response.updatedruleSet });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    TicketAutomationService.prototype.assignAgent = function (agent_email, group_name, snackbar) {
        var _this = this;
        if (snackbar === void 0) { snackbar = true; }
        this.http.post(this.ticketServiceURL + '/assignAgent', { agent_email: agent_email, group_name: group_name, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.getGroups();
                    if (snackbar) {
                        _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Agent assigned successfully!',
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                }
                else {
                    _this.Groups.next({});
                }
            }
        });
        // this.socket.emit('assignAgent', { agent_email: agent_email, group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         this.getGroups();
        //         if (snackbar) {
        //             this.snackbar.openFromComponent(ToastNotifications, {
        //                 data: {
        //                     img: 'ok',
        //                     msg: 'Agent assigned successfully!',
        //                 },
        //                 duration: 2000,
        //                 panelClass: ['user-alert', 'success']
        //             });
        //         }
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    };
    TicketAutomationService.prototype.saveAdmins = function (group_name, adminList, snackbar) {
        var _this = this;
        if (snackbar === void 0) { snackbar = true; }
        this.socket.emit('saveAdmins', { adminList: adminList, group_name: group_name }, function (data) {
            if (data.status == 'ok') {
                _this.getGroups();
                if (snackbar) {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: ((adminList.length < 2) ? 'Admin' : 'Admins') + ' added successfully!',
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
            else {
                _this.Groups.next({});
            }
        });
    };
    TicketAutomationService.prototype.pushAdmin = function (email, group_name) {
        var _this = this;
        this.socket.emit('pushAdmin', { email: email, group_name: group_name }, function (data) {
            console.log(data);
            if (data.status == 'ok') {
                _this.getGroups();
            }
            else {
                _this.Groups.next({});
            }
        });
    };
    TicketAutomationService.prototype.removeAdmin = function (group_name, email, snackbar) {
        var _this = this;
        if (snackbar === void 0) { snackbar = true; }
        this.socket.emit('removeAdmin', { group_name: group_name, email: email }, function (data) {
            if (data.status == 'ok') {
                _this.getGroups();
                if (snackbar) {
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Admin removed successfully!',
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            }
            else {
                _this.Groups.next({});
            }
        });
    };
    TicketAutomationService.prototype.ToggleAdmin = function (group_name, email, value) {
        this.http.post(this.ticketServiceURL + '/toggleAdmin', { group_name: group_name, email: email, value: value, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
            }
        });
        // this.socket.emit('toggleAdmin', { group_name: group_name, email: email, value: value }, (response) => {
        // })
    };
    TicketAutomationService.prototype.ToggleExclude = function (group_name, email, value) {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/toggleExclude', { group_name: group_name, email: email, value: value, nsp: this.Agent.nsp }).subscribe(function (res) {
            if (res.json()) {
                var response_2 = res.json();
                _this.Groups.getValue().map(function (g) {
                    if (g._id == response_2.group._id) {
                        g.agent_list = response_2.group.agent_list;
                        return g;
                    }
                });
                _this.Groups.next(_this.Groups.getValue());
            }
        });
        // this.socket.emit('toggleExclude', { group_name: group_name, email: email, value: value }, (response) => {
        // })
    };
    TicketAutomationService.prototype.unAssignAgent = function (agent_email, group_name) {
        var _this = this;
        this.http.post(this.ticketServiceURL + '/unAssignAgent', { agent_email: agent_email, group_name: group_name, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.getGroups();
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Agent unassigned successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
                else {
                    _this.Groups.next({});
                }
            }
        });
        // this.socket.emit('unAssignAgent', { agent_email: agent_email, group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         // console.log("unassigned", data);
        //         this.getGroups();
        //         // this.Groups.next(data.group_data);
        //         // this.Groups.getValue().groups.some(g => {
        //         //     if(this.selectedGroup.getValue() && this.selectedGroup.getValue().group_name == g.group_name){
        //         //         this.selectedGroup.next(g);
        //         //         return true;
        //         //     }
        //         // })
        //         this.snackbar.openFromComponent(ToastNotifications, {
        //             data: {
        //                 img: 'ok',
        //                 msg: 'Agent unassigned successfully!'
        //             },
        //             duration: 2000,
        //             panelClass: ['user-alert', 'success']
        //         });
        //         // console.log(this.Group.getValue());
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    };
    TicketAutomationService.prototype.insertGroup = function (group) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/insertGroup', { group: group, nsp: _this.Agent.nsp }).subscribe(function (response) {
                // console.log(response.json())
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.getGroups();
                    }
                    observer.next(data.status);
                    observer.complete();
                }
            });
        });
        // this.socket.emit('insertGroup', { group: group }, (data) => {
        //     if (data.status == 'ok') {
        //         // console.log(data);
        //         this.getGroups();
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    };
    TicketAutomationService.prototype.deleteGroup = function (group_name) {
        var _this = this;
        if (this.selectedGroup.getValue()) {
            if (this.selectedGroup.getValue().group_name == group_name) {
                this.selectedGroup.next(undefined);
            }
        }
        this.http.post(this.ticketServiceURL + '/deleteGroup', { group_name: group_name, nsp: this.Agent.nsp }).subscribe(function (response) {
            if (response.json()) {
                var data = response.json();
                if (data.status == 'ok') {
                    _this.Groups.next(data.group_data);
                }
                else {
                    _this.Groups.next({});
                }
            }
        });
        // this.socket.emit('deleteGroup', { group_name: group_name }, (data) => {
        //     if (data.status == 'ok') {
        //         this.Groups.next(data.group_data);
        //     } else {
        //         this.Groups.next({});
        //     }
        // });
    };
    // deleteCondition(ruleset): Observable<any> {
    //     return new Observable((observer) => {
    //         this.socket.emit('deleteRule', { rule: rule }, (response) => {
    //             if (response.status == 'ok') {
    //                 console.log(response);
    //                 // this.Ruleset.next(response.ruleset);
    //                 this.notification.next({
    //                     msg: "Ruleset's condition deleted Successfully!",
    //                     type: 'success',
    //                     img: 'ok',
    //                 });
    //                 observer.next({ status: 'ok'})
    //                 observer.complete();
    //             }
    //             else{
    //                 observer.next({ status: 'error' });
    //                 observer.complete();
    //             }
    //         });
    //     });
    // }
    TicketAutomationService.prototype.editRuleset = function () {
        this.conditions.next(this.conditions.getValue());
        this.Ruleset.next(this.Ruleset.getValue());
    };
    TicketAutomationService.prototype.DeleteRuleSet = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // console.log("in svc");
            _this.socket.emit('deleteRuleset', {}, function (response) {
                if (response.status == 'ok') {
                    // console.log(response);
                    // this.getRuleset();
                    // console.log(response.ruleset);
                    _this.Ruleset.next([]);
                    _this.conditions.next([
                        {
                            id: 1,
                            key: "",
                            operatorOption: "",
                            value: [],
                        }
                    ]);
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset deleted Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok' });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    TicketAutomationService.prototype.getNotification = function () {
        return this.notification.asObservable();
    };
    TicketAutomationService.prototype.setNotification = function (notification, type, icon) {
        var item = {
            msg: notification,
            type: type,
            img: icon
        };
        this.notification.next(notification);
    };
    TicketAutomationService.prototype.Conditions = function (condition) {
        this.conditions.getValue().map(function (c) {
            if (c.id == condition.id) {
                c = condition;
            }
        });
        // console.log(condition);
        // this.conditions.getValue().push(condition);
        // this.finalRuleset.push(condition);
        // this.Ruleset.next(this.finalRuleset);
        this.conditions.next(this.conditions.getValue());
        // console.log(this.conditions.getValue());
    };
    TicketAutomationService.prototype.AddComponents = function () {
        // this.conditions.getValue().forEach(element => {
        //     if (element.value && element.value.length > 0) {
        this.conditions.getValue().push({
            id: this.conditions.getValue()[this.conditions.getValue().length - 1].id + 1,
            key: "",
            operatorOption: "",
            value: [],
        });
        this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'More condition added successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
    };
    TicketAutomationService.prototype.RemoveComponents = function (ref, index) {
        if (Object.keys(ref.conditions).length > 1) {
            this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'ok',
                    msg: 'Condition deleted successfully!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'ok']
            });
            this.conditions.getValue().splice(index, 1);
            this.conditions.next(this.conditions.getValue());
            // console.log(this.conditions.getValue());
        }
        else {
            this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Rule cannot be deleted! Add more condtions first'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        }
    };
    TicketAutomationService.prototype.cancel = function () {
        this.Ruleset.next(this.Ruleset.getValue());
        this.conditions.next(this.conditions.getValue());
        this.getRuleset();
    };
    TicketAutomationService.prototype.DoneRuleSet = function (name, assignment, operator) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            // console.log("in svc", name, assignment, operator);
            // console.log(this.conditions.getValue());
            _this.socket.emit('addRuleSet', { rulename: name, condition: _this.conditions.getValue(), condtionOperator: operator, assigned_to: assignment }, function (response) {
                if (response.status == 'ok') {
                    // console.log(response);
                    // console.log(response.ruleset[0].ruleset[0].conditions);
                    _this.Ruleset.next(response.ruleset);
                    _this.conditions.next(response.ruleset[0].ruleset[0].conditions);
                    _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ruleset added Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                    observer.next({ status: 'ok', conditions: response.ruleset[0].ruleset[0].conditions, rule: response.ruleset[0] });
                    observer.complete();
                }
                else {
                    observer.next({ status: 'error' });
                    observer.complete();
                }
            });
        });
    };
    TicketAutomationService.prototype.getRuleset = function () {
        var _this = this;
        this.socket.emit('getRuleset', {}, function (data) {
            if (data.status == 'ok' && data.rule_data && data.rule_data.length) {
                // console.log(data);
                // if(data.rule_data[0].ruleset[0].conditions) console.log(data.rule_data[0].ruleset[0].conditions);
                // .ruleset[0].conditions
                // console.log(data.rule_data[0].ruleset[0].conditions);
                // this.conditions.next(data.rule_data[0].ruleset[0].conditions);
                // console.log(this.conditions.getValue());
                // if (data.rule_data)
                _this.Ruleset.next(data.rule_data);
                // console.log(this.Ruleset.getValue());
                _this.conditions.next(data.rule_data[0].ruleset[0].conditions);
                // console.log(this.conditions.getValue());
            }
            else {
                _this.Ruleset.next({});
                _this.conditions.next([
                    {
                        id: 1,
                        key: "",
                        operatorOption: "",
                        value: [],
                    }
                ]);
            }
        });
        // console.log(this.conditions.getValue());
    };
    TicketAutomationService.prototype.ToggleActivation = function (flag, rulename) {
        var _this = this;
        this.socket.emit('toggleActivation', { activation: flag, rulename: rulename }, function (data) {
            if (data.status == 'ok') {
                // console.log(data.activation.activated);
                _this.Ruleset.getValue()[0].activated = data.activation.activated;
                _this.Ruleset.next(_this.Ruleset.getValue());
                // console.log(this.Ruleset.getValue());
                _this.snackbar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Ruleset activated successfully!',
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
            }
        });
    };
    TicketAutomationService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TicketAutomationService = __decorate([
        core_1.Injectable()
    ], TicketAutomationService);
    return TicketAutomationService;
}());
exports.TicketAutomationService = TicketAutomationService;
//# sourceMappingURL=TicketAutomationService.js.map