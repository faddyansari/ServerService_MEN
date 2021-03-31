"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(_chatService, _appStateService, _visitorService, _authService, _ticketService) {
        var _this = this;
        this._chatService = _chatService;
        this._appStateService = _appStateService;
        this._visitorService = _visitorService;
        this._authService = _authService;
        this._ticketService = _ticketService;
        this.subscription = [];
        this.daysRemaining = 0;
        this.unlimited = false;
        this.verified = true;
        this.sbt = false;
        this.subscription.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions;
                // console.log(this.permissions);			
            }
        }));
        this.subscription.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg;
            }
        }));
        this.subscription.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
            _this.role = data.role;
            if (_this.agent) {
            }
        }));
        this.subscription.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscription.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length) {
                _this.verified = settings.verified;
                (settings && settings.expiry != 'unlimited') ? _this.daysRemaining = Math.floor((Date.parse(new Date(settings.expiry).toISOString()) - Date.parse(new Date().toISOString())) / 1000 / 60 / 60 / 24) : _this.unlimited = true;
            }
            //console.log(data);
        }));
    }
    HomeComponent.prototype.dateChanged = function (event) {
        console.log(event);
    };
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscription.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map