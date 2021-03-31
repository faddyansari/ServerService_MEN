"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupManagementModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var group_management_component_1 = require("../../pages/settings/group-management/group-management.component");
var routes = [
    { path: '', component: group_management_component_1.GroupManagementComponent }
];
var GroupManagementModule = /** @class */ (function () {
    function GroupManagementModule() {
    }
    GroupManagementModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                group_management_component_1.GroupManagementComponent
            ]
        })
    ], GroupManagementModule);
    return GroupManagementModule;
}());
exports.GroupManagementModule = GroupManagementModule;
//# sourceMappingURL=group-management.module.js.map