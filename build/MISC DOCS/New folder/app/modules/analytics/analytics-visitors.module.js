"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsVisitorsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var analytics_uniquevisitors_component_1 = require("../../pages/analytics/analytics-visitors/analytics-uniquevisitors/analytics-uniquevisitors.component");
var analytics_visitors_component_1 = require("../../pages/analytics/analytics-visitors/analytics-visitors.component");
var analytics_avgwaittime_component_1 = require("../../pages/analytics/analytics-visitors/analytics-avgwaittime/analytics-avgwaittime.component");
var analytics_totalvisitors_component_1 = require("../../pages/analytics/analytics-visitors/analytics-totalvisitors/analytics-totalvisitors.component");
var analytics_datebox_module_1 = require("./analytics-datebox.module");
var analytics_returningvisitors_component_1 = require("../../pages/analytics/analytics-visitors/analytics-returningvisitors/analytics-returningvisitors.component");
var analytics_invites_component_1 = require("../../pages/analytics/analytics-visitors/analytics-invites/analytics-invites.component");
var analytics_totalvisitors_new_component_1 = require("../../pages/analytics/analytics-visitors/analytics-totalvisitors-new/analytics-totalvisitors-new.component");
var analytics_regvialivechat_component_1 = require("../../pages/analytics/analytics-visitors/analytics-regvialivechat/analytics-regvialivechat.component");
var analytics_visitorleftwithoutlivechat_component_1 = require("../../pages/analytics/analytics-visitors/analytics-visitorleftwithoutlivechat/analytics-visitorleftwithoutlivechat.component");
var analytics_visitorleftfromfirstpage_component_1 = require("../../pages/analytics/analytics-visitors/analytics-visitorleftfromfirstpage/analytics-visitorleftfromfirstpage.component");
var analytics_returnvisitorratio_component_1 = require("../../pages/analytics/analytics-visitors/analytics-returnvisitorratio/analytics-returnvisitorratio.component");
var routes = [
    { path: '', children: [
            { path: '', redirectTo: 'totalVisitorsNew' },
            { path: 'uniquevisitors', component: analytics_uniquevisitors_component_1.AnalyticsUniquevisitorsComponent },
            { path: 'returningvisitors', component: analytics_returningvisitors_component_1.AnalyticsReturningvisitorsComponent },
            { path: 'avgwaittime', component: analytics_avgwaittime_component_1.AnalyticsAvgwaittimeComponent },
            { path: 'totalvisitors', component: analytics_totalvisitors_component_1.AnalyticsTotalvisitorsComponent },
            { path: 'totalVisitorsNew', component: analytics_totalvisitors_new_component_1.AnalyticsTotalvisitorsNewComponent },
            { path: 'totalRegViaLiveChat', component: analytics_regvialivechat_component_1.AnalyticsRegvialivechatComponent },
            { path: 'invites', component: analytics_invites_component_1.AnalyticsInvitesComponent },
            { path: 'visitorLeftFromFirstPage', component: analytics_visitorleftfromfirstpage_component_1.AnalyticsVisitorleftfromfirstpageComponent },
            { path: 'visitorLeftWithoutLiveChat', component: analytics_visitorleftwithoutlivechat_component_1.AnalyticsVisitorleftwithoutlivechatComponent },
            { path: 'returnVisitorRatio', component: analytics_returnvisitorratio_component_1.AnalyticsReturnvisitorratioComponent }
        ], component: analytics_visitors_component_1.AnalyticsVisitorsComponent }
];
var AnalyticsVisitorsModule = /** @class */ (function () {
    function AnalyticsVisitorsModule() {
    }
    AnalyticsVisitorsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                analytics_datebox_module_1.AnalyticsDateBoxModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                analytics_uniquevisitors_component_1.AnalyticsUniquevisitorsComponent,
                analytics_avgwaittime_component_1.AnalyticsAvgwaittimeComponent,
                analytics_totalvisitors_component_1.AnalyticsTotalvisitorsComponent,
                analytics_invites_component_1.AnalyticsInvitesComponent,
                analytics_returningvisitors_component_1.AnalyticsReturningvisitorsComponent,
                analytics_visitors_component_1.AnalyticsVisitorsComponent,
                analytics_totalvisitors_new_component_1.AnalyticsTotalvisitorsNewComponent,
                analytics_regvialivechat_component_1.AnalyticsRegvialivechatComponent,
                analytics_visitorleftwithoutlivechat_component_1.AnalyticsVisitorleftwithoutlivechatComponent,
                analytics_visitorleftfromfirstpage_component_1.AnalyticsVisitorleftfromfirstpageComponent,
                analytics_returnvisitorratio_component_1.AnalyticsReturnvisitorratioComponent
            ]
        })
    ], AnalyticsVisitorsModule);
    return AnalyticsVisitorsModule;
}());
exports.AnalyticsVisitorsModule = AnalyticsVisitorsModule;
//# sourceMappingURL=analytics-visitors.module.js.map