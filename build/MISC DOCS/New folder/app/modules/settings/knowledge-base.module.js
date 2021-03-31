"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var announcements_component_1 = require("../../pages/settings/knowledge-base/announcements/announcements.component");
var docunments_component_1 = require("../../pages/settings/knowledge-base/docunments/docunments.component");
var faqs_component_1 = require("../../pages/settings/knowledge-base/faqs/faqs.component");
var routes = [
    { path: '', redirectTo: 'kpi' },
    { path: 'kpi', component: announcements_component_1.AnnouncementsComponent },
    { path: 'documents', component: docunments_component_1.DocunmentsComponent },
    { path: 'faqs', component: faqs_component_1.FaqsComponent }
];
var KnowledgeBaseModule = /** @class */ (function () {
    function KnowledgeBaseModule() {
    }
    KnowledgeBaseModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                announcements_component_1.AnnouncementsComponent,
                docunments_component_1.DocunmentsComponent,
                faqs_component_1.FaqsComponent
            ]
        })
    ], KnowledgeBaseModule);
    return KnowledgeBaseModule;
}());
exports.KnowledgeBaseModule = KnowledgeBaseModule;
//# sourceMappingURL=knowledge-base.module.js.map