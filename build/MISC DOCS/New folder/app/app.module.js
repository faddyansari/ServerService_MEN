"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
//ANGULAR MATERIAL DEPENDENCIES
var animations_1 = require("@angular/platform-browser/animations");
//NGX MODULES
// Routes handler
var app_router_1 = require("./app.router");
// GLOBAL {STATIC}
//Route Manager (Observable Shared Service)
var GlobalStateService_1 = require("../services/GlobalStateService");
var ValidationService_1 = require("../services/UtilityServices/ValidationService");
var AuthenticationService_1 = require("../services/AuthenticationService");
var installation_component_1 = require("./pages/installation/installation.component");
var app_component_1 = require("./app.component");
var main_header_component_1 = require("./main/main-header/main-header.component");
//PAGES {DYNAMIC}
var home_component_1 = require("./pages/home/home.component");
var agent_component_1 = require("./pages/agent/agent.component");
var visitors_component_1 = require("./pages/visitors/visitors.component");
var chats_component_1 = require("./pages/chats/chats.component");
// SIDEBAR {DYNAMIC}
var chat_list_sidebar_component_1 = require("./pages/chats/chat-list-sidebar/chat-list-sidebar.component");
var agent_list_sidebar_component_1 = require("./pages/agent/agent-list-sidebar/agent-list-sidebar.component");
// ACCESS {DYNAMIC}
var login_component_1 = require("./login/login.component");
var main_component_1 = require("./main/main.component");
var transfer_chat_dialog_component_1 = require("./dialogs/transfer-chat-dialog/transfer-chat-dialog.component");
var add_agent_dialog_component_1 = require("./dialogs/add-agent-dialog/add-agent-dialog.component");
var add_contact_dialog_component_1 = require("./dialogs/add-contact-dialog/add-contact-dialog.component");
var add_ticket_dialog_component_1 = require("./dialogs/add-ticket-dialog/add-ticket-dialog.component");
var registeration_form_dialog_component_1 = require("./dialogs/registeration-form-dialog/registeration-form-dialog.component");
var toast_notifications_component_1 = require("./dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("./dialogs/confirmation-dialog/confirmation-dialog.component");
var replace_pipe_1 = require("./replace.pipe");
var browsing_component_1 = require("./pages/visitors/browsing/browsing.component");
var chatting_component_1 = require("./pages/visitors/chatting/chatting.component");
var queued_component_1 = require("./pages/visitors/queued/queued.component");
var device_disabled_component_1 = require("./dialogs/device-disabled/device-disabled.component");
var canActivateTicketViewGuard_1 = require("../services/canActivateTicketViewGuard");
var visitor_details_component_1 = require("./pages/visitors/visitor-details/visitor-details.component");
//
//Custom Directive
var equal_validator_directive_1 = require("./equal-validator.directive");
var time_difference_pipe_pipe_1 = require("./time-difference-pipe.pipe");
var forgot_password_component_1 = require("./dialogs/forgot-password/forgot-password.component");
var messages_component_1 = require("./pages/chats/messages/messages.component");
var chat_list_inbox_component_1 = require("./pages/chats/chat-list-sidebar/chat-list-inbox/chat-list-inbox.component");
var chat_list_archive_component_1 = require("./pages/chats/chat-list-sidebar/chat-list-archive/chat-list-archive.component");
var overlay_dialog_component_1 = require("./dialogs/overlay-dialog/overlay-dialog.component");
var SocketService_1 = require("../services/SocketService");
var NotificationService_1 = require("../services/NotificationService");
var agents_chat_component_1 = require("./pages/agent/agents-chat/agents-chat.component");
var update_contact_dialog_component_1 = require("./dialogs/update-contact-dialog/update-contact-dialog.component");
var import_export_contacts_dialog_component_1 = require("./dialogs/import-export-contacts-dialog/import-export-contacts-dialog.component");
var LocalStorageService_1 = require("../services/LocalStorageService");
var invited_component_1 = require("./pages/visitors/invited/invited.component");
var inactive_component_1 = require("./pages/visitors/inactive/inactive.component");
var left_component_1 = require("./pages/visitors/left/left.component");
var drawer_left_component_1 = require("./main/drawer-left/drawer-left.component");
var call_dialog_component_1 = require("./dialogs/call-dialog/call-dialog.component");
var reciever_call_dialog_component_1 = require("./dialogs/reciever-call-dialog/reciever-call-dialog.component");
var CallingService_1 = require("../services/CallingService");
var add_faq_dialog_component_1 = require("./dialogs/add-faq-dialog/add-faq-dialog.component");
var alert_bar_component_1 = require("./main/alert-bar/alert-bar.component");
var TicketsService_1 = require("../services/TicketsService");
var TicketTemplateService_1 = require("./../services/LocalServices/TicketTemplateService");
var shared_module_1 = require("./modules/shared/shared.module");
var MainAuthGuard_1 = require("../services/MainAuthGuard");
var InternalSettingsGuard_1 = require("../services/InternalSettingsGuard");
var noaccess_component_1 = require("./pages/noaccess/noaccess.component");
var color_phrase_pipe_1 = require("./color-phrase.pipe");
var ChatBotService_1 = require("../services/ChatBotService");
// import { TagInputModule } from 'ngx-chips';
var dashboard_component_1 = require("./pages/dashboard/dashboard.component");
var AnalyticsService_1 = require("../services/AnalyticsService");
var add_story_dialog_component_1 = require("./dialogs/add-story-dialog/add-story-dialog.component");
var add_actions_dialog_component_1 = require("./dialogs/add-actions-dialog/add-actions-dialog.component");
var add_tphrase_dialog_component_1 = require("./dialogs/add-tphrase-dialog/add-tphrase-dialog.component");
var visitors_fixed_chat_sidebar_component_1 = require("./visitors-fixed-chat-sidebar/visitors-fixed-chat-sidebar.component");
var ChatService_1 = require("../services/ChatService");
var IconIntegrationService_1 = require("../services/IconIntegrationService");
var UploadingService_1 = require("../services/UtilityServices/UploadingService");
var VisitorService_1 = require("../services/VisitorService");
var adminSettingsService_1 = require("../services/adminSettingsService");
var TicketAutomationService_1 = require("../services/LocalServices/TicketAutomationService");
var convert_chat_to_ticket_component_1 = require("./dialogs/convert-chat-to-ticket/convert-chat-to-ticket.component");
var ticket_management_component_1 = require("./pages/settings/ticket-management/ticket-management.component");
var general_settings_component_1 = require("./pages/settings/general-settings/general-settings.component");
var chat_settings_component_1 = require("./pages/settings/chat-settings/chat-settings.component");
var call_settings_component_1 = require("./pages/settings/call-settings/call-settings.component");
var web_hooks_component_1 = require("./pages/settings/web-hooks/web-hooks.component");
var integrations_component_1 = require("./pages/settings/integrations/integrations.component");
var contact_settings_component_1 = require("./pages/settings/contact-settings/contact-settings.component");
var knowledge_base_component_1 = require("./pages/settings/knowledge-base/knowledge-base.component");
var chat_customizations_component_1 = require("./pages/settings/chat-window/chat-customizations.component");
var widget_marketing_component_1 = require("./pages/settings/widget-marketing/widget-marketing.component");
var ngx_summernote_1 = require("ngx-summernote");
var FormDesignerService_1 = require("../services/LocalServices/FormDesignerService");
var agent_conv_list_sidebar_component_1 = require("./pages/agent/agent-conv-list-sidebar/agent-conv-list-sidebar.component");
var new_conversation_dialog_component_1 = require("./dialogs/new-conversation-dialog/new-conversation-dialog.component");
var agent_chat_details_component_1 = require("./pages/agent/agent-chat-details/agent-chat-details.component");
var visitor_ban_time_component_1 = require("./dialogs/visitor-ban-time/visitor-ban-time.component");
var email_chat_transcript_component_1 = require("./dialogs/email-chat-transcript/email-chat-transcript.component");
var template_design_component_1 = require("./pages/settings/template-design/template-design.component");
var show_chat_info_dialog_component_1 = require("./dialogs/show-chat-info-dialog/show-chat-info-dialog.component");
var AgentService_1 = require("../services/AgentService");
var change_password_dialog_component_1 = require("./dialogs/change-password-dialog/change-password-dialog.component");
var SurveyService_1 = require("../services/LocalServices/SurveyService");
var TicketSecnarioAutomationService_1 = require("../services/LocalServices/TicketSecnarioAutomationService");
var calling_component_1 = require("./pages/calling/calling.component");
var call_screen_component_1 = require("./pages/calling/call-screen/call-screen.component");
var callee_list_component_1 = require("./pages/calling/callee-list/callee-list.component");
var dialpad_component_1 = require("./pages/calling/dialpad/dialpad.component");
var UtilityService_1 = require("../services/UtilityServices/UtilityService");
var add_forward_ticket_component_1 = require("./dialogs/add-forward-ticket/add-forward-ticket.component");
var visitor_history_component_1 = require("./pages/visitors/visitor-details/visitor-history/visitor-history.component");
var browsing_history_component_1 = require("./pages/visitors/visitor-details/browsing-history/browsing-history.component");
var session_logs_component_1 = require("./pages/visitors/visitor-details/session-logs/session-logs.component");
var additional_data_component_1 = require("./pages/visitors/visitor-details/additional-data/additional-data.component");
var dashboard_map_component_1 = require("./pages/dashboard/dashboard-map/dashboard-map.component");
var filter_by_page_state_pipe_1 = require("./filter-by-page-state.pipe");
var SLAPoliciesService_1 = require("../services/LocalServices/SLAPoliciesService");
var sprites_component_1 = require("./custom-components/sprites/sprites.component");
var agent_filters_component_1 = require("./pages/agent/agent-filters/agent-filters.component");
var TagService_1 = require("../services/TagService");
var WhatsAppService_1 = require("../services/WhatsAppService");
var ngx_codemirror_1 = require("@ctrl/ngx-codemirror");
// import { ChatCustomFieldsComponent } from './pages/settings/assignment-rules/chat-custom-fields/chat-custom-fields.component';
// import { AnalyticsTicketcustomdashboardComponent } from './pages/analytics/analytics-tickets/analytics-ticketcustomdashboard/analytics-ticketcustomdashboard.component';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                main_header_component_1.MainHeaderComponent,
                home_component_1.HomeComponent,
                agent_component_1.AgentComponent,
                dashboard_component_1.DashboardComponent,
                dashboard_map_component_1.DashboardMapComponent,
                visitors_component_1.VisitorsComponent,
                chats_component_1.ChatsComponent,
                chat_list_sidebar_component_1.ChatListSidebarComponent,
                agent_list_sidebar_component_1.AgentListSidebarComponent,
                installation_component_1.InstallationComponent,
                main_component_1.MainComponent,
                equal_validator_directive_1.EqualValidator,
                transfer_chat_dialog_component_1.TransferChatDialog,
                add_agent_dialog_component_1.AddAgentDialogComponent,
                add_ticket_dialog_component_1.AddTicketDialogComponent,
                registeration_form_dialog_component_1.RegisterationFormDialogComponent,
                toast_notifications_component_1.ToastNotifications,
                confirmation_dialog_component_1.ConfirmationDialogComponent,
                replace_pipe_1.ReplacePipe,
                browsing_component_1.BrowsingComponent,
                chatting_component_1.ChattingComponent,
                queued_component_1.QueuedComponent,
                device_disabled_component_1.DeviceDisabledComponent,
                visitor_details_component_1.VisitorDetailsComponent,
                time_difference_pipe_pipe_1.TimeDifferencePipePipe,
                filter_by_page_state_pipe_1.FilterByPageStatePipe,
                forgot_password_component_1.ForgotPasswordComponent,
                messages_component_1.MessagesComponent,
                chat_list_inbox_component_1.ChatListInboxComponent,
                chat_list_archive_component_1.ChatListArchiveComponent,
                overlay_dialog_component_1.OverlayDialogComponent,
                agents_chat_component_1.AgentsChatComponent,
                add_contact_dialog_component_1.AddContactDialogComponent,
                update_contact_dialog_component_1.UpdateContactDialogComponent,
                import_export_contacts_dialog_component_1.ImportExportContactsDialogComponent,
                invited_component_1.InvitedComponent,
                inactive_component_1.InactiveComponent,
                left_component_1.LeftComponent,
                drawer_left_component_1.DrawerLeftComponent,
                call_dialog_component_1.CallDialogComponent,
                reciever_call_dialog_component_1.RecieverCallDialogComponent,
                add_faq_dialog_component_1.AddFaqDialogComponent,
                alert_bar_component_1.AlertBarComponent,
                noaccess_component_1.NoaccessComponent,
                ticket_management_component_1.TicketManagementComponent,
                //DpResponseComponent,
                color_phrase_pipe_1.ColorPhrasePipe,
                add_story_dialog_component_1.AddStoryDialogComponent,
                visitors_fixed_chat_sidebar_component_1.VisitorsFixedChatSidebarComponent,
                add_actions_dialog_component_1.AddActionsDialogComponent,
                add_tphrase_dialog_component_1.AddTphraseDialogComponent,
                convert_chat_to_ticket_component_1.ConvertChatToTicketComponent,
                general_settings_component_1.GeneralSettingsComponent,
                chat_settings_component_1.ChatSettingsComponent,
                call_settings_component_1.CallSettingsComponent,
                web_hooks_component_1.WebHooksComponent,
                integrations_component_1.IntegrationsComponent,
                contact_settings_component_1.ContactSettingsComponent,
                knowledge_base_component_1.KnowledgeBaseComponent,
                chat_customizations_component_1.ChatCustomizationsComponent,
                widget_marketing_component_1.WidgetMarketingComponent,
                agent_conv_list_sidebar_component_1.AgentConvListSidebarComponent,
                new_conversation_dialog_component_1.NewConversationDialogComponent,
                agent_chat_details_component_1.AgentChatDetailsComponent,
                visitor_ban_time_component_1.VisitorBanTimeComponent,
                email_chat_transcript_component_1.EmailChatTranscriptComponent,
                template_design_component_1.TemplateDesignComponent,
                show_chat_info_dialog_component_1.ShowChatInfoDialogComponent,
                change_password_dialog_component_1.ChangePasswordDialogComponent,
                calling_component_1.CallingComponent,
                call_screen_component_1.CallScreenComponent,
                callee_list_component_1.CalleeListComponent,
                dialpad_component_1.DialpadComponent,
                add_forward_ticket_component_1.AddForwardTicketComponent,
                visitor_history_component_1.VisitorHistoryComponent,
                browsing_history_component_1.BrowsingHistoryComponent,
                session_logs_component_1.SessionLogsComponent,
                additional_data_component_1.AdditionalDataComponent,
                dashboard_map_component_1.DashboardMapComponent,
                filter_by_page_state_pipe_1.FilterByPageStatePipe,
                sprites_component_1.SpritesComponent,
                agent_filters_component_1.AgentFiltersComponent,
            ],
            imports: [
                app_router_1.routes,
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                shared_module_1.SharedModule,
                ngx_summernote_1.NgxSummernoteModule,
                ngx_codemirror_1.CodemirrorModule
                // FileUploadModule
            ],
            entryComponents: [
                transfer_chat_dialog_component_1.TransferChatDialog,
                add_agent_dialog_component_1.AddAgentDialogComponent,
                add_ticket_dialog_component_1.AddTicketDialogComponent,
                registeration_form_dialog_component_1.RegisterationFormDialogComponent,
                confirmation_dialog_component_1.ConfirmationDialogComponent,
                toast_notifications_component_1.ToastNotifications,
                overlay_dialog_component_1.OverlayDialogComponent,
                forgot_password_component_1.ForgotPasswordComponent,
                add_contact_dialog_component_1.AddContactDialogComponent,
                import_export_contacts_dialog_component_1.ImportExportContactsDialogComponent,
                call_dialog_component_1.CallDialogComponent,
                reciever_call_dialog_component_1.RecieverCallDialogComponent,
                add_faq_dialog_component_1.AddFaqDialogComponent,
                add_story_dialog_component_1.AddStoryDialogComponent,
                add_actions_dialog_component_1.AddActionsDialogComponent,
                add_tphrase_dialog_component_1.AddTphraseDialogComponent,
                convert_chat_to_ticket_component_1.ConvertChatToTicketComponent,
                new_conversation_dialog_component_1.NewConversationDialogComponent,
                visitor_ban_time_component_1.VisitorBanTimeComponent,
                email_chat_transcript_component_1.EmailChatTranscriptComponent,
                show_chat_info_dialog_component_1.ShowChatInfoDialogComponent,
                change_password_dialog_component_1.ChangePasswordDialogComponent,
            ],
            providers: [
                AnalyticsService_1.AnalyticsService,
                TicketAutomationService_1.TicketAutomationService,
                LocalStorageService_1.LocalStorageService,
                GlobalStateService_1.GlobalStateService,
                ChatBotService_1.ChatBotService,
                ChatService_1.ChatService,
                IconIntegrationService_1.IconIntegrationService,
                UploadingService_1.UploadingService,
                UtilityService_1.UtilityService,
                AgentService_1.AgentService,
                VisitorService_1.Visitorservice,
                adminSettingsService_1.AdminSettingsService,
                AuthenticationService_1.AuthService,
                platform_browser_1.Title,
                canActivateTicketViewGuard_1.canActivateTicketViewGuard,
                SocketService_1.SocketService,
                NotificationService_1.PushNotificationsService,
                CallingService_1.CallingService,
                ValidationService_1.ValidationService,
                TicketsService_1.TicketsService,
                MainAuthGuard_1.MainAuthGuard,
                InternalSettingsGuard_1.InternalSettingsGuard,
                FormDesignerService_1.FormDesignerService,
                SurveyService_1.SurveyService,
                TicketTemplateService_1.TicketTemplateSevice,
                TicketSecnarioAutomationService_1.TicketSecnarioAutomationService,
                SLAPoliciesService_1.SLAPoliciesService,
                TagService_1.TagService,
                WhatsAppService_1.WhatsAppService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map