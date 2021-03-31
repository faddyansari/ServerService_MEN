"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsComponent = void 0;
var core_1 = require("@angular/core");
var AnalyticsComponent = /** @class */ (function () {
    function AnalyticsComponent(_authService, _globalStateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this.subscriptions = [];
        this.redirectURI = '';
        this.loadingNestedRouteConfig = false;
        this.role = '';
        this.viewContentInfo = false;
        this.package = undefined;
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.analytics;
                if (!_this.package.allowed) {
                    _this._globalStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            _this.role = agent.role;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.analytics;
            }
        }));
        this._globalStateService.currentRoute.subscribe(function (route) {
            _this.currentRoute = route;
            // console.log(this.currentRoute);
        });
        this._globalStateService.loadingNestedRouteConfig.subscribe(function (data) {
            _this.loadingNestedRouteConfig = data;
            // console.log('LoadingNestedRoute: '+ data);
            // console.log(this.currentRoute);
        });
        this.subscriptions.push(_authService.GetRedirectionURI().subscribe(function (data) {
            _this.redirectURI = data;
        }));
    }
    AnalyticsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AnalyticsComponent.prototype.displayTab = function () {
        if (this.currentRoute && this.currentRoute.includes('/analytics')) {
            return true;
        }
        else {
            return false;
        }
    };
    AnalyticsComponent.prototype.toggleInfoArea = function () {
        this.viewContentInfo = !this.viewContentInfo;
    };
    AnalyticsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    AnalyticsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics',
            templateUrl: './analytics.component.html',
            styleUrls: ['./analytics.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsComponent);
    return AnalyticsComponent;
}());
exports.AnalyticsComponent = AnalyticsComponent;
//# sourceMappingURL=analytics.component.js.map