"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentAutomationSettingsService = void 0;
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var AssignmentAutomationSettingsService = /** @class */ (function () {
    function AssignmentAutomationSettingsService(_socketService, _authService) {
        //console.log('AssignmentAutomationSettingsService Initialized');
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.subscriptions = [];
        this.fetchingCases = new BehaviorSubject_1.BehaviorSubject(true);
        this.RulesList = new BehaviorSubject_1.BehaviorSubject([]);
        this.RuleSetList = new BehaviorSubject_1.BehaviorSubject([]);
        this.groupsList = new BehaviorSubject_1.BehaviorSubject([]);
        this.requestState = new BehaviorSubject_1.BehaviorSubject(false);
        this.filterKeys = new BehaviorSubject_1.BehaviorSubject([]);
        this.addingRule = new BehaviorSubject_1.BehaviorSubject(false);
        this.selectedRule = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.customFields = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.GetRules();
        this.GetRulesSets();
        this.GetGroups();
        this.GetChatWindowSettings();
    }
    AssignmentAutomationSettingsService.prototype.AddNewRule = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.requestState.next(true);
            _this.socket.emit('addAssignmentRule', data, function (response) {
                if (response.status == 'ok') {
                    _this.RulesList.getValue().unshift(response.rule);
                    _this.RulesList.next(_this.RulesList.getValue());
                    //console.log(response);
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error();
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.AddNewRuleSet = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.requestState.next(true);
            _this.socket.emit('addAssignmentRuleSet', data, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    if (response.ruleSet) {
                        _this.RuleSetList.getValue().unshift(response.ruleSet);
                        _this.RuleSetList.next(_this.RuleSetList.getValue());
                    }
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error();
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.GetChatWindowSettings = function () {
        var _this = this;
        if (!this.customFields.getValue()) {
            this.socket.emit('getDisplaySettings', {}, (function (response) {
                if (response.status == 'ok') {
                    _this.customFields.next(response.settings.settings.chatwindow.registerationForm.customFields);
                }
            }));
        }
    };
    AssignmentAutomationSettingsService.prototype.GetGroups = function () {
        var _this = this;
        this.socket.emit('getGroupByNSP', {}, function (response) {
            //console.log(response.rooms);
            if (response.status == 'ok') {
                _this.groupsList.next(response.group_data);
            }
        });
    };
    AssignmentAutomationSettingsService.prototype.UpdateRulesets = function (id, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateAssignmentRuleSet', { id: id, ruleset: obj }, function (response) {
                // console.log(response);
                if (response.status == 'ok') {
                    _this.RuleSetList.next(_this.RuleSetList.getValue().map(function (ruleset) {
                        if (ruleset._id == response.ruleset._id) {
                            ruleset = response.ruleset;
                        }
                        return ruleset;
                    }));
                    _this.selectedRule.next(undefined);
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error({ status: 'error' });
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.DeleteNewRule = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.requestState.next(true);
            _this.socket.emit('deleteAssignmentRule', data, function (response) {
                if (response.status == 'ok') {
                    _this.RuleSetList.next(_this.RuleSetList.getValue().filter(function (rule) {
                        return rule._id != data.id;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error();
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.GetRules = function () {
        var _this = this;
        this.fetchingCases.next(true);
        if (!localStorage.getItem('assignmentRules')) {
            this.socket.emit('getRules', {}, (function (response) {
                _this.fetchingCases.next(false);
                if (response.status == 'ok') {
                    //console.log(response);
                    _this.RulesList.next(response.rulesList);
                    localStorage.setItem('assignmentRules', JSON.stringify(response.rulesList));
                }
            }));
        }
        else {
            var rules_1 = JSON.parse(localStorage.getItem('assignmentRules'));
            if (rules_1.length > 0) {
                this.socket.emit('getRules', { id: rules_1[0]._id }, (function (response) {
                    _this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        _this.RulesList.next(response.rulesList.concat(rules_1));
                        localStorage.setItem('assignmentRules', JSON.stringify(_this.RulesList.getValue()));
                    }
                }));
            }
            else {
                this.socket.emit('getRules', {}, (function (response) {
                    _this.fetchingCases.next(false);
                    if (response.status == 'ok') {
                        //console.log(response);
                        _this.RulesList.next(response.rulesList);
                        localStorage.setItem('assignmentRules', JSON.stringify(response.rulesList));
                    }
                }));
            }
        }
    };
    AssignmentAutomationSettingsService.prototype.GetRulesSets = function () {
        var _this = this;
        this.fetchingCases.next(true);
        this.socket.emit('getAssignmentRuleSets', {}, (function (response) {
            _this.fetchingCases.next(false);
            if (response.status == 'ok') {
                // console.log(response);
                _this.RuleSetList.next(response.ruleSetList);
            }
        }));
    };
    AssignmentAutomationSettingsService.prototype.EditRule = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('editRule', data, function (response) {
                //console.log(response);
                if (response.status == 'ok') {
                    // this.RulesList.next(this.RulesList.getValue().map(Rule => {
                    //     if (Rule._id == response.rule.value._id) {
                    //         Rule = response.rule.value;
                    //     }
                    //     return Rule;
                    // }));
                    _this.RulesList.next(_this.RulesList.getValue().filter(function (rule) {
                        return rule._id != response.rule.value._id;
                    }));
                    _this.RulesList.getValue().unshift(response.rule.value);
                    _this.RulesList.next(_this.RulesList.getValue());
                    localStorage.setItem('chatBotCases', JSON.stringify(_this.RulesList.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.GetFilters = function (filterKey) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            //let filters = Object.keys(this.agent);
            _this.filterKeys.next([]);
            _this.socket.emit('getFiltersForAssignment', { nsp: _this.agent.nsp, filterKey: filterKey }, function (response) {
                if (response.filterKeys) {
                    _this.UpdateFilterKeys(response.filterKeys);
                    observer.next(true);
                    observer.complete();
                }
                else {
                    observer.next(false);
                }
            });
        });
    };
    AssignmentAutomationSettingsService.prototype.UpdateFilterKeys = function (collections) {
        var result = [];
        Object.keys(collections).map(function (key, index) {
            result = result.concat(Object.keys(collections[key]));
        });
        var unique = result.filter(function (item, pos) { return result.indexOf(item) == pos; });
        this.filterKeys.next([]);
        this.filterKeys.next(unique);
    };
    AssignmentAutomationSettingsService.prototype.ToggleActivation = function (id, activation) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('toggleAssignRuleSet', { id: id, activation: activation }, function (response) {
                if (response.status == 'ok') {
                    _this.RuleSetList.next(_this.RuleSetList.getValue().map(function (ruleset) {
                        if (ruleset._id == response.ruleset._id) {
                            ruleset = response.ruleset;
                        }
                        return ruleset;
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error({ status: 'error' });
            });
        });
    };
    AssignmentAutomationSettingsService = __decorate([
        core_1.Injectable()
    ], AssignmentAutomationSettingsService);
    return AssignmentAutomationSettingsService;
}());
exports.AssignmentAutomationSettingsService = AssignmentAutomationSettingsService;
//# sourceMappingURL=AssignmentRuleService.js.map