"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconIntegrationService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var IconIntegrationService = /** @class */ (function () {
    function IconIntegrationService(_socket, _authService, _notificationService, http) {
        var _this = this;
        this._notificationService = _notificationService;
        this.http = http;
        this.iconServiceURL = '';
        this.Agent = new BehaviorSubject_1.BehaviorSubject(undefined);
        if (this._notificationService.permission == 'default' || 'denied') {
            this._notificationService.requestPermission();
        }
        _socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
            }
        });
        _authService.getAgent().subscribe(function (data) {
            if (data) {
                _this.Agent.next(data);
            }
        });
        _authService.RestServiceURL.subscribe(function (url) {
            _this.iconServiceURL = url + '/api/icon';
        });
    }
    IconIntegrationService.prototype.GetSalesAgent = function (ID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.iconServiceURL + '/SalesAgent', { ID: ID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    IconIntegrationService.prototype.GetMasterData = function (ID) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            try {
                _this.http.post(_this.iconServiceURL + '/MasterData', { ID: ID }).subscribe(function (data) {
                    if (data.json()) {
                        var response = data.json();
                        //  console.log(response)
                        if (response.status == 'ok') {
                            observer.next(response.response);
                            observer.complete();
                        }
                        else {
                            observer.next([]);
                            observer.complete();
                        }
                    }
                }, function (err) {
                    console.log(err);
                    observer.next(false);
                    observer.complete();
                });
            }
            catch (error) {
                observer.next(false);
                observer.complete();
            }
        });
    };
    IconIntegrationService = __decorate([
        core_1.Injectable()
    ], IconIntegrationService);
    return IconIntegrationService;
}());
exports.IconIntegrationService = IconIntegrationService;
//# sourceMappingURL=IconIntegrationService.js.map