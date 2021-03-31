"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var whatsapp_component_1 = require("../../pages/whatsapp/whatsapp.component");
var whatsapp_list_sidebar_component_1 = require("../../pages/whatsapp/whatsapp-list-sidebar/whatsapp-list-sidebar.component");
var whatsapp_messages_component_1 = require("../../pages/whatsapp/whatsapp-messages/whatsapp-messages.component");
var whatsapp_history_component_1 = require("../../pages/whatsapp/whatsapp-history/whatsapp-history.component");
var whatsapp_dialog_component_1 = require("../../dialogs/whatsapp-dialog/whatsapp-dialog.component");
var progress_loader_component_1 = require("../../progress-loader/progress-loader.component");
// import { Ng2TelInputModule } from 'ng2-tel-input';
var routes = [
    {
        path: '',
        component: whatsapp_component_1.WhatsappComponent,
    }
];
var WhatsappModule = /** @class */ (function () {
    function WhatsappModule() {
    }
    WhatsappModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes),
            ],
            exports: [
                router_1.RouterModule
            ],
            declarations: [
                whatsapp_component_1.WhatsappComponent,
                whatsapp_list_sidebar_component_1.WhatsappListSidebarComponent,
                whatsapp_messages_component_1.WhatsappMessagesComponent,
                whatsapp_history_component_1.WhatsappHistoryComponent,
                whatsapp_dialog_component_1.WhatsappDialogComponent,
                progress_loader_component_1.ProgressLoaderComponent
            ],
            entryComponents: [
                whatsapp_dialog_component_1.WhatsappDialogComponent
            ]
        })
    ], WhatsappModule);
    return WhatsappModule;
}());
exports.WhatsappModule = WhatsappModule;
//# sourceMappingURL=whatsapp.module.js.map