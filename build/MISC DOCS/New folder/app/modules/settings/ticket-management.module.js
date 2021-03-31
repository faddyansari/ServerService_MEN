"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketManagementModule = void 0;
var tag_cloud_component_1 = require("./../../pages/settings/ticket-management/tag-cloud/tag-cloud.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var tags_component_1 = require("../../pages/settings/ticket-management/tags/tags.component");
var ticket_permissions_component_1 = require("../../pages/settings/ticket-management/ticket-permissions/ticket-permissions.component");
var shared_module_1 = require("../shared/shared.module");
// import { TicketResponseComponent } from '../../pages/settings/ticket-management/ticket-response/ticket-response.component';
var ngx_summernote_1 = require("ngx-summernote");
var autoforwarding_component_1 = require("../../pages/settings/ticket-management/autoforwarding/autoforwarding.component");
var rulesets_component_1 = require("../../pages/settings/ticket-management/rulesets/rulesets.component");
var rule_confirmation_component_1 = require("../../dialogs/rule-confirmation/rule-confirmation.component");
var ruleset_list_component_1 = require("../../pages/settings/ticket-management/rulesets/ruleset-list/ruleset-list.component");
var ruleset_details_component_1 = require("../../pages/settings/ticket-management/rulesets/ruleset-details/ruleset-details.component");
var ruleset_add_new_component_1 = require("../../pages/settings/ticket-management/rulesets/ruleset-add-new/ruleset-add-new.component");
var ticket_templates_component_1 = require("../../pages/settings/ticket-management/ticket-templates/ticket-templates.component");
var ticket_templates_list_component_1 = require("../../pages/settings/ticket-management/ticket-templates/ticket-templates-list/ticket-templates-list.component");
var add_ticket_templates_component_1 = require("../../pages/settings/ticket-management/ticket-templates/add-ticket-templates/add-ticket-templates.component");
// import { TicketTemplateSevice } from './../../../services/LocalServices/TicketTemplateService';
var notifications_component_1 = require("../../pages/settings/ticket-management/notifications/notifications.component");
var form_designer_component_1 = require("../../pages/settings/form-designer/form-designer.component");
var form_addnew_component_1 = require("../../pages/settings/form-designer/form-addnew/form-addnew.component");
var forms_list_component_1 = require("../../pages/settings/form-designer/forms-list/forms-list.component");
var survey_component_1 = require("../../pages/settings/ticket-management/survey/survey.component");
var ngx_color_picker_1 = require("ngx-color-picker");
var ChatWindowCustomizations_1 = require("../../../services/LocalServices/ChatWindowCustomizations");
var preview_form_component_1 = require("../../dialogs/preview-form/preview-form.component");
var custom_fields_component_1 = require("../../pages/settings/ticket-management/custom-fields/custom-fields.component");
var bulk_marketing_email_component_1 = require("../../pages/settings/bulk-marketing-email/bulk-marketing-email.component");
var template_builder_component_1 = require("../../pages/settings/bulk-marketing-email/template-builder/template-builder.component");
var import_template_component_1 = require("../../pages/settings/bulk-marketing-email/import-template/import-template.component");
var html_editor_component_1 = require("../../pages/settings/bulk-marketing-email/html-editor/html-editor.component");
var email_template_list_component_1 = require("../../pages/settings/bulk-marketing-email/email-template-list/email-template-list.component");
var layout_component_1 = require("../../pages/settings/bulk-marketing-email/template-builder/layout/layout.component");
var EmailTemplateService_1 = require("../../../services/LocalServices/EmailTemplateService");
var survey_list_component_1 = require("../../pages/settings/ticket-management/survey/survey-list/survey-list.component");
var add_survey_component_1 = require("../../pages/settings/ticket-management/survey/add-survey/add-survey.component");
// import { ConfirmationGuard } from '../../../services/ConfirmationGuard';
var template_options_component_1 = require("../../pages/settings/bulk-marketing-email/template-options/template-options.component");
var teams_component_1 = require("../../pages/settings/ticket-management/teams/teams.component");
var TeamService_1 = require("../../../services/LocalServices/TeamService");
var sla_policies_component_1 = require("../../pages/settings/ticket-management/sla-policies/sla-policies.component");
var add_sla_policies_component_1 = require("../../pages/settings/ticket-management/sla-policies/add-sla-policies/add-sla-policies.component");
var sla_policies_list_component_1 = require("../../pages/settings/ticket-management/sla-policies/sla-policies-list/sla-policies-list.component");
var ruleset_scheduler_component_1 = require("../../pages/settings/ticket-management/ruleset-scheduler/ruleset-scheduler.component");
var ticket_scenario_automation_component_1 = require("../../pages/settings/ticket-management/ticket-scenario-automation/ticket-scenario-automation.component");
var ticket_scenario_automation_list_component_1 = require("../../pages/settings/ticket-management/ticket-scenario-automation/ticket-scenario-automation-list/ticket-scenario-automation-list.component");
var add_ticket_scenario_automation_component_1 = require("../../pages/settings/ticket-management/ticket-scenario-automation/add-ticket-scenario-automation/add-ticket-scenario-automation.component");
var internal_sla_policies_component_1 = require("../../pages/settings/ticket-management/internal-sla-policies/internal-sla-policies.component");
var add_internal_sla_policies_component_1 = require("../../pages/settings/ticket-management/internal-sla-policies/add-internal-sla-policies/add-internal-sla-policies.component");
var internal_sla_policies_list_component_1 = require("../../pages/settings/ticket-management/internal-sla-policies/internal-sla-policies-list/internal-sla-policies-list.component");
var ngx_codemirror_1 = require("@ctrl/ngx-codemirror");
var acknowledge_message_component_1 = require("../../pages/settings/ticket-management/acknowledge-message/acknowledge-message.component");
var add_acknowledge_message_component_1 = require("../../pages/settings/ticket-management/acknowledge-message/add-acknowledge-message/add-acknowledge-message.component");
var acknowledge_message_list_component_1 = require("../../pages/settings/ticket-management/acknowledge-message/acknowledge-message-list/acknowledge-message-list.component");
var AcknowledgeMessageService_1 = require("../../../services/LocalServices/AcknowledgeMessageService");
var preview_ack_message_component_1 = require("../../dialogs/preview-ack-message/preview-ack-message.component");
var routes = [
    { path: '', redirectTo: 'groups' },
    { path: 'groups', component: tags_component_1.TagsComponent },
    { path: 'teams', component: teams_component_1.TeamsComponent },
    { path: 'rulesets', component: rulesets_component_1.RulesetsComponent },
    { path: 'ruleset-scheduler', component: ruleset_scheduler_component_1.RulesetSchedulerComponent },
    { path: 'permissions', component: ticket_permissions_component_1.TicketPermissionsComponent },
    { path: 'sla-policies', component: sla_policies_component_1.SlaPoliciesComponent },
    { path: 'autoforwarding', component: autoforwarding_component_1.AutoforwardingComponent },
    { path: 'internal-sla-policies', component: internal_sla_policies_component_1.InternalSlaPoliciesComponent },
    { path: 'tag-cloud', component: tag_cloud_component_1.TagCloudComponent },
    { path: 'acknowledge-message', component: acknowledge_message_component_1.AcknowledgeMessageComponent },
    { path: 'ticket-template', component: ticket_templates_component_1.TicketTemplatesComponent },
    { path: 'notifications', component: notifications_component_1.NotificationsComponent },
    { path: 'survey', component: survey_component_1.SurveyComponent },
    { path: 'form-designer', component: form_designer_component_1.FormDesignerComponent },
    { path: 'scenario-automation', component: ticket_scenario_automation_component_1.TicketScenarioAutomationComponent },
    {
        // canDeactivate: [ConfirmationGuard]
        path: 'bulk-marketing-email', children: [
            { path: 'template-options', component: template_options_component_1.TemplateOptionsComponent },
            { path: 'template-options/builder/:type', component: template_builder_component_1.TemplateBuilderComponent, },
            { path: 'template-options/importTemplate', component: import_template_component_1.ImportTemplateComponent },
            { path: 'template-options/htmlEditor', component: html_editor_component_1.HtmlEditorComponent }
        ], component: bulk_marketing_email_component_1.BulkMarketingEmailComponent
    },
    { path: 'customfields', component: custom_fields_component_1.CustomFieldsComponent },
];
var TicketManagementModule = /** @class */ (function () {
    function TicketManagementModule() {
    }
    TicketManagementModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                ngx_codemirror_1.CodemirrorModule,
                ngx_summernote_1.NgxSummernoteModule,
                router_1.RouterModule.forChild(routes),
                ngx_color_picker_1.ColorPickerModule,
            ],
            exports: [router_1.RouterModule],
            declarations: [
                tags_component_1.TagsComponent,
                teams_component_1.TeamsComponent,
                ticket_permissions_component_1.TicketPermissionsComponent,
                autoforwarding_component_1.AutoforwardingComponent,
                ticket_templates_component_1.TicketTemplatesComponent,
                ticket_templates_list_component_1.TicketTemplatesListComponent,
                add_ticket_templates_component_1.AddTicketTemplatesComponent,
                preview_form_component_1.PreviewFormComponent,
                rulesets_component_1.RulesetsComponent,
                email_template_list_component_1.EmailTemplateListComponent,
                tag_cloud_component_1.TagCloudComponent,
                acknowledge_message_component_1.AcknowledgeMessageComponent,
                add_acknowledge_message_component_1.AddAcknowledgeMessageComponent,
                acknowledge_message_list_component_1.AcknowledgeMessageListComponent,
                template_options_component_1.TemplateOptionsComponent,
                notifications_component_1.NotificationsComponent,
                survey_component_1.SurveyComponent,
                layout_component_1.LayoutComponent,
                rule_confirmation_component_1.RuleConfirmationComponent,
                ruleset_details_component_1.RulesetDetailsComponent,
                ruleset_list_component_1.RulesetListComponent,
                ruleset_add_new_component_1.RulesetAddNewComponent,
                form_designer_component_1.FormDesignerComponent,
                form_addnew_component_1.FormAddnewComponent,
                forms_list_component_1.FormsListComponent,
                bulk_marketing_email_component_1.BulkMarketingEmailComponent,
                custom_fields_component_1.CustomFieldsComponent,
                template_builder_component_1.TemplateBuilderComponent,
                import_template_component_1.ImportTemplateComponent,
                html_editor_component_1.HtmlEditorComponent,
                survey_list_component_1.SurveyListComponent,
                add_survey_component_1.AddSurveyComponent,
                sla_policies_component_1.SlaPoliciesComponent,
                add_sla_policies_component_1.AddSlaPoliciesComponent,
                sla_policies_list_component_1.SlaPoliciesListComponent,
                ruleset_scheduler_component_1.RulesetSchedulerComponent,
                add_survey_component_1.AddSurveyComponent,
                ticket_scenario_automation_component_1.TicketScenarioAutomationComponent,
                ticket_scenario_automation_list_component_1.TicketScenarioAutomationListComponent,
                add_ticket_scenario_automation_component_1.AddTicketScenarioAutomationComponent,
                internal_sla_policies_component_1.InternalSlaPoliciesComponent,
                add_internal_sla_policies_component_1.AddInternalSlaPoliciesComponent,
                internal_sla_policies_list_component_1.InternalSlaPoliciesListComponent,
                preview_ack_message_component_1.PreviewAckMessageComponent
            ],
            providers: [
                TeamService_1.TeamService,
                ChatWindowCustomizations_1.ChatWindowCustomizations,
                EmailTemplateService_1.EmailTemplateService,
                AcknowledgeMessageService_1.AcknowledgeMessageService
                // ConfirmationGuard,
            ],
            entryComponents: [
                preview_form_component_1.PreviewFormComponent,
                preview_ack_message_component_1.PreviewAckMessageComponent
            ],
        })
    ], TicketManagementModule);
    return TicketManagementModule;
}());
exports.TicketManagementModule = TicketManagementModule;
//# sourceMappingURL=ticket-management.module.js.map