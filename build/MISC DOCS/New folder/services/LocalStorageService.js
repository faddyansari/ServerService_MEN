"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
//End RxJs Imports
var LocalStorageService = /** @class */ (function () {
    function LocalStorageService() {
        var _this = this;
        this.tabId = new BehaviorSubject_1.BehaviorSubject('');
        this.status = new BehaviorSubject_1.BehaviorSubject(false);
        this.tabId = new BehaviorSubject_1.BehaviorSubject((Math.random() + Date.parse(new Date().toString())).toFixed().toString());
        window.addEventListener('storage', function (e) { _this.StorageEventListener(e); });
    }
    LocalStorageService.prototype.getTabId = function () {
        return this.tabId.asObservable();
    };
    LocalStorageService.prototype.getStatus = function () {
        return this.status.asObservable();
    };
    LocalStorageService.prototype.setTabId = function (value) {
        this.tabId.next(value);
    };
    LocalStorageService.prototype.setValue = function (key, crossTabSignal) {
        localStorage.setItem(key, this.tabId.getValue());
        if (crossTabSignal) {
            Observable_1.Observable.timer(1500).subscribe(function () {
                localStorage.removeItem(key);
            });
        }
    };
    LocalStorageService.prototype.getValue = function () {
    };
    LocalStorageService.prototype.StorageEventListener = function (e) {
        switch (e.key) {
            case 'logout':
                if (e.newValue != this.tabId.getValue() && e.newValue) {
                    console.log('Logout');
                    this.status.next(true);
                }
                break;
            case 'login':
                break;
        }
    };
    LocalStorageService = __decorate([
        core_1.Injectable()
    ], LocalStorageService);
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorageService.js.map