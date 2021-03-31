import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


// import { BulkMarketingEmailComponent } from '../../pages/settings/bulk-marketing-email/bulk-marketing-email.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent,
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
			// { path: 'assignment-rules', loadChildren: './assignment-rule.module#ChatSettingsModule' }
		]
	}
];
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes),
	],
	exports: [RouterModule],
	declarations: [
		SettingsComponent
	]
})
export class SettingsModule { }