"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketManagementComponent = void 0;
var core_1 = require("@angular/core");
var TicketManagementComponent = /** @class */ (function () {
    function TicketManagementComponent(_globalStateServie, _authService) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this.subscriptions = [];
        // console.log('Ticket Management Component');
        // console.log(_globalStateServie.currentRoute);
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.tickets;
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            if (agent)
                _this.agent = agent;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions.settings.ticketManagement;
                // console.log(this.permissions);			
            }
        }));
    }
    TicketManagementComponent.prototype.ngOnInit = function () {
    };
    TicketManagementComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    TicketManagementComponent.prototype.setActiveTab = function (state) {
        this.activeTab = state;
    };
    TicketManagementComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.Input()
    ], TicketManagementComponent.prototype, "activeTab", void 0);
    TicketManagementComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-management',
            templateUrl: './ticket-management.component.html',
            styleUrls: ['./ticket-management.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketManagementComponent);
    return TicketManagementComponent;
}());
exports.TicketManagementComponent = TicketManagementComponent;
//# sourceMappingURL=ticket-management.component.js.map