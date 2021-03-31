"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSettingsService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var GroupSettingsService = /** @class */ (function () {
    function GroupSettingsService(_socketService, _authService, _agentService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this._agentService = _agentService;
        this.groupsList = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.subscriptions = [];
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            // if (agent.role == 'admin') {
            //     this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            //         this.socket = socket;
            //         this.GetGroups();
            //     }));
            // }
            _this.subscriptions.push(_this._socketService.getSocket().subscribe(function (socket) {
                _this.socket = socket;
                _this.GetGroups();
            }));
        }));
    }
    GroupSettingsService.prototype.GetGroupsList = function () {
        return this.groupsList.asObservable();
    };
    GroupSettingsService.prototype.GetGroups = function () {
        var _this = this;
        this.socket.emit('getGroups', {}, function (response) {
            //console.log(response.rooms);
            if (response.status == 'ok') {
                _this.groupsList.next(response.groups[0].rooms);
            }
        });
    };
    GroupSettingsService.prototype.AddGroup = function (groupName) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addGroup', { groupName: groupName }, function (response) {
                if (response.status == 'ok') {
                    _this.groupsList.getValue()[groupName] = { isActive: false, Agents: [] };
                    _this.groupsList.next(_this.groupsList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            });
        });
    };
    GroupSettingsService.prototype.AddAgent = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('addAgentToGroup', data, function (response) {
                //console.log(response);
                if (response.status == 'ok') {
                    _this.groupsList.getValue()[data.groupName].Agents.push(data.agentEmail);
                    _this.groupsList.next(_this.groupsList.getValue());
                    _this._agentService.UpdateAgentGroup(data.agentEmail, data.groupName, true);
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            });
        });
    };
    GroupSettingsService.prototype.RemoveAgent = function (data) {
        var _this = this;
        //console.log('Removing Agent');
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('removeAgentFromGroup', data, function (response) {
                //console.log(response);
                if (response.status == 'ok') {
                    _this.groupsList.getValue()[data.groupName].Agents = _this.groupsList.getValue()[data.groupName].Agents.filter(function (agentEmail) {
                        return agentEmail != data.agentEmail;
                    });
                    _this.groupsList.next(_this.groupsList.getValue());
                    _this._agentService.UpdateAgentGroup(data.agentEmail, data.groupName, false);
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            });
        });
    };
    GroupSettingsService.prototype.ToggleGroup = function (data, isACtive) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit((isACtive) ? 'deactivateGroup' : 'activateGroup', data, function (response) {
                if (response.status == 'ok') {
                    _this.groupsList.getValue()[data.groupName].isActive = !isACtive;
                    _this.groupsList.next(_this.groupsList.getValue());
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                }
            });
        });
    };
    GroupSettingsService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    GroupSettingsService = __decorate([
        core_1.Injectable()
    ], GroupSettingsService);
    return GroupSettingsService;
}());
exports.GroupSettingsService = GroupSettingsService;
//# sourceMappingURL=GroupSettings.js.map