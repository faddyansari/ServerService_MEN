import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CrmComponent } from '../../pages/crm/crm.component';
import { CrmDetailsComponent } from '../../pages/crm/crm-details/crm-details.component';
import { CrmListComponent } from '../../pages/crm/crm-list/crm-list.component';
import { ConversationDetailsComponent } from '../../pages/crm/conversation-details/conversation-details.component';
import { ConversationListComponent } from '../../pages/crm/conversation-list/conversation-list.component';
import { CrmStatsComponent } from '../../pages/crm/crm-stats/crm-stats.component';
import { CrmSessionDetailsComponent } from '../../pages/crm/crm-session-details/crm-session-details.component';
// import { CrmSchemaComponent } from '../../pages/crm/crm-schema/crm-schema.component';


const routes: Routes = [
	{
		path: '',
        component: CrmComponent
	},
	// { path: 'automated-responses', component: AutomatedResponsesComponent}
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        CrmComponent,
        CrmDetailsComponent,
        CrmListComponent,
        ConversationDetailsComponent,
        ConversationListComponent,
        CrmStatsComponent,
        CrmSessionDetailsComponent
        // CrmSchemaComponent
    ]
})

export class CrmModule {}

