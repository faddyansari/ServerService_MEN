import { Title, BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//ANGULAR MATERIAL DEPENDENCIES
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//NGX MODULES


// Routes handler
import { routes } from './app.router';

// GLOBAL {STATIC}
//Route Manager (Observable Shared Service)
import { GlobalStateService } from '../services/GlobalStateService';
import { ValidationService } from '../services/UtilityServices/ValidationService';
import { AuthService } from '../services/AuthenticationService';

import { InstallationComponent } from './pages/installation/installation.component';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main/main-header/main-header.component';

//PAGES {DYNAMIC}
import { HomeComponent } from './pages/home/home.component';
import { AgentComponent } from './pages/agent/agent.component';
import { VisitorsComponent } from './pages/visitors/visitors.component';
import { ChatsComponent } from './pages/chats/chats.component';

// SIDEBAR {DYNAMIC}
import { ChatListSidebarComponent } from './pages/chats/chat-list-sidebar/chat-list-sidebar.component';
import { AgentListSidebarComponent } from './pages/agent/agent-list-sidebar/agent-list-sidebar.component';

// ACCESS {DYNAMIC}
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TransferChatDialog } from './dialogs/transfer-chat-dialog/transfer-chat-dialog.component';
import { AddAgentDialogComponent } from './dialogs/add-agent-dialog/add-agent-dialog.component';
import { AddContactDialogComponent } from './dialogs/add-contact-dialog/add-contact-dialog.component';

import { AddTicketDialogComponent } from './dialogs/add-ticket-dialog/add-ticket-dialog.component';
import { RegisterationFormDialogComponent } from './dialogs/registeration-form-dialog/registeration-form-dialog.component';
import { ToastNotifications } from './dialogs/SnackBar-Dialog/toast-notifications.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ReplacePipe } from './replace.pipe'
import { BrowsingComponent } from './pages/visitors/browsing/browsing.component';
import { ChattingComponent } from './pages/visitors/chatting/chatting.component';
import { QueuedComponent } from './pages/visitors/queued/queued.component';
import { DeviceDisabledComponent } from './dialogs/device-disabled/device-disabled.component';
import { canActivateTicketViewGuard } from '../services/canActivateTicketViewGuard';
import { VisitorDetailsComponent } from './pages/visitors/visitor-details/visitor-details.component';


//
//Custom Directive
import { EqualValidator } from './equal-validator.directive';

