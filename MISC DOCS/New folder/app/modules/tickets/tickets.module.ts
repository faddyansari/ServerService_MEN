import { SlaExportComponent } from './../../dialogs/sla-export/sla-export.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TicketsComponent } from '../../pages/tickets/tickets.component';
import { SharedModule } from '../shared/shared.module';
import { TicketListComponent } from '../../pages/tickets/ticket-list/ticket-list.component';
import { TicketViewComponent } from '../../pages/tickets/ticket-view/ticket-view.component';
import { TicketTypesComponent } from '../../pages/tickets/ticket-types/ticket-types.component';
import { TagService } from '../../../services/TagService';
import { NgxSummernoteModule } from 'ngx-summernote';
import { MergeConfirmationComponent } from '../../dialogs/merge-confirmation/merge-confirmation.component';
import { QuickNoteComponent } from '../../dialogs/quick-note/quick-note.component';
import { QuickReplyComponent } from '../../dialogs/quick-reply/quick-reply.component';
import { ExportDataComponent } from '../../dialogs/export-data/export-data.component';
import { PrintTicketsComponent } from '../../pages/tickets/print-tickets/print-tickets.component';
import { BigImgComponent } from '../../dialogs/big-img/big-img.component';
import { AddTagComponent } from '../../dialogs/add-tag/add-tag.component';
import { TicketFiltersComponent } from '../../pages/tickets/ticket-filters/ticket-filters.component';
import { TicketMsgFormComponent } from '../../pages/tickets/ticket-msg-form/ticket-msg-form.component';
import { MessageAttachmentsComponent } from '../../pages/tickets/message-attachments/message-attachments.component';
import { TicketViewHistoryComponent } from '../../pages/tickets/ticket-view-history/ticket-view-history.component';
//import { FormDesignerService } from '../../../services/LocalServices/FormDesignerService';
import { TicketTasksComponent } from '../../pages/tickets/ticket-view-history/ticket-tasks/ticket-tasks.component';
import { TicketActionsComponent } from '../../pages/tickets/ticket-view-history/ticket-actions/ticket-actions.component';
import { TicketNotesComponent } from '../../pages/tickets/ticket-view-history/ticket-notes/ticket-notes.component';
import { TicketActivityLogComponent } from '../../pages/tickets/ticket-view-history/ticket-activity-log/ticket-activity-log.component';
import { TicketHistoryComponent } from '../../pages/tickets/ticket-view-history/ticket-history/ticket-history.component';
import { TicketBrowsingHistoryComponent } from '../../pages/tickets/ticket-view-history/ticket-browsing-history/ticket-browsing-history.component';
import { TicketMergedComponent } from '../../pages/tickets/ticket-view-history/ticket-merged/ticket-merged.component';
import { ActivatedPoliciesComponent } from '../../pages/tickets/ticket-view-history/activated-policies/activated-policies.component';
import { IconCustomerSearchComponent } from '../../pages/tickets/ticket-view-history/icon-customer-search/icon-customer-search.component';


const routes: Routes = [
    {
        path: '',
        component: TicketsComponent,
        children: [
            { path: '', redirectTo: 'list' },
            { path: 'list', component: TicketListComponent },
            { path: 'ticket-view/:id', component: TicketViewComponent }
        ],
        runGuardsAndResolvers: 'always'
    },
    // { path: 'automated-responses', component: AutomatedResponsesComponent}
];

@NgModule({
    imports: [
        CommonModule,
        NgxSummernoteModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    declarations: [
        TicketsComponent,
        TicketTypesComponent,
        TicketListComponent,
        TicketViewComponent,
        MergeConfirmationComponent,
        QuickNoteComponent,
        QuickReplyComponent,
        ExportDataComponent,
        SlaExportComponent,
        PrintTicketsComponent,
        AddTagComponent,
        BigImgComponent,
        TicketFiltersComponent,
        TicketMsgFormComponent,
        MessageAttachmentsComponent,
        TicketViewHistoryComponent,
        TicketActionsComponent,
        IconCustomerSearchComponent,
        TicketTasksComponent,
        TicketNotesComponent,
        TicketActivityLogComponent,
        TicketHistoryComponent,
        TicketBrowsingHistoryComponent,
        TicketMergedComponent,
        ActivatedPoliciesComponent      

    ],
    entryComponents: [
        MergeConfirmationComponent,
        QuickReplyComponent,
        AddTagComponent,
        QuickNoteComponent,
        ExportDataComponent,
        SlaExportComponent,
        BigImgComponent,
    ],
    providers: [
        TagService,
        //FormDesignerService
    ]
})

export class TicketsModule { }

