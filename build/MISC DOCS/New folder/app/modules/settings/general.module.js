"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralSettingsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var ngx_summernote_1 = require("ngx-summernote");
var automated_responses_component_1 = require("../../pages/settings/automated-responses/automated-responses.component");
var roles_and_permissions_component_1 = require("../../pages/settings/roles-and-permissions/roles-and-permissions.component");
var new_role_dialog_component_1 = require("../../dialogs/new-role-dialog/new-role-dialog.component");
var RolesAndPermissionsService_1 = require("../../../services/RolesAndPermissionsService");
var auth_settings_component_1 = require("../../pages/settings/auth-settings/auth-settings.component");
var keyboard_shortcuts_component_1 = require("../../pages/settings/keyboard-shortcuts/keyboard-shortcuts.component");
var ticket_response_component_1 = require("../../pages/settings/ticket-management/ticket-response/ticket-response.component");
var routes = [
    { path: '', redirectTo: 'automated-responses' },
    { path: 'automated-responses', component: automated_responses_component_1.AutomatedResponsesComponent },
    { path: 'roles-and-permissions', component: roles_and_permissions_component_1.RolesAndPermissionsComponent },
    { path: 'auth-settings', component: auth_settings_component_1.AuthSettingsComponent },
    { path: 'keyboard-shortcuts', component: keyboard_shortcuts_component_1.KeyboardShortcutsComponent },
    { path: 'response', component: ticket_response_component_1.TicketResponseComponent },
];
var GeneralSettingsModule = /** @class */ (function () {
    function GeneralSettingsModule() {
    }
    GeneralSettingsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                ngx_summernote_1.NgxSummernoteModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                automated_responses_component_1.AutomatedResponsesComponent,
                roles_and_permissions_component_1.RolesAndPermissionsComponent,
                auth_settings_component_1.AuthSettingsComponent,
                new_role_dialog_component_1.NewRoleDialogComponent,
                keyboard_shortcuts_component_1.KeyboardShortcutsComponent,
                ticket_response_component_1.TicketResponseComponent
            ],
            providers: [
                RolesAndPermissionsService_1.RolesAndPermissionsService,
            ],
            entryComponents: [
                new_role_dialog_component_1.NewRoleDialogComponent
            ]
        })
    ], GeneralSettingsModule);
    return GeneralSettingsModule;
}());
exports.GeneralSettingsModule = GeneralSettingsModule;
//# sourceMappingURL=general.module.js.map