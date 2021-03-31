"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetSettingsService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var RulesetSettingsService = /** @class */ (function () {
    function RulesetSettingsService(_socketService, _authService, http, _utilityService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.http = http;
        this._utilityService = _utilityService;
        this.Addrule = new BehaviorSubject_1.BehaviorSubject(false);
        this.EditRule = new BehaviorSubject_1.BehaviorSubject(false);
        this.subscriptions = [];
        this.groupsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.agentsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.RulesList = new BehaviorSubject_1.BehaviorSubject([]);
        this.SelectedRule = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.Agent = undefined;
        this.ticketServiceURL = '';
        _authService.RestServiceURL.subscribe(function (url) {
            _this.ticketServiceURL = url + '/api/tickets';
        });
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            if (agent) {
                _this.Agent = agent;
            }
        }));
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
            _this.GetGroups();
            _this.GetRulesets();
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agentList) {
            _this.agentsList.next(agentList);
        }));
    }
    RulesetSettingsService.prototype.GetGroups = function () {
        var _this = this;
        this.socket.emit('getGroupByNSP', {}, function (response) {
            //console.log(response.rooms);
            if (response.status == 'ok') {
                _this.groupsList.next(response.group_data);
            }
        });
    };
    RulesetSettingsService.prototype.AddRuleSet = function (obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.ticketServiceURL + '/addRuleSet', { ruleset: obj, nsp: _this.Agent.nsp }).subscribe(function (response) {
                if (response.json()) {
                    var data = response.json();
                    if (data.status == 'ok') {
                        _this.RulesList.getValue().push(data.ruleset);
                        _this.RulesList.next(_this.RulesList.getValue());
                        _this.Addrule.next(false);
                    }
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    };
    RulesetSettingsService.prototype.GetRulesets = function () {
        var _this = this;
        this.socket.emit('getRuleset', {}, function (response) {
            if (response.status == 'ok') {
                _this.RulesList.next(response.rulesets);
                _this.Addrule.next(false);
            }
        });
    };
    RulesetSettingsService.prototype.GetRuleSetScheduler = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('getRulesetScheduler', {}, function (response) {
                if (response.status == 'ok') {
                    observer.next(response.scheduler);
                    observer.complete();
                }
                else {
                    observer.next(undefined);
                    observer.complete();
                }
            });
        });
    };
    RulesetSettingsService.prototype.SetRuleSetScheduler = function (scheduler) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setRulesetScheduler', { scheduler: scheduler }, function (response) {
                observer.next(response);
                observer.complete();
            });
        });
    };
    RulesetSettingsService.prototype.UpdateRulesets = function (id, obj) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateRuleSet', { id: id, ruleset: obj }, function (response) {
                if (response.status == 'ok') {
                    _this.RulesList.next(_this.RulesList.getValue().map(function (ruleset) {
                        if (ruleset._id == response.ruleset._id) {
                            ruleset = response.ruleset;
                        }
                        return ruleset;
                    }));
                    _this.SelectedRule.next(undefined);
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error({ status: 'error' });
            });
        });
    };
    RulesetSettingsService.prototype.DeleteRulesets = function (id) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('deleteRule', { id: id }, function (response) {
                if (response.status == 'ok') {
                    _this.RulesList.next(_this.RulesList.getValue().filter(function (ruleset) {
                        return (ruleset._id != id);
                    }));
                    observer.next(response);
                    observer.complete();
                }
                else
                    observer.error({ status: 'error' });
            });
        });
    };
    RulesetSettingsService.prototype.ToggleActivation = function (id, activation) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('toggleActivation', { id: id, activation: activation }, function (response) {
                if (response.status == 'ok') {
                    _this.RulesList.next(_this.RulesList.getValue().map(function (ruleset) {
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
    RulesetSettingsService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesetSettingsService = __decorate([
        core_1.Injectable()
    ], RulesetSettingsService);
    return RulesetSettingsService;
}());
exports.RulesetSettingsService = RulesetSettingsService;
//# sourceMappingURL=RulesetsService.js.map