import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatBubbleComponent } from '../../pages/settings/chat-window/chat-bubble/chat-bubble.component';
import { ThemeComponent } from '../../pages/settings/chat-window/theme/theme.component';
import { DialogThemeComponent } from '../../pages/settings/chat-window/dialog-theme/dialog-theme.component';
import { MessageWindowComponent } from '../../pages/settings/chat-window/message-window/message-window.component';
import { NoagentTicketDialogComponent } from '../../pages/settings/chat-window/noagent-ticket-dialog/noagent-ticket-dialog.component';
import { TicketFormDialogComponent } from '../../pages/settings/chat-window/ticket-form-dialog/ticket-form-dialog.component';
import { TicketSubmissionDialogComponent } from '../../pages/settings/chat-window/ticket-submission-dialog/ticket-submission-dialog.component';
import { FeedbackForm } from '../../pages/settings/chat-window/feedback-form/feedback-form.component';
import { EndChatDialogComponent } from '../../pages/settings/chat-window/end-chat-dialog/end-chat-dialog.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChatWindowCustomizations } from '../../../services/LocalServices/ChatWindowCustomizations';
import { PreChatFormComponent } from '../../pages/settings/chat-window/pre-chat-form/pre-chat-form.component';


const routes: Routes = [
    { path: '', redirectTo: 'bubble' },
    { path: 'bubble', component: ChatBubbleComponent },
    { path: 'theme', component: ThemeComponent },
    { path: 'dialog', component: DialogThemeComponent },
    { path: 'window', component: MessageWindowComponent },
    { path: 'agent', component: NoagentTicketDialogComponent },
    { path: 'ticketform', component: TicketFormDialogComponent },
    { path: 'ticketsubmit', component: TicketSubmissionDialogComponent },
    { path: 'feedback', component: FeedbackForm },
    { path: 'endchat', component: EndChatDialogComponent },
    { path: 'preChatSurvey', component: PreChatFormComponent }
];

@NgModule({
    imports: [
        CommonModule,
        ColorPickerModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: [
        ChatBubbleComponent,
        ThemeComponent,
        DialogThemeComponent,
        MessageWindowComponent,
        NoagentTicketDialogComponent,
        TicketFormDialogComponent,
        TicketSubmissionDialogComponent,
        FeedbackForm,
        EndChatDialogComponent,
        PreChatFormComponent
    ],
    providers: [
        ChatWindowCustomizations
    ]
})
export class ChatWindowModule { }