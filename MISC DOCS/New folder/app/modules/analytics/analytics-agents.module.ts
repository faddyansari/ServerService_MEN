import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsAgentComponent } from '../../pages/analytics/analytics-agents/analytics-agents.component';
import { AnalyticsDateBoxModule } from './analytics-datebox.module';
import { AnalyticsAgentactivityComponent } from '../../pages/analytics/analytics-agents/analytics-agentactivity/analytics-agentactivity.component';
import { AnalyticsAgentscorecardComponent } from '../../pages/analytics/analytics-agents/analytics-agentscorecard/analytics-agentscorecard.component';
// import { AnalyticsDateboxComponent } from '../../pages/analytics/analytics-datebox/analytics-datebox.component';

const routes: Routes = [
    {path:'', children:[
        {path: '', redirectTo:'activity'},
        {path: 'activity', component: AnalyticsAgentactivityComponent},
        {path: 'scorecard', component: AnalyticsAgentscorecardComponent},
    ], component: AnalyticsAgentComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        AnalyticsDateBoxModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        AnalyticsAgentComponent,
        AnalyticsAgentactivityComponent,
        AnalyticsAgentscorecardComponent
    ]
})
export class AnalyticsAgentsModule {}