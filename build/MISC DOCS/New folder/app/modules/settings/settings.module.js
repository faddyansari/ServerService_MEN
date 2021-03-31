"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var settings_component_1 = require("../../pages/settings/settings.component");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
// import { BulkMarketingEmailComponent } from '../../pages/settings/bulk-marketing-email/bulk-marketing-email.component';
var routes = [
    {
        path: '',
        component: settings_component_1.SettingsComponent,
        children: [
            { path: '', redirectTo: 'general' },
            { path: 'general', loadChildren: './general.module#GeneralSettingsModule' },
            // { path: 'automated-responses', component: AutomatedResponsesComponent },
            { path: 'ticket-management', loadChildren: './ticket-management.module#TicketManagementModule' },
            { path: 'chat-settings', loadChildren: './chat-settings.module#ChatSettingsModule' },
            { path: 'call-settings', loadChildren: './call-settings.module#CallSettingsModule' },
            { path: 'contact-settings', loadChildren: './contact-settings.module#ContactSettingsModule' },
            { path: 'chat-window', loadChildren: './chat-window.module#ChatWindowModule' },
            { path: 'webhooks', loadChildren: './webhooks.module#WebhooksModule' },
            { path: 'integerations', loadChildren: './integerations.module#IntegerationsModule' },
            { path: 'knowledge-base', loadChildren: './knowledge-base.module#KnowledgeBaseModule' },
            { path: 'widget-marketing', loadChildren: './widget-marketing.module#WidgetMarketingModule' },
            { path: 'group-management', loadChildren: './group-management.module#GroupManagementModule' },
            { path: 'keyboard-shortcuts', loadChildren: './keyboard-shortcuts.module#KeyboardShortcutsModule' },
            { path: 'profile', loadChildren: './profile.module#ProfileModule' },
        ]
    }
];
var SettingsModule = /** @class */ (function () {
    function SettingsModule() {
    }
    SettingsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes),
            ],
            exports: [router_1.RouterModule],
            declarations: [
                settings_component_1.SettingsComponent
            ]
        })
    ], SettingsModule);
    return SettingsModule;
}());
exports.SettingsModule = SettingsModule;
//# sourceMappingURL=settings.module.js.map