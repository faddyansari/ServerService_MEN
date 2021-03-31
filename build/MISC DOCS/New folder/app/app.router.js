"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = exports.router = void 0;
var router_1 = require("@angular/router");
var agent_component_1 = require("./pages/agent/agent.component");
var visitors_component_1 = require("./pages/visitors/visitors.component");
var home_component_1 = require("./pages/home/home.component");
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var chats_component_1 = require("./pages/chats/chats.component");
var installation_component_1 = require("./pages/installation/installation.component");
var call_dialog_component_1 = require("./dialogs/call-dialog/call-dialog.component");
var MainAuthGuard_1 = require("../services/MainAuthGuard");
var noaccess_component_1 = require("./pages/noaccess/noaccess.component");
var InternalSettingsGuard_1 = require("../services/InternalSettingsGuard");
exports.router = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'agents', component: agent_component_1.AgentComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    // { path: 'analytics', loadChildren :'./modules/analytics/analytics.module#AnalyticsModule', canActivate: [MainAuthGuard] },
    { path: 'agents/:id', component: agent_component_1.AgentComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'chats', component: chats_component_1.ChatsComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'chats/:id', component: chats_component_1.ChatsComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'tickets', loadChildren: './modules/tickets/tickets.module#TicketsModule', canActivate: [MainAuthGuard_1.MainAuthGuard] },
    // { path: 'tickets/:id', loadChildren :'./modules/tickets/tickets.module#TicketsModule', canActivate: [MainAuthGuard] },
    { path: 'visitors', component: visitors_component_1.VisitorsComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'installation', component: installation_component_1.InstallationComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule', canActivate: [MainAuthGuard_1.MainAuthGuard], canActivateChild: [InternalSettingsGuard_1.InternalSettingsGuard] },
    { path: 'contacts', loadChildren: './modules/contacts/contacts.module#ContactsModule', canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'analytics', loadChildren: './modules/analytics/analytics.module#AnalyticsModule' },
    { path: 'chatbot', loadChildren: './modules/chatbot/chatbot.module#ChatbotModule' },
    { path: 'cdashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
    { path: 'whatsapp', loadChildren: './modules/whatsapp/whatsapp.module#WhatsappModule', canActivate: [MainAuthGuard_1.MainAuthGuard] },
    // {path: 'chatbot', component: ChatbotComponent},
    // {path: 'chatbot/nlu', component: NluComponent},
    // {path: 'chatbot/nlu/train', component: NluTrainComponent},
    // {path: 'chatbot/nlu/data-prep', component: NluDataPrepComponent},
    // {path: 'chatbot/core', component: CoreComponent},
    // {path: 'chatbot/core/data-prep', component: CoreDataPrepComponent},
    // {path: 'chatbot/core/train', component: CoreTrainComponent},
    // { path: 'knowledge-base', component: KnowledgeBaseComponent },
    { path: 'call/:data', component: call_dialog_component_1.CallDialogComponent },
    { path: 'crm', loadChildren: './modules/crm/crm.module#CrmModule', canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: 'noaccess', component: noaccess_component_1.NoaccessComponent, canActivate: [MainAuthGuard_1.MainAuthGuard] },
    { path: '**', redirectTo: '/home' }
];
exports.routes = router_1.RouterModule.forRoot(exports.router, { onSameUrlNavigation: 'reload' });
//# sourceMappingURL=app.router.js.map