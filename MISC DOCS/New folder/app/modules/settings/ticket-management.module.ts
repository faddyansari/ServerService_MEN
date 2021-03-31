import { TagCloudComponent } from './../../pages/settings/ticket-management/tag-cloud/tag-cloud.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TagsComponent } from '../../pages/settings/ticket-management/tags/tags.component';
import { TicketPermissionsComponent } from '../../pages/settings/ticket-management/ticket-permissions/ticket-permissions.component';
import { SharedModule } from '../shared/shared.module';
// import { TicketResponseComponent } from '../../pages/settings/ticket-management/ticket-response/ticket-response.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AutoforwardingComponent } from '../../pages/settings/ticket-management/autoforwarding/autoforwarding.component';
import { RulesetsComponent } from '../../pages/settings/ticket-management/rulesets/rulesets.component';
import { RuleConfirmationComponent } from '../../dialogs/rule-confirmation/rule-confirmation.component';
import { RulesetListComponent } from '../../pages/settings/ticket-management/rulesets/ruleset-list/ruleset-list.component';
import { RulesetDetailsComponent } from '../../pages/settings/ticket-management/rulesets/ruleset-details/ruleset-details.component';
import { RulesetAddNewComponent } from '../../pages/settings/ticket-management/rulesets/ruleset-add-new/ruleset-add-new.component';
import { TicketTemplatesComponent } from '../../pages/settings/ticket-management/ticket-templates/ticket-templates.component';
import { TicketTemplatesListComponent } from '../../pages/settings/ticket-management/ticket-templates/ticket-templates-list/ticket-templates-list.component';
import { AddTicketTemplatesComponent } from '../../pages/settings/ticket-management/ticket-templates/add-ticket-templates/add-ticket-templates.component';
// import { TicketTemplateSevice } from './../../../services/LocalServices/TicketTemplateService';

import { NotificationsComponent } from '../../pages/settings/ticket-management/notifications/notifications.component';
import { FormDesignerComponent } from '../../pages/settings/form-designer/form-designer.component';
import { FormAddnewComponent } from '../../pages/settings/form-designer/form-addnew/form-addnew.component';
import { FormsListComponent } from '../../pages/settings/form-designer/forms-list/forms-list.component';
import { SurveyComponent } from '../../pages/settings/ticket-management/survey/survey.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChatWindowCustomizations } from '../../../services/LocalServices/ChatWindowCustomizations';
import { PreviewFormComponent } from '../../dialogs/preview-form/preview-form.component';
import { CustomFieldsComponent } from '../../pages/settings/ticket-management/custom-fields/custom-fields.component';
import { BulkMarketingEmailComponent } from '../../pages/settings/bulk-marketing-email/bulk-marketing-email.component';
import { TemplateBuilderComponent } from '../../pages/settings/bulk-marketing-email/template-builder/template-builder.component';
import { ImportTemplateComponent } from '../../pages/settings/bulk-marketing-email/import-template/import-template.component';
import { HtmlEditorComponent } from '../../pages/settings/bulk-marketing-email/html-editor/html-editor.component';
import { EmailTemplateListComponent } from '../../pages/settings/bulk-marketing-email/email-template-list/email-template-list.component';
import { LayoutComponent } from '../../pages/settings/bulk-marketing-email/template-builder/layout/layout.component';
import { EmailTemplateService } from '../../../services/LocalServices/EmailTemplateService';
import { SurveyListComponent } from '../../pages/settings/ticket-management/survey/survey-list/survey-list.component';
import { AddSurveyComponent } from '../../pages/settings/ticket-management/survey/add-survey/add-survey.component';
// import { ConfirmationGuard } from '../../../services/ConfirmationGuard';
import { TemplateOptionsComponent } from '../../pages/settings/bulk-marketing-email/template-options/template-options.component';
import { TeamsComponent } from '../../pages/settings/ticket-management/teams/teams.component';
import { TeamService } from '../../../services/LocalServices/TeamService';
import { SlaPoliciesComponent } from '../../pages/settings/ticket-management/sla-policies/sla-policies.component';
import { AddSlaPoliciesComponent } from '../../pages/settings/ticket-management/sla-policies/add-sla-policies/add-sla-policies.component';
import { SlaPoliciesListComponent } from '../../pages/settings/ticket-management/sla-policies/sla-policies-list/sla-policies-list.component';
import { RulesetSchedulerComponent } from '../../pages/settings/ticket-management/ruleset-scheduler/ruleset-scheduler.component';
import { TicketScenarioAutomationComponent } from '../../pages/settings/ticket-management/ticket-scenario-automation/ticket-scenario-automation.component';
import { TicketScenarioAutomationListComponent } from '../../pages/settings/ticket-management/ticket-scenario-automation/ticket-scenario-automation-list/ticket-scenario-automation-list.component';
import { AddTicketScenarioAutomationComponent } from '../../pages/settings/ticket-management/ticket-scenario-automation/add-ticket-scenario-automation/add-ticket-scenario-automation.component';
import { InternalSlaPoliciesComponent } from '../../pages/settings/ticket-management/internal-sla-policies/internal-sla-policies.component';
import { AddInternalSlaPoliciesComponent } from '../../pages/settings/ticket-management/internal-sla-policies/add-internal-sla-policies/add-internal-sla-policies.component';
import { InternalSlaPoliciesListComponent } from '../../pages/settings/ticket-management/internal-sla-policies/internal-sla-policies-list/internal-sla-policies-list.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AcknowledgeMessageComponent } from '../../pages/settings/ticket-management/acknowledge-message/acknowledge-message.component';
import { AddAcknowledgeMessageComponent } from '../../pages/settings/ticket-management/acknowledge-message/add-acknowledge-message/add-acknowledge-message.component';
import { AcknowledgeMessageListComponent } from '../../pages/settings/ticket-management/acknowledge-message/acknowledge-message-list/acknowledge-message-list.component';
import { AcknowledgeMessageService } from '../../../services/LocalServices/AcknowledgeMessageService';
import { PreviewAckMessageComponent } from '../../dialogs/preview-ack-message/preview-ack-message.component';

