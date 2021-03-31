import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsUniquevisitorsComponent } from '../../pages/analytics/analytics-visitors/analytics-uniquevisitors/analytics-uniquevisitors.component';
import { AnalyticsVisitorsComponent } from '../../pages/analytics/analytics-visitors/analytics-visitors.component';
import { AnalyticsAvgwaittimeComponent } from '../../pages/analytics/analytics-visitors/analytics-avgwaittime/analytics-avgwaittime.component';
import { AnalyticsTotalvisitorsComponent } from '../../pages/analytics/analytics-visitors/analytics-totalvisitors/analytics-totalvisitors.component';
import { AnalyticsDateBoxModule } from './analytics-datebox.module';
import { AnalyticsReturningvisitorsComponent } from '../../pages/analytics/analytics-visitors/analytics-returningvisitors/analytics-returningvisitors.component';
import { AnalyticsInvitesComponent } from '../../pages/analytics/analytics-visitors/analytics-invites/analytics-invites.component';
import { AnalyticsTotalvisitorsNewComponent } from '../../pages/analytics/analytics-visitors/analytics-totalvisitors-new/analytics-totalvisitors-new.component';
import { AnalyticsRegvialivechatComponent } from '../../pages/analytics/analytics-visitors/analytics-regvialivechat/analytics-regvialivechat.component';
import { AnalyticsVisitorleftwithoutlivechatComponent } from '../../pages/analytics/analytics-visitors/analytics-visitorleftwithoutlivechat/analytics-visitorleftwithoutlivechat.component';
import { AnalyticsVisitorleftfromfirstpageComponent } from '../../pages/analytics/analytics-visitors/analytics-visitorleftfromfirstpage/analytics-visitorleftfromfirstpage.component';
import { AnalyticsReturnvisitorratioComponent } from '../../pages/analytics/analytics-visitors/analytics-returnvisitorratio/analytics-returnvisitorratio.component';

const routes: Routes = [
    {path:'', children:[
        {path: '', redirectTo:'totalVisitorsNew'},

        {path:'uniquevisitors', component: AnalyticsUniquevisitorsComponent},
        {path:'returningvisitors', component: AnalyticsReturningvisitorsComponent},
        {path:'avgwaittime', component: AnalyticsAvgwaittimeComponent},
        {path:'totalvisitors', component: AnalyticsTotalvisitorsComponent},
        {path:'totalVisitorsNew', component: AnalyticsTotalvisitorsNewComponent},
        {path:'totalRegViaLiveChat', component: AnalyticsRegvialivechatComponent},
        {path:'invites', component: AnalyticsInvitesComponent},
        {path:'visitorLeftFromFirstPage', component: AnalyticsVisitorleftfromfirstpageComponent},
        {path:'visitorLeftWithoutLiveChat', component: AnalyticsVisitorleftwithoutlivechatComponent},
        {path: 'returnVisitorRatio', component: AnalyticsReturnvisitorratioComponent}
    ], component: AnalyticsVisitorsComponent}
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
        AnalyticsUniquevisitorsComponent,
        AnalyticsAvgwaittimeComponent,
        AnalyticsTotalvisitorsComponent,
        AnalyticsInvitesComponent,
        AnalyticsReturningvisitorsComponent,
        AnalyticsVisitorsComponent,
        AnalyticsTotalvisitorsNewComponent,
        AnalyticsRegvialivechatComponent,
        AnalyticsVisitorleftwithoutlivechatComponent,
        AnalyticsVisitorleftfromfirstpageComponent,
        AnalyticsReturnvisitorratioComponent
    ]
})
export class AnalyticsVisitorsModule {}