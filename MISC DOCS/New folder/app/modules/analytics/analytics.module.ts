import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from '../../pages/analytics/analytics.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
	{
		path: '',
        component: AnalyticsComponent,
        children: [
			{ path: 'analytics-visitors', loadChildren: './analytics-visitors.module#AnalyticsVisitorsModule' },
			{ path: 'analytics-agents', loadChildren: './analytics-agents.module#AnalyticsAgentsModule' },
			{ path: 'analytics-tickets', loadChildren: './analytics-tickets.module#AnalyticsTicketsModule' },
			{ path: 'analytics-chats', loadChildren: './analytics-chats.module#AnalyticsChatsModule' }
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
    ],
    exports:[
		RouterModule
	],
    declarations:[
		AnalyticsComponent
    ]
})

export class AnalyticsModule {}