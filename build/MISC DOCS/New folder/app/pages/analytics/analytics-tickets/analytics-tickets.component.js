"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTicketsComponent = void 0;
var core_1 = require("@angular/core");
var AnalyticsTicketsComponent = /** @class */ (function () {
    function AnalyticsTicketsComponent(_authService) {
        var _this = this;
        this._authService = _authService;
        _authService.getAgent().subscribe(function (agent) {
            if (agent)
                _this.agent = agent;
        });
    }
    AnalyticsTicketsComponent.prototype.ngOnInit = function () {
    };
    AnalyticsTicketsComponent.prototype.ngAfterViewInit = function () {
    };
    AnalyticsTicketsComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-tickets',
            templateUrl: './analytics-tickets.component.html',
            styleUrls: ['./analytics-tickets.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsTicketsComponent);
    return AnalyticsTicketsComponent;
}());
exports.AnalyticsTicketsComponent = AnalyticsTicketsComponent;
//# sourceMappingURL=analytics-tickets.component.js.map