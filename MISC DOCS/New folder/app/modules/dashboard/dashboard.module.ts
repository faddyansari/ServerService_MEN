import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardAgentComponent } from '../../pages/cdashboard/dashboard-agent/dashboard-agent.component';
// import { CrmSchemaComponent } from '../../pages/crm/crm-schema/crm-schema.component';


const routes: Routes = [
	{
        path: '',
        children: [
			{ path: '', redirectTo: 'agents' },
			{ path: 'agents', component: DashboardAgentComponent },
		]
	},
];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        DashboardAgentComponent
    ]
})

export class DashboardModule {}

