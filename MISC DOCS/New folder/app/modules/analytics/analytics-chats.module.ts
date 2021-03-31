import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsChatsComponent } from '../../pages/analytics/analytics-chats/analytics-chats.component';
import { AnalyticsTotalchatsComponent } from '../../pages/analytics/analytics-chats/analytics-totalchats/analytics-totalchats.component';
import { AnalyticsChatdurationComponent } from '../../pages/analytics/analytics-chats/analytics-chatduration/analytics-chatduration.component';
import { AnalyticsDateBoxModule } from './analytics-datebox.module';
import { AnalyticsAgentfeedbackComponent } from '../../pages/analytics/analytics-chats/analytics-agentfeedback/analytics-agentfeedback.component';
import { AnalyticsAgentfcrComponent } from '../../pages/analytics/analytics-chats/analytics-agentfcr/analytics-agentfcr.component';
import { AnalyticsChatfirstresponseComponent } from '../../pages/analytics/analytics-chats/analytics-chatfirstresponse/analytics-chatfirstresponse.component';
import { AnalyticsMissedchatsComponent } from '../../pages/analytics/analytics-chats/analytics-missedchats/analytics-missedchats.component';
import { AnalyticsAvgresponsetimeComponent } from '../../pages/analytics/analytics-chats/analytics-avgresponsetime/analytics-avgresponsetime.component';
import { AnalyticsChatcustomdashboardComponent } from '../../pages/analytics/analytics-chats/analytics-chatcustomdashboard/analytics-chatcustomdashboard.component';

const routes: Routes = [
    {path:'', children:[
        {path: '', redirectTo:'totalchats'},
        {path:'totalchats', component: AnalyticsTotalchatsComponent},
        {path:'totalchatsnew', component: AnalyticsChatcustomdashboardComponent,},
        {path:'chatduration', component: AnalyticsChatdurationComponent},
        {path:'agentfeedback', component: AnalyticsAgentfeedbackComponent},
        {path:'experience', component: AnalyticsAgentfcrComponent},
        {path:'firstresponsetime', component: AnalyticsChatfirstresponseComponent},
        {path:'avgresponsetime', component: AnalyticsAvgresponsetimeComponent},
        {path:'missedchats', component: AnalyticsMissedchatsComponent},        
        // {path:'invites', component: AnalyticsInvitesComponent},        

    ], component: AnalyticsChatsComponent}
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
        AnalyticsTotalchatsComponent,
        AnalyticsChatdurationComponent,
        AnalyticsAgentfeedbackComponent,
        AnalyticsAgentfcrComponent,
        AnalyticsChatfirstresponseComponent,
        AnalyticsAvgresponsetimeComponent,
        AnalyticsMissedchatsComponent,
        // AnalyticsInvitesComponent,
        AnalyticsChatsComponent,
        AnalyticsChatcustomdashboardComponent
    ]
})
export class AnalyticsChatsModule {}