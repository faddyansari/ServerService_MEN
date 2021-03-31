"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var crm_component_1 = require("../../pages/crm/crm.component");
var crm_details_component_1 = require("../../pages/crm/crm-details/crm-details.component");
var crm_list_component_1 = require("../../pages/crm/crm-list/crm-list.component");
var conversation_details_component_1 = require("../../pages/crm/conversation-details/conversation-details.component");
var conversation_list_component_1 = require("../../pages/crm/conversation-list/conversation-list.component");
var crm_stats_component_1 = require("../../pages/crm/crm-stats/crm-stats.component");
var crm_session_details_component_1 = require("../../pages/crm/crm-session-details/crm-session-details.component");
// import { CrmSchemaComponent } from '../../pages/crm/crm-schema/crm-schema.component';
var routes = [
    {
        path: '',
        component: crm_component_1.CrmComponent
    },
];
var CrmModule = /** @class */ (function () {
    function CrmModule() {
    }
    CrmModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                crm_component_1.CrmComponent,
                crm_details_component_1.CrmDetailsComponent,
                crm_list_component_1.CrmListComponent,
                conversation_details_component_1.ConversationDetailsComponent,
                conversation_list_component_1.ConversationListComponent,
                crm_stats_component_1.CrmStatsComponent,
                crm_session_details_component_1.CrmSessionDetailsComponent
                // CrmSchemaComponent
            ]
        })
    ], CrmModule);
    return CrmModule;
}());
exports.CrmModule = CrmModule;
//# sourceMappingURL=crm.module.js.map