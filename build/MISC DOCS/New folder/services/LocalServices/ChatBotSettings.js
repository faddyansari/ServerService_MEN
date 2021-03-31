"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBotSettingsService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ChatBotSettingsService = /** @class */ (function () {
    function ChatBotSettingsService(_socketService) {
        var _this = this;
        this._socketService = _socketService;
        this.CasesList = new BehaviorSubject_1.BehaviorSubject([]);
        this.StateMachineList = new BehaviorSubject_1.BehaviorSubject([]);
        this.WorkFlowsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.subscriptions = [];
        this.requestState = new BehaviorSubject_1.BehaviorSubject(false);
        this.fetchingCases = new BehaviorSubject_1.BehaviorSubject(true);
        this.fetchingMachines = new BehaviorSubject_1.BehaviorSubject(true);
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
            _this.GetCases();
            _this.GetMachines();
            _this.GetWorkFlows();
        }));
    }
    ChatBotSettingsService.prototype.GetCasesList = function () {
        return this.CasesList.asObservable();
    };
    ChatBotSettingsService.prototype.GetStateMachineList = function () {
        return this.StateMachineList.asObservable();
    };
    ChatBotSettingsService.prototype.GetWorkFlowsList = function () {
        return this.WorkFlowsList.asObservable();
    };
    ChatBotSettingsService.prototype.FetchingCases = function () {
        return this.fetchingCases.asObservable();
    };
    ChatBotSettingsService.prototype.FetchingMachines = function () {
        return this.fetchingCases.asObservable();
    };
    ChatBotSettingsService.prototype.GetRequestState = function () {
        return this.requestState.asObservable();
    };
    ChatBotSettingsService.prototype.UpdateCasesList = function (data) {
        this.CasesList.getValue().map(function (Case) {
            if (Case._id == data._id) {
                Case = data;
            }
        });
    };
    ChatBotSettingsService.prototype.AddNewCase = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.requestState.next(true);
            _this.socket.emit('addCase', data, function (response) {
                _this.requestState.next(false);
                if (response.status == 'ok') {
                    data._id = response.id;
                    _this.CasesList.getValue().unshift(data);
                    _this.CasesList.next(_this.CasesList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else if (response.status == 'exists') {
                    _this.CasesList.getValue().unshift(response.case);
                    _this.CasesList.next(_this.CasesList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Can't Add Case");
                }
            });
        });
    };
    ChatBotSettingsService.prototype.GetCases = function () {
        var _this = this;
        this.fetchingCases.next(true);
        if (!localStorage.getItem('chatBotCases')) {
            this.socket.emit('getCases', {}, (function (response) {
                _this.fetchingCases.next(false);
                if (response.status == 'ok') {
                    _this.CasesList.next(response.cases);
                    localStorage.setItem('chatBotCases', JSON.stringify(response.cases));
                }
            }));
        }
        else {
            var cases_1 = JSON.parse(localStorage.getItem('chatBotCases'));
            if (cases_1.length > 0) {
                this.socket.emit('getCases', { id: cases_1[0]._id }, (function (response) {
                    _this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        _this.CasesList.next(response.cases.concat(cases_1));
                        localStorage.setItem('chatBotCases', JSON.stringify(_this.CasesList.getValue()));
                    }
                }));
            }
            else {
                this.socket.emit('getCases', {}, (function (response) {
                    _this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        _this.CasesList.next(response.cases);
                        localStorage.setItem('chatBotCases', JSON.stringify(response.cases));
                    }
                }));
            }
        }
    };
    ChatBotSettingsService.prototype.DeleteCase = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteCase', { id: data }, function (response) {
                if (response.status == 'ok') {
                    _this.CasesList.next(_this.CasesList.getValue().filter(function (Case) {
                        return Case._id != data;
                    }));
                    localStorage.setItem('chatBotCases', JSON.stringify(_this.CasesList.getValue()));
                    observer.next(response);
                    observer.complete();
                }
                else if (response.status == 'assigned') {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error('Error In Deleting Case');
                }
            });
        });
    };
    ChatBotSettingsService.prototype.FilterCases = function (data) {
    };
    ChatBotSettingsService.prototype.EditCase = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('editCase', data, function (response) {
                if (response.status == 'ok') {
                    _this.CasesList.next(_this.CasesList.getValue().map(function (Case) {
                        if (response.case) {
                            if (Case._id == response.case._id) {
                                Case = response.case;
                            }
                        }
                        return Case;
                    }));
                    localStorage.setItem('chatBotCases', JSON.stringify(_this.CasesList.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    //#region StateMAchine Operations
    ChatBotSettingsService.prototype.AddNewMachine = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addMachine', data, (function (response) {
                if (response.status == 'ok') {
                    data._id = response.id;
                    _this.StateMachineList.getValue().unshift(data);
                    _this.StateMachineList.next(_this.StateMachineList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else if (response.status == 'exists') {
                    _this.StateMachineList.getValue().unshift(response.machine);
                    _this.StateMachineList.next(_this.StateMachineList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Can't Add State Machine");
                }
            }));
        });
    };
    ChatBotSettingsService.prototype.GetMachines = function () {
        var _this = this;
        this.fetchingMachines.next(true);
        if (!localStorage.getItem('chatBotMachines')) {
            this.socket.emit('getMachines', {}, (function (response) {
                // console.log(response);
                _this.fetchingMachines.next(false);
                if (response.status == 'ok') {
                    _this.StateMachineList.next(response.machines);
                    localStorage.setItem('chatBotMachines', JSON.stringify(response.machines));
                }
            }));
        }
        else {
            var machines_1 = JSON.parse(localStorage.getItem('chatBotMachines'));
            if (machines_1.length > 0) {
                this.socket.emit('getMachines', { id: machines_1[0]._id }, (function (response) {
                    _this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        _this.StateMachineList.next(response.machines.concat(machines_1));
                        localStorage.setItem('chatBotMachines', JSON.stringify(_this.StateMachineList.getValue()));
                    }
                }));
            }
            else {
                this.socket.emit('getMachines', {}, (function (response) {
                    _this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        _this.StateMachineList.next(response.machines);
                        localStorage.setItem('chatBotMachines', JSON.stringify(response.machines));
                    }
                }));
            }
        }
    };
    ChatBotSettingsService.prototype.DeleteMachine = function (id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteMachine', { _id: id }, (function (response) {
                if (response.status == 'ok') {
                    _this.StateMachineList.next(_this.StateMachineList.getValue().filter(function (machine) {
                        return machine._id != id;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else if (response.status == 'assigned') {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Can't Delete Machine");
                }
            }));
        });
    };
    ChatBotSettingsService.prototype.EditMachine = function (id) {
        return new Observable_1.Observable(function (observer) {
        });
    };
    //#endregion
    ChatBotSettingsService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        //Clear Data on Component Change
        localStorage.removeItem('chatBotMachines');
        localStorage.removeItem('chatBotCases');
        localStorage.removeItem('chatBotWorkFlows');
    };
    //#region States
    //@DATA
    // name : string
    // machineID : string
    ChatBotSettingsService.prototype.AddState = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addState', data, function (response) {
                if (response.status == 'ok') {
                    _this.StateMachineList.next(_this.StateMachineList.getValue().map(function (stateMachine) {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.push(data.state);
                        }
                        return stateMachine;
                    }));
                    localStorage.setItem('chatBotMachines', JSON.stringify(_this.StateMachineList.getValue()));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            });
        });
    };
    //@Data
    // stateName : string
    // stateIndex : number
    // machineId : string
    ChatBotSettingsService.prototype.DeleteState = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteState', data, (function (response) {
                if (response.status == 'ok') {
                    _this.StateMachineList.next(_this.StateMachineList.getValue().map(function (stateMachine) {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.splice(parseInt(data.stateIndex), 1);
                        }
                        return stateMachine;
                    }));
                    localStorage.setItem('chatBotMachines', JSON.stringify(_this.StateMachineList.getValue()));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            }));
        });
    };
    // //@Data
    // // stateObject
    // // machine Id
    // EditState(data): Observable<any> {
    //     return new Observable(observer => {
    //         this.socket.emit('editState', data, (response => {
    //             if (response.status == 'ok') {
    //                 observer.next(response);
    //                 observer.complete();
    //             } else {
    //                 observer.error(response);
    //             }
    //         }));
    //     });
    // }
    //#endregion
    //#region StateMachine Handler Actions
    ChatBotSettingsService.prototype.AddHandler = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addHandler', data, (function (response) {
                if (response.status == 'ok') {
                    _this.StateMachineList.next(_this.StateMachineList.getValue().map(function (StateMachine) {
                        if (StateMachine._id == data.machineId) {
                            StateMachine.states.map(function (state) {
                                if (state.name == data.stateName) {
                                    state.handlers.push(data.handler);
                                }
                                return state;
                            });
                        }
                        return StateMachine;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            }));
        });
    };
    ChatBotSettingsService.prototype.DeleteHandler = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteHandler', data, (function (response) {
                if (response.status == 'ok') {
                    _this.StateMachineList.next(_this.StateMachineList.getValue().map(function (stateMachine) {
                        if (stateMachine._id == data.machineId) {
                            stateMachine.states.map(function (state) {
                                state.handlers.splice(data.index, 1);
                                return state;
                            });
                        }
                        return stateMachine;
                    }));
                    _this.CasesList.next(_this.CasesList.getValue().map(function (Case) {
                        if (Case._id == data.caseId) {
                            Case.assignedTo = Case.assignedTo.filter(function (assigned) {
                                if (assigned.mid == data.machineId) {
                                    if (assigned.referenceCount > 1) {
                                        assigned.referenceCount -= 1;
                                        return assigned;
                                    }
                                }
                                else {
                                    return assigned.mid != data.machineId;
                                }
                            });
                        }
                        return Case;
                    }));
                    localStorage.setItem('chatBotMachines', JSON.stringify(_this.StateMachineList.getValue()));
                    localStorage.setItem('chatBotCases', JSON.stringify(_this.CasesList.getValue()));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Unable To Remove Handler");
                }
            }));
        });
    };
    ChatBotSettingsService.prototype.StartMachine = function (machineId) {
        this.socket.emit('StartMachine', { machineId: machineId }, (function (response) {
            if (response.status == 'ok') {
                // console.log(response.stateMachine);
            }
        }));
    };
    //#endregion
    //#region WorkFlows
    ChatBotSettingsService.prototype.AddWorkFlow = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addWorkflow', data, (function (response) {
                if (response.status == 'ok') {
                    if (response.status == 'ok') {
                        data._id = response.id;
                        _this.WorkFlowsList.getValue().unshift(data);
                        _this.WorkFlowsList.next(_this.WorkFlowsList.getValue());
                        observer.next(response);
                        observer.complete();
                    }
                    else if (response.status == 'exists') {
                        _this.WorkFlowsList.getValue().unshift(response.machine);
                        _this.WorkFlowsList.next(_this.WorkFlowsList.getValue());
                        observer.next(response);
                        observer.complete();
                    }
                    else {
                        observer.error("Can't Add State Machine");
                    }
                }
            }));
        });
    };
    ChatBotSettingsService.prototype.GetWorkFlows = function () {
        var _this = this;
        //this.fetchingMachines.next(true);
        if (!localStorage.getItem('chatBotWorkFlows')) {
            this.socket.emit('getWorkFlows', {}, (function (response) {
                //console.log(response);
                //this.fetchingMachines.next(false);
                if (response.status == 'ok') {
                    _this.WorkFlowsList.next(response.workFlows);
                    localStorage.setItem('chatBotWorkFlows', JSON.stringify(response.workFlows));
                }
            }));
        }
        else {
            var workFlows_1 = JSON.parse(localStorage.getItem('chatBotWorkFlows'));
            if (workFlows_1.length > 0) {
                this.socket.emit('getWorkFlows', { id: workFlows_1[0]._id }, (function (response) {
                    //this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        _this.WorkFlowsList.next(response.workFlows.concat(workFlows_1));
                        localStorage.setItem('chatBotWorkFlows', JSON.stringify(_this.WorkFlowsList.getValue()));
                    }
                }));
            }
            else {
                this.socket.emit('getWorkFlows', {}, (function (response) {
                    //this.fetchingMachines.next(false);
                    if (response.status == 'ok') {
                        _this.WorkFlowsList.next(response.workFlows);
                        localStorage.setItem('chatBotWorkFlows', JSON.stringify(response.workFlows));
                    }
                }));
            }
        }
    };
    ChatBotSettingsService.prototype.SubmitWorkFlow = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('submitWorkFlow', data, function (response) {
                if (response.status == 'ok') {
                    _this.WorkFlowsList.next(_this.WorkFlowsList.getValue().map(function (workflow) {
                        if (workflow._id == data._id) {
                            workflow.form = data.form;
                        }
                        return workflow;
                    }));
                    localStorage.setItem('chatBotWorkFlows', JSON.stringify(_this.WorkFlowsList.getValue()));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Can't Submit Form");
                }
            });
        });
    };
    ChatBotSettingsService.prototype.MakePrimary = function (id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('makePrimary', { _id: id }, function (response) {
                if (response.status == 'ok') {
                    _this.WorkFlowsList.next(_this.WorkFlowsList.getValue().map(function (workflow) {
                        if (workflow._id == id) {
                            workflow.primary = true;
                        }
                        else {
                            workflow.primary = false;
                        }
                        return;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error();
                }
            });
        });
    };
    ChatBotSettingsService = __decorate([
        core_1.Injectable()
    ], ChatBotSettingsService);
    return ChatBotSettingsService;
}());
exports.ChatBotSettingsService = ChatBotSettingsService;
//# sourceMappingURL=ChatBotSettings.js.map