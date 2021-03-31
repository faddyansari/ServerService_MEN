"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsAgentsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var analytics_agents_component_1 = require("../../pages/analytics/analytics-agents/analytics-agents.component");
var analytics_datebox_module_1 = require("./analytics-datebox.module");
var analytics_agentactivity_component_1 = require("../../pages/analytics/analytics-agents/analytics-agentactivity/analytics-agentactivity.component");
var analytics_agentscorecard_component_1 = require("../../pages/analytics/analytics-agents/analytics-agentscorecard/analytics-agentscorecard.component");
// import { AnalyticsDateboxComponent } from '../../pages/analytics/analytics-datebox/analytics-datebox.component';
var routes = [
    { path: '', children: [
            { path: '', redirectTo: 'activity' },
            { path: 'activity', component: analytics_agentactivity_component_1.AnalyticsAgentactivityComponent },
            { path: 'scorecard', component: analytics_agentscorecard_component_1.AnalyticsAgentscorecardComponent },
        ], component: analytics_agents_component_1.AnalyticsAgentComponent }
];
var AnalyticsAgentsModule = /** @class */ (function () {
    function AnalyticsAgentsModule() {
    }
    AnalyticsAgentsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                analytics_datebox_module_1.AnalyticsDateBoxModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                analytics_agents_component_1.AnalyticsAgentComponent,
                analytics_agentactivity_component_1.AnalyticsAgentactivityComponent,
                analytics_agentscorecard_component_1.AnalyticsAgentscorecardComponent
            ]
        })
    ], AnalyticsAgentsModule);
    return AnalyticsAgentsModule;
}());
exports.AnalyticsAgentsModule = AnalyticsAgentsModule;
//# sourceMappingURL=analytics-agents.module.js.map