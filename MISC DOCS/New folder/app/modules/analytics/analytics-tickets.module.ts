import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsTicketsComponent } from '../../pages/analytics/analytics-tickets/analytics-tickets.component';
import { AnalyticsTicketresolutiontimeComponent } from '../../pages/analytics/analytics-tickets/analytics-ticketresolutiontime/analytics-ticketresolutiontime.component';
import { AnalyticsFirstticketresponseComponent } from '../../pages/analytics/analytics-tickets/analytics-firstticketresponse/analytics-firstticketresponse.component';
import { AnalyticsDateBoxModule } from './analytics-datebox.module';
import { AnalyticsTotalticketsComponent } from '../../pages/analytics/analytics-tickets/analytics-totaltickets/analytics-totaltickets.component';
import { AnalyticsTicketcustomdashboardComponent } from '../../pages/analytics/analytics-tickets/analytics-ticketcustomdashboard/analytics-ticketcustomdashboard.component';

const routes: Routes = [
    {path:'', children:[
        {path: '', redirectTo:'customdashboard'},
        {path: 'customdashboard', component: AnalyticsTicketcustomdashboardComponent},
        {path: 'totaltickets', component:AnalyticsTotalticketsComponent},
        {path: 'ticketresolutiontime', component:AnalyticsTicketresolutiontimeComponent},
        {path: 'firstticketresponse', component:AnalyticsFirstticketresponseComponent},
    ], component: AnalyticsTicketsComponent}
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
        AnalyticsTicketcustomdashboardComponent,
        AnalyticsTotalticketsComponent,
        AnalyticsTicketresolutiontimeComponent,
        AnalyticsFirstticketresponseComponent,
        AnalyticsTicketsComponent
    ]
})
export class AnalyticsTicketsModule {}