import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnnouncementsComponent } from '../../pages/settings/knowledge-base/announcements/announcements.component';
import { DocunmentsComponent } from '../../pages/settings/knowledge-base/docunments/docunments.component';
import { FaqsComponent } from '../../pages/settings/knowledge-base/faqs/faqs.component';



const routes: Routes = [
    {path: '', redirectTo: 'kpi'},
    {path: 'kpi', component: AnnouncementsComponent},
    {path: 'documents', component: DocunmentsComponent},
    {path: 'faqs', component: FaqsComponent}
];

@NgModule({
    imports:[
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports:[RouterModule],
    declarations:[
        AnnouncementsComponent,
        DocunmentsComponent,
        FaqsComponent
    ]
})
export class KnowledgeBaseModule {}