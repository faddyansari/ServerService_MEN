"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldsService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var CustomFieldsService = /** @class */ (function () {
    function CustomFieldsService(_socketService, _authService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.subscriptions = [];
        this.CustomFields = new BehaviorSubject_1.BehaviorSubject([]);
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (data) {
            if (data) {
                _this.Socket = data;
                _this.GetFields();
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            if (agent) {
                _this.Agent = agent;
            }
        }));
    }
    CustomFieldsService.prototype.GetFields = function () {
        var _this = this;
        this.Socket.emit('getFields', {}, function (response) {
            if (response.status == 'ok')
                _this.CustomFields.next(response.fields);
            else
                _this.CustomFields.next([]);
        });
    };
    CustomFieldsService.prototype.UpdateFields = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            console.log(data.fields);
            _this.Socket.emit('updateFields', { fields: data.fields }, function (response) {
                console.log(response);
                if (response.status == 'ok') {
                    _this.CustomFields.next(response.fields);
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error(response);
                    observer.complete();
                }
            });
        });
    };
    CustomFieldsService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    CustomFieldsService = __decorate([
        core_1.Injectable()
    ], CustomFieldsService);
    return CustomFieldsService;
}());
exports.CustomFieldsService = CustomFieldsService;
//# sourceMappingURL=CustomFieldsService.js.map