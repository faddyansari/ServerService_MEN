"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsModule = void 0;
var sla_export_component_1 = require("./../../dialogs/sla-export/sla-export.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var tickets_component_1 = require("../../pages/tickets/tickets.component");
var shared_module_1 = require("../shared/shared.module");
var ticket_list_component_1 = require("../../pages/tickets/ticket-list/ticket-list.component");
var ticket_view_component_1 = require("../../pages/tickets/ticket-view/ticket-view.component");
var ticket_types_component_1 = require("../../pages/tickets/ticket-types/ticket-types.component");
var TagService_1 = require("../../../services/TagService");
var ngx_summernote_1 = require("ngx-summernote");
var merge_confirmation_component_1 = require("../../dialogs/merge-confirmation/merge-confirmation.component");
var quick_note_component_1 = require("../../dialogs/quick-note/quick-note.component");
var quick_reply_component_1 = require("../../dialogs/quick-reply/quick-reply.component");
var export_data_component_1 = require("../../dialogs/export-data/export-data.component");
var print_tickets_component_1 = require("../../pages/tickets/print-tickets/print-tickets.component");
var big_img_component_1 = require("../../dialogs/big-img/big-img.component");
var add_tag_component_1 = require("../../dialogs/add-tag/add-tag.component");
var ticket_filters_component_1 = require("../../pages/tickets/ticket-filters/ticket-filters.component");
var ticket_msg_form_component_1 = require("../../pages/tickets/ticket-msg-form/ticket-msg-form.component");
var message_attachments_component_1 = require("../../pages/tickets/message-attachments/message-attachments.component");
var ticket_view_history_component_1 = require("../../pages/tickets/ticket-view-history/ticket-view-history.component");
//import { FormDesignerService } from '../../../services/LocalServices/FormDesignerService';
var ticket_tasks_component_1 = require("../../pages/tickets/ticket-view-history/ticket-tasks/ticket-tasks.component");
var ticket_actions_component_1 = require("../../pages/tickets/ticket-view-history/ticket-actions/ticket-actions.component");
var ticket_notes_component_1 = require("../../pages/tickets/ticket-view-history/ticket-notes/ticket-notes.component");
var ticket_activity_log_component_1 = require("../../pages/tickets/ticket-view-history/ticket-activity-log/ticket-activity-log.component");
var ticket_history_component_1 = require("../../pages/tickets/ticket-view-history/ticket-history/ticket-history.component");
var ticket_browsing_history_component_1 = require("../../pages/tickets/ticket-view-history/ticket-browsing-history/ticket-browsing-history.component");
var ticket_merged_component_1 = require("../../pages/tickets/ticket-view-history/ticket-merged/ticket-merged.component");
var activated_policies_component_1 = require("../../pages/tickets/ticket-view-history/activated-policies/activated-policies.component");
var icon_customer_search_component_1 = require("../../pages/tickets/ticket-view-history/icon-customer-search/icon-customer-search.component");
var routes = [
    {
        path: '',
        component: tickets_component_1.TicketsComponent,
        children: [
            { path: '', redirectTo: 'list' },
            { path: 'list', component: ticket_list_component_1.TicketListComponent },
            { path: 'ticket-view/:id', component: ticket_view_component_1.TicketViewComponent }
        ],
        runGuardsAndResolvers: 'always'
    },
];
var TicketsModule = /** @class */ (function () {
    function TicketsModule() {
    }
    TicketsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ngx_summernote_1.NgxSummernoteModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes),
            ],
            exports: [router_1.RouterModule],
            declarations: [
                tickets_component_1.TicketsComponent,
                ticket_types_component_1.TicketTypesComponent,
                ticket_list_component_1.TicketListComponent,
                ticket_view_component_1.TicketViewComponent,
                merge_confirmation_component_1.MergeConfirmationComponent,
                quick_note_component_1.QuickNoteComponent,
                quick_reply_component_1.QuickReplyComponent,
                export_data_component_1.ExportDataComponent,
                sla_export_component_1.SlaExportComponent,
                print_tickets_component_1.PrintTicketsComponent,
                add_tag_component_1.AddTagComponent,
                big_img_component_1.BigImgComponent,
                ticket_filters_component_1.TicketFiltersComponent,
                ticket_msg_form_component_1.TicketMsgFormComponent,
                message_attachments_component_1.MessageAttachmentsComponent,
                ticket_view_history_component_1.TicketViewHistoryComponent,
                ticket_actions_component_1.TicketActionsComponent,
                icon_customer_search_component_1.IconCustomerSearchComponent,
                ticket_tasks_component_1.TicketTasksComponent,
                ticket_notes_component_1.TicketNotesComponent,
                ticket_activity_log_component_1.TicketActivityLogComponent,
                ticket_history_component_1.TicketHistoryComponent,
                ticket_browsing_history_component_1.TicketBrowsingHistoryComponent,
                ticket_merged_component_1.TicketMergedComponent,
                activated_policies_component_1.ActivatedPoliciesComponent
            ],
            entryComponents: [
                merge_confirmation_component_1.MergeConfirmationComponent,
                quick_reply_component_1.QuickReplyComponent,
                add_tag_component_1.AddTagComponent,
                quick_note_component_1.QuickNoteComponent,
                export_data_component_1.ExportDataComponent,
                sla_export_component_1.SlaExportComponent,
                big_img_component_1.BigImgComponent,
            ],
            providers: [
                TagService_1.TagService,
            ]
        })
    ], TicketsModule);
    return TicketsModule;
}());
exports.TicketsModule = TicketsModule;
//# sourceMappingURL=tickets.module.js.map