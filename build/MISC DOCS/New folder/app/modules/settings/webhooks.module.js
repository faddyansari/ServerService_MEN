"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var custom_script_component_1 = require("../../pages/settings/web-hooks/custom-script/custom-script.component");
var third_party_sync_component_1 = require("../../pages/settings/web-hooks/third-party-sync/third-party-sync.component");
var WebHookSettings_1 = require("../../../services/LocalServices/WebHookSettings");
var routes = [
    { path: '', redirectTo: 'script' },
    { path: 'script', component: custom_script_component_1.CustomScriptComponent },
    { path: 'thirdparty', component: third_party_sync_component_1.ThirdPartySyncComponent }
];
var WebhooksModule = /** @class */ (function () {
    function WebhooksModule() {
    }
    WebhooksModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            providers: [
                WebHookSettings_1.WebHookSettingsService
            ],
            declarations: [
                custom_script_component_1.CustomScriptComponent,
                third_party_sync_component_1.ThirdPartySyncComponent
            ]
        })
    ], WebhooksModule);
    return WebhooksModule;
}());
exports.WebhooksModule = WebhooksModule;
//# sourceMappingURL=webhooks.module.js.map