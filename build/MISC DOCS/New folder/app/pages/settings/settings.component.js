"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsComponent = void 0;
var core_1 = require("@angular/core");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(_authService, _globalStateService, _location) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._location = _location;
        this.subscriptions = [];
        this.redirectURI = '';
        this.role = '';
        this.loadingNestedRouteConfig = false;
        this.production = false;
        this.nsp = '';
        this.sbt = false;
        this.routeLevel = 0;
        this.viewContentInfo = false;
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions.settings;
                // console.log(this.permissions);			
            }
            // //console.log(this.currAgent.level);
        }));
        this.subscriptions.push(_authService.Production.subscribe(function (production) {
            _this.production = production;
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(_globalStateService.contentInfo.subscribe(function (data) {
            _this.contentInfo = data;
        }));
        // this.subscriptions.push(_globalStateService.currentRoute.subscribe(data => {
        // 	console.log(data);
        // 	console.log(data.split('/'));
        // 	// this.breadCrumbLink = data;
        // }));
        this.subscriptions.push(_globalStateService.breadCrumbTitle.subscribe(function (data) {
            _this.breadCrumbTitle = data;
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            _this.nsp = agent.nsp;
            _this.role = agent.role;
        }));
        this._globalStateService.currentRoute.subscribe(function (route) {
            _this.currentRoute = route;
            setTimeout(function () {
                _this.routeLevel = _this.currentRoute.match(/\//g).length;
            }, 0);
            // console.log(route.split('/').filter(Boolean));
            _this.breadCrumbLinks = route.split('/').filter(Boolean);
            // console.log(this.routeLevel);
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
    SettingsComponent.prototype.ngOnInit = function () { };
    SettingsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    SettingsComponent.prototype.toggleInfoArea = function () {
        this.viewContentInfo = !this.viewContentInfo;
    };
    SettingsComponent.prototype.showSettingsMenu = function (link) {
        if (link) {
            this._globalStateService.setSettingsSelectedRoute(link);
        }
        else {
            this._globalStateService.setSettingsSelectedRoute('general');
        }
        this._globalStateService.setSettingsMenu(true);
    };
    SettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map