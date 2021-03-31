"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWindowModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var chat_bubble_component_1 = require("../../pages/settings/chat-window/chat-bubble/chat-bubble.component");
var theme_component_1 = require("../../pages/settings/chat-window/theme/theme.component");
var dialog_theme_component_1 = require("../../pages/settings/chat-window/dialog-theme/dialog-theme.component");
var message_window_component_1 = require("../../pages/settings/chat-window/message-window/message-window.component");
var noagent_ticket_dialog_component_1 = require("../../pages/settings/chat-window/noagent-ticket-dialog/noagent-ticket-dialog.component");
var ticket_form_dialog_component_1 = require("../../pages/settings/chat-window/ticket-form-dialog/ticket-form-dialog.component");
var ticket_submission_dialog_component_1 = require("../../pages/settings/chat-window/ticket-submission-dialog/ticket-submission-dialog.component");
var feedback_form_component_1 = require("../../pages/settings/chat-window/feedback-form/feedback-form.component");
var end_chat_dialog_component_1 = require("../../pages/settings/chat-window/end-chat-dialog/end-chat-dialog.component");
var ngx_color_picker_1 = require("ngx-color-picker");
var ChatWindowCustomizations_1 = require("../../../services/LocalServices/ChatWindowCustomizations");
var pre_chat_form_component_1 = require("../../pages/settings/chat-window/pre-chat-form/pre-chat-form.component");
var routes = [
    { path: '', redirectTo: 'bubble' },
    { path: 'bubble', component: chat_bubble_component_1.ChatBubbleComponent },
    { path: 'theme', component: theme_component_1.ThemeComponent },
    { path: 'dialog', component: dialog_theme_component_1.DialogThemeComponent },
    { path: 'window', component: message_window_component_1.MessageWindowComponent },
    { path: 'agent', component: noagent_ticket_dialog_component_1.NoagentTicketDialogComponent },
    { path: 'ticketform', component: ticket_form_dialog_component_1.TicketFormDialogComponent },
    { path: 'ticketsubmit', component: ticket_submission_dialog_component_1.TicketSubmissionDialogComponent },
    { path: 'feedback', component: feedback_form_component_1.FeedbackForm },
    { path: 'endchat', component: end_chat_dialog_component_1.EndChatDialogComponent },
    { path: 'preChatSurvey', component: pre_chat_form_component_1.PreChatFormComponent }
];
var ChatWindowModule = /** @class */ (function () {
    function ChatWindowModule() {
    }
    ChatWindowModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                ngx_color_picker_1.ColorPickerModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            declarations: [
                chat_bubble_component_1.ChatBubbleComponent,
                theme_component_1.ThemeComponent,
                dialog_theme_component_1.DialogThemeComponent,
                message_window_component_1.MessageWindowComponent,
                noagent_ticket_dialog_component_1.NoagentTicketDialogComponent,
                ticket_form_dialog_component_1.TicketFormDialogComponent,
                ticket_submission_dialog_component_1.TicketSubmissionDialogComponent,
                feedback_form_component_1.FeedbackForm,
                end_chat_dialog_component_1.EndChatDialogComponent,
                pre_chat_form_component_1.PreChatFormComponent
            ],
            providers: [
                ChatWindowCustomizations_1.ChatWindowCustomizations
            ]
        })
    ], ChatWindowModule);
    return ChatWindowModule;
}());
exports.ChatWindowModule = ChatWindowModule;
//# sourceMappingURL=chat-window.module.js.map