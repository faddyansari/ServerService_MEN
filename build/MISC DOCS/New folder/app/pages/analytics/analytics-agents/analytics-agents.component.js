"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAgentComponent = void 0;
var core_1 = require("@angular/core");
var AnalyticsAgentComponent = /** @class */ (function () {
    function AnalyticsAgentComponent() {
    }
    AnalyticsAgentComponent.prototype.ngOnInit = function () {
    };
    AnalyticsAgentComponent.prototype.ngAfterViewInit = function () {
    };
    AnalyticsAgentComponent = __decorate([
        core_1.Component({
            selector: 'app-analytics-agents',
            templateUrl: './analytics-agents.component.html',
            styleUrls: ['./analytics-agents.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AnalyticsAgentComponent);
    return AnalyticsAgentComponent;
}());
exports.AnalyticsAgentComponent = AnalyticsAgentComponent;
//# sourceMappingURL=analytics-agents.component.js.map