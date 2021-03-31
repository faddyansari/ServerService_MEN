"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var contacts_component_1 = require("../../pages/contacts/contacts.component");
var contact_list_sidebar_component_1 = require("../../pages/contacts/contact-list-sidebar/contact-list-sidebar.component");
var contacts_nav_component_1 = require("../../pages/contacts/contacts-nav/contacts-nav.component");
var contact_chat_component_1 = require("../../pages/contacts/contact-chat/contact-chat.component");
var conv_list_sidebar_component_1 = require("../../pages/contacts/conv-list-sidebar/conv-list-sidebar.component");
var shared_module_1 = require("../shared/shared.module");
var routes = [
    {
        path: '',
        component: contacts_component_1.ContactsComponent
    },
];
var ContactsModule = /** @class */ (function () {
    function ContactsModule() {
    }
    ContactsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                contacts_component_1.ContactsComponent,
                contact_list_sidebar_component_1.ContactListSidebarComponent,
                contacts_nav_component_1.ContactsNavComponent,
                contact_chat_component_1.ContactChatComponent,
                conv_list_sidebar_component_1.ConvListSidebarComponent
            ]
        })
    ], ContactsModule);
    return ContactsModule;
}());
exports.ContactsModule = ContactsModule;
//# sourceMappingURL=contacts.module.js.map