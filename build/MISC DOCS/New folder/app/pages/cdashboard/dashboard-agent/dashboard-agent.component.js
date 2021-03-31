"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAgentComponent = void 0;
var core_1 = require("@angular/core");
var DashboardAgentComponent = /** @class */ (function () {
    function DashboardAgentComponent() {
    }
    DashboardAgentComponent.prototype.ngOnInit = function () {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
    };
    DashboardAgentComponent.prototype.dateFormatter = function (d) {
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
    };
    DashboardAgentComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard-agent',
            templateUrl: './dashboard-agent.component.html',
            styleUrls: ['./dashboard-agent.component.scss']
        })
    ], DashboardAgentComponent);
    return DashboardAgentComponent;
}());
exports.DashboardAgentComponent = DashboardAgentComponent;
//# sourceMappingURL=dashboard-agent.component.js.map