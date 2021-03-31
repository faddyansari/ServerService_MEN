import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChatEngagementComponent } from '../../pages/settings/chat-settings/chat-engagement/chat-engagement.component';
import { ChatSettingsTimeoutsComponent } from '../../pages/settings/chat-settings/chat-settings-timeouts/chat-settings-timeouts.component';
import { FileSharingComponent } from '../../pages/settings/chat-settings/file-sharing/file-sharing.component';
import { GreetingMessageComponent } from '../../pages/settings/chat-settings/greeting-message/greeting-message.component';
import { TranscriptForwardingComponent } from '../../pages/settings/chat-settings/transcript-forwarding/transcript-forwarding.component';
import { SharedModule } from '../shared/shared.module';
import { ChatSettingService } from '../../../services/LocalServices/ChatSettingService';
import { RulesComponent } from '../../pages/settings/assignment-rules/rules/rules.component';
import { RuleSetsComponent } from '../../pages/settings/assignment-rules/rule-sets/rule-sets.component';
import { AssignmentAutomationSettingsService } from '../../../services/LocalServices/AssignmentRuleService';
import { BannedComponent } from '../../pages/visitors/banned/banned.component';
import { AddConversationTagsComponent } from '../../pages/settings/chat-settings/add-conversation-tags/add-conversation-tags.component';
import { AssignmentRulesComponent } from '../../pages/settings/assignment-rules/assignment-rules.component';
import { RulesetsListComponent } from '../../pages/settings/assignment-rules/rulesets-list/rulesets-list.component';
import { RulesetsFormComponent, } from '../../pages/settings/assignment-rules/rulesets-form/rulesets-form.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ChatCustomFieldsComponent } from '../../pages/settings/assignment-rules/chat-custom-fields/chat-custom-fields.component';
const routes: Routes = [
    { path: '', redirectTo: 'engagement' },
    { path: 'engagement', component: ChatEngagementComponent },
    { path: 'timeouts', component: ChatSettingsTimeoutsComponent },
    { path: 'permissions', component: FileSharingComponent },
    { path: 'greetingmessage', component: GreetingMessageComponent },
    { path: 'transcript', component: TranscriptForwardingComponent },
    { path: 'rules', component: RulesComponent },
    { path: 'rulesets', component: AssignmentRulesComponent },
    { path: 'bannedVisitors', component: BannedComponent },
    { path: 'tags', component: AddConversationTagsComponent },
    { path: 'customFields', component: ChatCustomFieldsComponent }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NgxSummernoteModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: [
        ChatSettingService,
        AssignmentAutomationSettingsService
    ],
    declarations: [
        ChatEngagementComponent,
        ChatSettingsTimeoutsComponent,
        FileSharingComponent,
        GreetingMessageComponent,
        TranscriptForwardingComponent,
        RulesComponent,
        RuleSetsComponent,
        BannedComponent,
        AddConversationTagsComponent,
        AssignmentRulesComponent,
        RulesetsListComponent,
        RulesetsFormComponent,
        ChatCustomFieldsComponent
    ]
})
export class ChatSettingsModule { }