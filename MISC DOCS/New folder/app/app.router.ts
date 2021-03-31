import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentComponent } from './pages/agent/agent.component';
import { VisitorsComponent } from './pages/visitors/visitors.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { InstallationComponent } from './pages/installation/installation.component';
import { CallDialogComponent } from './dialogs/call-dialog/call-dialog.component';
import { MainAuthGuard } from '../services/MainAuthGuard';
import { NoaccessComponent } from './pages/noaccess/noaccess.component';
import { InternalSettingsGuard } from '../services/InternalSettingsGuard';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { NluComponent } from './pages/chatbot/nlu/nlu.component';
import { CoreComponent } from './pages/chatbot/core/core.component';
import { NluDataPrepComponent } from './pages/chatbot/nlu/data-prep/data-prep.component';
import { CoreDataPrepComponent } from './pages/chatbot/core/data-prep/data-prep.component';
import { NluTrainComponent } from './pages/chatbot/nlu/train/train.component';
import { CoreTrainComponent } from './pages/chatbot/core/train/train.component';

export const router: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [MainAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MainAuthGuard] },
  { path: 'agents', component: AgentComponent, canActivate: [MainAuthGuard] },
  // { path: 'analytics', loadChildren :'./modules/analytics/analytics.module#AnalyticsModule', canActivate: [MainAuthGuard] },
  { path: 'agents/:id', component: AgentComponent, canActivate: [MainAuthGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [MainAuthGuard] },
  { path: 'chats/:id', component: ChatsComponent, canActivate: [MainAuthGuard] },
  { path: 'tickets', loadChildren: './modules/tickets/tickets.module#TicketsModule', canActivate: [MainAuthGuard] },
  // { path: 'tickets/:id', loadChildren :'./modules/tickets/tickets.module#TicketsModule', canActivate: [MainAuthGuard] },
  { path: 'visitors', component: VisitorsComponent, canActivate: [MainAuthGuard] },
  { path: 'installation', component: InstallationComponent, canActivate: [MainAuthGuard] },
  { path: 'settings', loadChildren: './modules/settings/settings.module#SettingsModule', canActivate: [MainAuthGuard], canActivateChild: [InternalSettingsGuard] },
  { path: 'contacts', loadChildren: './modules/contacts/contacts.module#ContactsModule', canActivate: [MainAuthGuard] },
  { path: 'analytics', loadChildren: './modules/analytics/analytics.module#AnalyticsModule' },
  { path: 'chatbot', loadChildren: './modules/chatbot/chatbot.module#ChatbotModule' },
  { path: 'cdashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule' },
  { path: 'whatsapp', loadChildren: './modules/whatsapp/whatsapp.module#WhatsappModule', canActivate: [MainAuthGuard] },
  // {path: 'chatbot', component: ChatbotComponent},
  // {path: 'chatbot/nlu', component: NluComponent},
  // {path: 'chatbot/nlu/train', component: NluTrainComponent},
  // {path: 'chatbot/nlu/data-prep', component: NluDataPrepComponent},
  // {path: 'chatbot/core', component: CoreComponent},
  // {path: 'chatbot/core/data-prep', component: CoreDataPrepComponent},
  // {path: 'chatbot/core/train', component: CoreTrainComponent},
  // { path: 'knowledge-base', component: KnowledgeBaseComponent },
  { path: 'call/:data', component: CallDialogComponent },
  { path: 'crm', loadChildren: './modules/crm/crm.module#CrmModule', canActivate: [MainAuthGuard] },
  { path: 'noaccess', component: NoaccessComponent, canActivate: [MainAuthGuard] },
  { path: '**', redirectTo: '/home' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router, { onSameUrlNavigation: 'reload' });