import { TimeDifferencePipePipe } from './time-difference-pipe.pipe';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { MessagesComponent } from './pages/chats/messages/messages.component';
import { ChatListInboxComponent } from './pages/chats/chat-list-sidebar/chat-list-inbox/chat-list-inbox.component';
import { ChatListArchiveComponent } from './pages/chats/chat-list-sidebar/chat-list-archive/chat-list-archive.component';
import { OverlayDialogComponent } from './dialogs/overlay-dialog/overlay-dialog.component';
import { SocketService } from '../services/SocketService';
import { PushNotificationsService } from '../services/NotificationService';
import { AgentsChatComponent } from './pages/agent/agents-chat/agents-chat.component';
import { UpdateContactDialogComponent } from './dialogs/update-contact-dialog/update-contact-dialog.component';
import { ImportExportContactsDialogComponent } from './dialogs/import-export-contacts-dialog/import-export-contacts-dialog.component';
import { LocalStorageService } from '../services/LocalStorageService';
import { InvitedComponent } from './pages/visitors/invited/invited.component';
import { InactiveComponent } from './pages/visitors/inactive/inactive.component';
import { LeftComponent } from './pages/visitors/left/left.component';
import { DrawerLeftComponent } from './main/drawer-left/drawer-left.component';
import { CallDialogComponent } from './dialogs/call-dialog/call-dialog.component';
import { RecieverCallDialogComponent } from './dialogs/reciever-call-dialog/reciever-call-dialog.component';
import { CallingService } from '../services/CallingService';
import { AddFaqDialogComponent } from './dialogs/add-faq-dialog/add-faq-dialog.component';
import { AlertBarComponent } from './main/alert-bar/alert-bar.component';
import { TicketsService } from '../services/TicketsService';
import { TicketTemplateSevice } from './../services/LocalServices/TicketTemplateService';
import { SharedModule } from './modules/shared/shared.module';
import { MainAuthGuard } from '../services/MainAuthGuard';
import { InternalSettingsGuard } from '../services/InternalSettingsGuard';
import { NoaccessComponent } from './pages/noaccess/noaccess.component';
import { ColorPhrasePipe } from './color-phrase.pipe';
import { ChatBotService } from '../services/ChatBotService';
// import { TagInputModule } from 'ngx-chips';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticsService } from '../services/AnalyticsService';
import { AddStoryDialogComponent } from './dialogs/add-story-dialog/add-story-dialog.component';
import { AddActionsDialogComponent } from './dialogs/add-actions-dialog/add-actions-dialog.component';
import { AddTphraseDialogComponent } from './dialogs/add-tphrase-dialog/add-tphrase-dialog.component';
import { VisitorsFixedChatSidebarComponent } from './visitors-fixed-chat-sidebar/visitors-fixed-chat-sidebar.component';
import { ChatService } from '../services/ChatService';
import { IconIntegrationService } from '../services/IconIntegrationService';
import { UploadingService } from '../services/UtilityServices/UploadingService';
import { Visitorservice } from '../services/VisitorService';
import { AdminSettingsService } from '../services/adminSettingsService';
import { TicketAutomationService } from '../services/LocalServices/TicketAutomationService';
import { ConvertChatToTicketComponent } from './dialogs/convert-chat-to-ticket/convert-chat-to-ticket.component';
import { TicketManagementComponent } from './pages/settings/ticket-management/ticket-management.component';
import { GeneralSettingsComponent } from './pages/settings/general-settings/general-settings.component';
import { ChatSettingsComponent } from './pages/settings/chat-settings/chat-settings.component';
import { CallSettingsComponent } from './pages/settings/call-settings/call-settings.component';
import { WebHooksComponent } from './pages/settings/web-hooks/web-hooks.component';
import { IntegrationsComponent } from './pages/settings/integrations/integrations.component';
import { ContactSettingsComponent } from './pages/settings/contact-settings/contact-settings.component';
import { KnowledgeBaseComponent } from './pages/settings/knowledge-base/knowledge-base.component';
import { ChatCustomizationsComponent } from './pages/settings/chat-window/chat-customizations.component';
import { WidgetMarketingComponent } from './pages/settings/widget-marketing/widget-marketing.component';
import { AssignmentRulesComponent } from './pages/settings/assignment-rules/assignment-rules.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FormDesignerService } from '../services/LocalServices/FormDesignerService';
import { AgentConvListSidebarComponent } from './pages/agent/agent-conv-list-sidebar/agent-conv-list-sidebar.component';
import { NewConversationDialogComponent } from './dialogs/new-conversation-dialog/new-conversation-dialog.component';
import { AgentChatDetailsComponent } from './pages/agent/agent-chat-details/agent-chat-details.component';
import { VisitorBanTimeComponent } from './dialogs/visitor-ban-time/visitor-ban-time.component';
import { EmailChatTranscriptComponent } from './dialogs/email-chat-transcript/email-chat-transcript.component';
import { TemplateDesignComponent } from './pages/settings/template-design/template-design.component';
import { ShowChatInfoDialogComponent } from './dialogs/show-chat-info-dialog/show-chat-info-dialog.component';
import { AgentService } from '../services/AgentService';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { SurveyService } from '../services/LocalServices/SurveyService';
import { TicketSecnarioAutomationService } from '../services/LocalServices/TicketSecnarioAutomationService';


