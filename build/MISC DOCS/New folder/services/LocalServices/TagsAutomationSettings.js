"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsAutomationSettings = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var TagsAutomationSettings = /** @class */ (function () {
    function TagsAutomationSettings(_socketService, _authService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.auto_assign = new BehaviorSubject_1.BehaviorSubject(false);
        this.groupsAutomationSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.subscriptions = [];
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            // if (agent.role == 'admin') {
            // }
            _this.subscriptions.push(_this._socketService.getSocket().subscribe(function (socket) {
                _this.socket = socket;
                _this.getGroupsAutomationSettings();
            }));
        }));
    }
    TagsAutomationSettings.prototype.getAutoAssign = function () {
        return this.auto_assign.asObservable();
    };
    TagsAutomationSettings.prototype.getGroupsAutomationSettings = function () {
        var _this = this;
        this.socket.emit('getGroupsAutomationSettings', {}, function (response) {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                // console.log("resposne tagauto",response);
                _this.groupsAutomationSettings.next(response.groupsAutomationSettings);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });
    };
    TagsAutomationSettings.prototype.getTagSettings = function () {
        return this.groupsAutomationSettings.asObservable();
    };
    TagsAutomationSettings.prototype.SetAutoAssign = function (auto_assign) {
        var _this = this;
        // console.log("here",auto_assign);
        this.socket.emit('setAutoAssign', { auto_assign: auto_assign }, function (response) {
            if (response.status == 'ok') {
                // console.log(response);
                _this.groupsAutomationSettings.next(response.groupsAutomationSettings);
                // console.log(this.groupsAutomationSettings);
            }
            else {
                console.log('error');
            }
        });
    };
    TagsAutomationSettings.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TagsAutomationSettings = __decorate([
        core_1.Injectable()
    ], TagsAutomationSettings);
    return TagsAutomationSettings;
}());
exports.TagsAutomationSettings = TagsAutomationSettings;
//# sourceMappingURL=TagsAutomationSettings.js.map