const routes: Routes = [
    { path: '', redirectTo: 'groups' },
    { path: 'groups', component: TagsComponent },
    { path: 'teams', component: TeamsComponent },
    { path: 'rulesets', component: RulesetsComponent },
    { path: 'ruleset-scheduler', component: RulesetSchedulerComponent },
    { path: 'permissions', component: TicketPermissionsComponent },
    { path: 'sla-policies', component: SlaPoliciesComponent },
    { path: 'autoforwarding', component: AutoforwardingComponent },
    { path: 'internal-sla-policies', component: InternalSlaPoliciesComponent },
    { path: 'tag-cloud', component: TagCloudComponent },
    { path: 'acknowledge-message', component: AcknowledgeMessageComponent },

    { path: 'ticket-template', component: TicketTemplatesComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'survey', component: SurveyComponent },
    { path: 'form-designer', component: FormDesignerComponent },
    { path: 'scenario-automation', component: TicketScenarioAutomationComponent },
    {
        // canDeactivate: [ConfirmationGuard]
        path: 'bulk-marketing-email', children: [
            { path: 'template-options', component: TemplateOptionsComponent },
            { path: 'template-options/builder/:type', component: TemplateBuilderComponent, },
            { path: 'template-options/importTemplate', component: ImportTemplateComponent },
            { path: 'template-options/htmlEditor', component: HtmlEditorComponent }

        ], component: BulkMarketingEmailComponent
    },
    { path: 'customfields', component: CustomFieldsComponent },
];
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CodemirrorModule,
        NgxSummernoteModule,
        RouterModule.forChild(routes),
        ColorPickerModule,
    ],
    exports: [RouterModule],
    declarations: [
        TagsComponent,
        TeamsComponent,
        TicketPermissionsComponent,
        AutoforwardingComponent,
        TicketTemplatesComponent,
        TicketTemplatesListComponent,
        AddTicketTemplatesComponent,
        PreviewFormComponent,
        RulesetsComponent,
        EmailTemplateListComponent,
        TagCloudComponent,
        AcknowledgeMessageComponent,
        AddAcknowledgeMessageComponent,
        AcknowledgeMessageListComponent,
        TemplateOptionsComponent,
        NotificationsComponent,
        SurveyComponent,
        LayoutComponent,
        RuleConfirmationComponent,
        RulesetDetailsComponent,
        RulesetListComponent,
        RulesetAddNewComponent,
        FormDesignerComponent,
        FormAddnewComponent,
        FormsListComponent,
        BulkMarketingEmailComponent,
        CustomFieldsComponent,
        TemplateBuilderComponent,
        ImportTemplateComponent,
        HtmlEditorComponent,
        SurveyListComponent,
        AddSurveyComponent,
        SlaPoliciesComponent,
        AddSlaPoliciesComponent,
        SlaPoliciesListComponent,
        RulesetSchedulerComponent,
        AddSurveyComponent,
        TicketScenarioAutomationComponent,
        TicketScenarioAutomationListComponent,
        AddTicketScenarioAutomationComponent,
        InternalSlaPoliciesComponent,
        AddInternalSlaPoliciesComponent,
        InternalSlaPoliciesListComponent,
        PreviewAckMessageComponent

    ],
    providers: [
        TeamService,
        ChatWindowCustomizations,
        EmailTemplateService,
        AcknowledgeMessageService
        // ConfirmationGuard,
    ],
    entryComponents: [
        PreviewFormComponent,
        PreviewAckMessageComponent

    ],
})
export class TicketManagementModule { }