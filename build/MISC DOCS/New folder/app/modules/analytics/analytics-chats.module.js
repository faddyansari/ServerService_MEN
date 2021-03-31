"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsChatsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var analytics_chats_component_1 = require("../../pages/analytics/analytics-chats/analytics-chats.component");
var analytics_totalchats_component_1 = require("../../pages/analytics/analytics-chats/analytics-totalchats/analytics-totalchats.component");
var analytics_chatduration_component_1 = require("../../pages/analytics/analytics-chats/analytics-chatduration/analytics-chatduration.component");
var analytics_datebox_module_1 = require("./analytics-datebox.module");
var analytics_agentfeedback_component_1 = require("../../pages/analytics/analytics-chats/analytics-agentfeedback/analytics-agentfeedback.component");
var analytics_agentfcr_component_1 = require("../../pages/analytics/analytics-chats/analytics-agentfcr/analytics-agentfcr.component");
var analytics_chatfirstresponse_component_1 = require("../../pages/analytics/analytics-chats/analytics-chatfirstresponse/analytics-chatfirstresponse.component");
var analytics_missedchats_component_1 = require("../../pages/analytics/analytics-chats/analytics-missedchats/analytics-missedchats.component");
var analytics_avgresponsetime_component_1 = require("../../pages/analytics/analytics-chats/analytics-avgresponsetime/analytics-avgresponsetime.component");
var analytics_chatcustomdashboard_component_1 = require("../../pages/analytics/analytics-chats/analytics-chatcustomdashboard/analytics-chatcustomdashboard.component");
var routes = [
    { path: '', children: [
            { path: '', redirectTo: 'totalchats' },
            { path: 'totalchats', component: analytics_totalchats_component_1.AnalyticsTotalchatsComponent },
            { path: 'totalchatsnew', component: analytics_chatcustomdashboard_component_1.AnalyticsChatcustomdashboardComponent, },
            { path: 'chatduration', component: analytics_chatduration_component_1.AnalyticsChatdurationComponent },
            { path: 'agentfeedback', component: analytics_agentfeedback_component_1.AnalyticsAgentfeedbackComponent },
            { path: 'experience', component: analytics_agentfcr_component_1.AnalyticsAgentfcrComponent },
            { path: 'firstresponsetime', component: analytics_chatfirstresponse_component_1.AnalyticsChatfirstresponseComponent },
            { path: 'avgresponsetime', component: analytics_avgresponsetime_component_1.AnalyticsAvgresponsetimeComponent },
            { path: 'missedchats', component: analytics_missedchats_component_1.AnalyticsMissedchatsComponent },
        ], component: analytics_chats_component_1.AnalyticsChatsComponent }
];
var AnalyticsChatsModule = /** @class */ (function () {
    function AnalyticsChatsModule() {
    }
    AnalyticsChatsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                analytics_datebox_module_1.AnalyticsDateBoxModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                analytics_totalchats_component_1.AnalyticsTotalchatsComponent,
                analytics_chatduration_component_1.AnalyticsChatdurationComponent,
                analytics_agentfeedback_component_1.AnalyticsAgentfeedbackComponent,
                analytics_agentfcr_component_1.AnalyticsAgentfcrComponent,
                analytics_chatfirstresponse_component_1.AnalyticsChatfirstresponseComponent,
                analytics_avgresponsetime_component_1.AnalyticsAvgresponsetimeComponent,
                analytics_missedchats_component_1.AnalyticsMissedchatsComponent,
                // AnalyticsInvitesComponent,
                analytics_chats_component_1.AnalyticsChatsComponent,
                analytics_chatcustomdashboard_component_1.AnalyticsChatcustomdashboardComponent
            ]
        })
    ], AnalyticsChatsModule);
    return AnalyticsChatsModule;
}());
exports.AnalyticsChatsModule = AnalyticsChatsModule;
//# sourceMappingURL=analytics-chats.module.js.map