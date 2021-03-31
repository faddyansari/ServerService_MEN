"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var KnowledgeBaseService = /** @class */ (function () {
    function KnowledgeBaseService(_socketService) {
        var _this = this;
        this._socketService = _socketService;
        this.subscriptions = [];
        this.requestState = new BehaviorSubject_1.BehaviorSubject(false);
        this.knowledgeBaseList = new BehaviorSubject_1.BehaviorSubject([]);
        this.fetching = new BehaviorSubject_1.BehaviorSubject(false);
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        }));
    }
    KnowledgeBaseService.prototype.AddKnowledgeBase = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.requestState.next(true);
            _this.socket.emit('addKnowledgeBase', data, function (response) {
                _this.requestState.next(false);
                // console.log(response);
                if (response.status == 'ok') {
                    if (data.type == 'news' || data.type == 'sla' || data.type == 'itp') {
                        _this.GetKnowledgeBase('documents');
                    }
                    else {
                        _this.GetKnowledgeBase(data.type);
                    }
                    observer.next(response);
                    observer.complete();
                }
                else if (response.status == 'exists') {
                    observer.next(response);
                    observer.complete();
                }
                else {
                    observer.error("Can't Add Case");
                }
            });
        });
    };
    KnowledgeBaseService.prototype.GetKnowledgeBase = function (type) {
        var _this = this;
        this.fetching.next(true);
        this.socket.emit('getKnowledgeBase', { type: type }, function (response) {
            // console.log(response);
            if (response.status == 'ok' && response.knowledgeBaseList.length) {
                _this.knowledgeBaseList.next(response.knowledgeBaseList);
            }
            else {
                _this.knowledgeBaseList.next([]);
            }
            _this.fetching.next(false);
        });
    };
    KnowledgeBaseService.prototype.RemoveKnowledgeBase = function (type, filename) {
        var _this = this;
        this.socket.emit('removeKnowledgeBase', { type: type, filename: filename }, function (response) {
            if (response.status == 'ok') {
                _this.knowledgeBaseList.next(response.knowledgeBaseList);
            }
        });
    };
    KnowledgeBaseService.prototype.ToggleActivate = function (type, filename, active) {
        var _this = this;
        this.socket.emit('toggleKnowledgeBase', { type: type, filename: filename, active: !active }, function (response) {
            if (response.status == 'ok') {
                _this.knowledgeBaseList.next(response.knowledgeBaseList);
            }
        });
    };
    KnowledgeBaseService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    KnowledgeBaseService = __decorate([
        core_1.Injectable()
    ], KnowledgeBaseService);
    return KnowledgeBaseService;
}());
exports.KnowledgeBaseService = KnowledgeBaseService;
//# sourceMappingURL=KnowledgeBase.js.map