import { CallingComponent } from './pages/calling/calling.component';
import { CallScreenComponent } from './pages/calling/call-screen/call-screen.component';
import { CalleeListComponent } from './pages/calling/callee-list/callee-list.component';
import { DialpadComponent } from './pages/calling/dialpad/dialpad.component';
import { UtilityService } from '../services/UtilityServices/UtilityService';
import { AddForwardTicketComponent } from './dialogs/add-forward-ticket/add-forward-ticket.component';
import { VisitorHistoryComponent } from './pages/visitors/visitor-details/visitor-history/visitor-history.component';
import { BrowsingHistoryComponent } from './pages/visitors/visitor-details/browsing-history/browsing-history.component';
import { SessionLogsComponent } from './pages/visitors/visitor-details/session-logs/session-logs.component';
import { AdditionalDataComponent } from './pages/visitors/visitor-details/additional-data/additional-data.component';
import { DashboardMapComponent } from './pages/dashboard/dashboard-map/dashboard-map.component';
import { FilterByPageStatePipe } from './filter-by-page-state.pipe';
import { SLAPoliciesService } from '../services/LocalServices/SLAPoliciesService';
import { SpritesComponent } from './custom-components/sprites/sprites.component';
import { AgentFiltersComponent } from './pages/agent/agent-filters/agent-filters.component';
import { TagService } from '../services/TagService';
import { WhatsAppService } from '../services/WhatsAppService';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
// import { ChatCustomFieldsComponent } from './pages/settings/assignment-rules/chat-custom-fields/chat-custom-fields.component';
// import { AnalyticsTicketcustomdashboardComponent } from './pages/analytics/analytics-tickets/analytics-ticketcustomdashboard/analytics-ticketcustomdashboard.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainHeaderComponent,
        HomeComponent,
        AgentComponent,
        DashboardComponent,
        DashboardMapComponent,
        VisitorsComponent,
        ChatsComponent,
        ChatListSidebarComponent,
        AgentListSidebarComponent,
        InstallationComponent,
        MainComponent,
        EqualValidator,
        TransferChatDialog,
        AddAgentDialogComponent,
        AddTicketDialogComponent,
        RegisterationFormDialogComponent,
        ToastNotifications,
        ConfirmationDialogComponent,
        ReplacePipe,
        BrowsingComponent,
        ChattingComponent,
        QueuedComponent,
        DeviceDisabledComponent,
        VisitorDetailsComponent,
        TimeDifferencePipePipe,
        FilterByPageStatePipe,
        ForgotPasswordComponent,
        MessagesComponent,
        ChatListInboxComponent,
        ChatListArchiveComponent,
        OverlayDialogComponent,
        AgentsChatComponent,
        AddContactDialogComponent,
        UpdateContactDialogComponent,
        ImportExportContactsDialogComponent,
        InvitedComponent,
        InactiveComponent,
        LeftComponent,
        DrawerLeftComponent,
        CallDialogComponent,
        RecieverCallDialogComponent,
        AddFaqDialogComponent,
        AlertBarComponent,
        NoaccessComponent,
        TicketManagementComponent,
        //DpResponseComponent,
        ColorPhrasePipe,
        AddStoryDialogComponent,
        VisitorsFixedChatSidebarComponent,
        AddActionsDialogComponent,
        AddTphraseDialogComponent,
        ConvertChatToTicketComponent,
        GeneralSettingsComponent,
        ChatSettingsComponent,
        CallSettingsComponent,
        WebHooksComponent,
        IntegrationsComponent,
        ContactSettingsComponent,
        KnowledgeBaseComponent,
        ChatCustomizationsComponent,
        WidgetMarketingComponent,
        AgentConvListSidebarComponent,
        NewConversationDialogComponent,
        AgentChatDetailsComponent,
        VisitorBanTimeComponent,
        EmailChatTranscriptComponent,
        TemplateDesignComponent,
        ShowChatInfoDialogComponent,
        ChangePasswordDialogComponent,
        CallingComponent,
        CallScreenComponent,
        CalleeListComponent,
        DialpadComponent,
        AddForwardTicketComponent,
        VisitorHistoryComponent,
        BrowsingHistoryComponent,
        SessionLogsComponent,
        AdditionalDataComponent,
        DashboardMapComponent,
        FilterByPageStatePipe,
        SpritesComponent,
        AgentFiltersComponent,
        // AnalyticsTicketcustomdashboardComponent,
        // AnalyticsTicketcustomdashboardComponent
    ],
    imports: [
        routes,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        NgxSummernoteModule,
        CodemirrorModule


        // FileUploadModule
    ],
    entryComponents: [
        TransferChatDialog,
        AddAgentDialogComponent,
        AddTicketDialogComponent,
        RegisterationFormDialogComponent,
        ConfirmationDialogComponent,
        ToastNotifications,
        OverlayDialogComponent,
        ForgotPasswordComponent,
        AddContactDialogComponent,
        ImportExportContactsDialogComponent,
        CallDialogComponent,
        RecieverCallDialogComponent,
        AddFaqDialogComponent,
        AddStoryDialogComponent,
        AddActionsDialogComponent,
        AddTphraseDialogComponent,
        ConvertChatToTicketComponent,
        NewConversationDialogComponent,
        VisitorBanTimeComponent,
        EmailChatTranscriptComponent,
        ShowChatInfoDialogComponent,
        ChangePasswordDialogComponent,
    ],
    providers: [
        AnalyticsService,
        TicketAutomationService,
        LocalStorageService,
        GlobalStateService,
        ChatBotService,
        ChatService,
        IconIntegrationService,
        UploadingService,
        UtilityService,
        AgentService,
        Visitorservice,
        AdminSettingsService,
        AuthService,
        Title,
        canActivateTicketViewGuard,
        SocketService,
        PushNotificationsService,
        CallingService,
        ValidationService,
        TicketsService,
        MainAuthGuard,
        InternalSettingsGuard,
        FormDesignerService,
        SurveyService,
        TicketTemplateSevice,
        TicketSecnarioAutomationService,
        SLAPoliciesService,
        TagService,
        WhatsAppService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
