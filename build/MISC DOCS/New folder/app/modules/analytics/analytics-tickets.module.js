"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTicketsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var analytics_tickets_component_1 = require("../../pages/analytics/analytics-tickets/analytics-tickets.component");
var analytics_ticketresolutiontime_component_1 = require("../../pages/analytics/analytics-tickets/analytics-ticketresolutiontime/analytics-ticketresolutiontime.component");
var analytics_firstticketresponse_component_1 = require("../../pages/analytics/analytics-tickets/analytics-firstticketresponse/analytics-firstticketresponse.component");
var analytics_datebox_module_1 = require("./analytics-datebox.module");
var analytics_totaltickets_component_1 = require("../../pages/analytics/analytics-tickets/analytics-totaltickets/analytics-totaltickets.component");
var analytics_ticketcustomdashboard_component_1 = require("../../pages/analytics/analytics-tickets/analytics-ticketcustomdashboard/analytics-ticketcustomdashboard.component");
var routes = [
    { path: '', children: [
            { path: '', redirectTo: 'customdashboard' },
            { path: 'customdashboard', component: analytics_ticketcustomdashboard_component_1.AnalyticsTicketcustomdashboardComponent },
            { path: 'totaltickets', component: analytics_totaltickets_component_1.AnalyticsTotalticketsComponent },
            { path: 'ticketresolutiontime', component: analytics_ticketresolutiontime_component_1.AnalyticsTicketresolutiontimeComponent },
            { path: 'firstticketresponse', component: analytics_firstticketresponse_component_1.AnalyticsFirstticketresponseComponent },
        ], component: analytics_tickets_component_1.AnalyticsTicketsComponent }
];
var AnalyticsTicketsModule = /** @class */ (function () {
    function AnalyticsTicketsModule() {
    }
    AnalyticsTicketsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                analytics_datebox_module_1.AnalyticsDateBoxModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                analytics_ticketcustomdashboard_component_1.AnalyticsTicketcustomdashboardComponent,
                analytics_totaltickets_component_1.AnalyticsTotalticketsComponent,
                analytics_ticketresolutiontime_component_1.AnalyticsTicketresolutiontimeComponent,
                analytics_firstticketresponse_component_1.AnalyticsFirstticketresponseComponent,
                analytics_tickets_component_1.AnalyticsTicketsComponent
            ]
        })
    ], AnalyticsTicketsModule);
    return AnalyticsTicketsModule;
}());
exports.AnalyticsTicketsModule = AnalyticsTicketsModule;
//# sourceMappingURL=analytics-tickets.module.js.map