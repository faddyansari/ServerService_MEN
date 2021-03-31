"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerationsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var integrations_facebook_component_1 = require("../../pages/settings/integrations/integrations-facebook/integrations-facebook.component");
var IntegrationsService_1 = require("../../../services/LocalServices/IntegrationsService");
var ngx_facebook_1 = require("ngx-facebook");
var facebook_rules_component_1 = require("../../pages/settings/integrations/integrations-facebook/facebook-rules/facebook-rules.component");
var routes = [
    { path: '', redirectTo: 'facebook' },
    { path: 'facebook', component: integrations_facebook_component_1.IntegrationsFacebookComponent }
];
var IntegerationsModule = /** @class */ (function () {
    function IntegerationsModule() {
    }
    IntegerationsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ngx_facebook_1.FacebookModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                integrations_facebook_component_1.IntegrationsFacebookComponent,
                facebook_rules_component_1.FacebookRulesComponent
            ],
            providers: [
                IntegrationsService_1.IntegrationsService,
                ngx_facebook_1.FacebookService
            ]
        })
    ], IntegerationsModule);
    return IntegerationsModule;
}());
exports.IntegerationsModule = IntegerationsModule;
//# sourceMappingURL=integerations.module.js.map