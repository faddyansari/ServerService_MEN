"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var chat_engagement_component_1 = require("../../pages/settings/chat-settings/chat-engagement/chat-engagement.component");
var chat_settings_timeouts_component_1 = require("../../pages/settings/chat-settings/chat-settings-timeouts/chat-settings-timeouts.component");
var file_sharing_component_1 = require("../../pages/settings/chat-settings/file-sharing/file-sharing.component");
var greeting_message_component_1 = require("../../pages/settings/chat-settings/greeting-message/greeting-message.component");
var transcript_forwarding_component_1 = require("../../pages/settings/chat-settings/transcript-forwarding/transcript-forwarding.component");
var shared_module_1 = require("../shared/shared.module");
var ChatSettingService_1 = require("../../../services/LocalServices/ChatSettingService");
var rules_component_1 = require("../../pages/settings/assignment-rules/rules/rules.component");
var rule_sets_component_1 = require("../../pages/settings/assignment-rules/rule-sets/rule-sets.component");
var AssignmentRuleService_1 = require("../../../services/LocalServices/AssignmentRuleService");
var banned_component_1 = require("../../pages/visitors/banned/banned.component");
var add_conversation_tags_component_1 = require("../../pages/settings/chat-settings/add-conversation-tags/add-conversation-tags.component");
var assignment_rules_component_1 = require("../../pages/settings/assignment-rules/assignment-rules.component");
var rulesets_list_component_1 = require("../../pages/settings/assignment-rules/rulesets-list/rulesets-list.component");
var rulesets_form_component_1 = require("../../pages/settings/assignment-rules/rulesets-form/rulesets-form.component");
var ngx_summernote_1 = require("ngx-summernote");
var chat_custom_fields_component_1 = require("../../pages/settings/assignment-rules/chat-custom-fields/chat-custom-fields.component");
var routes = [
    { path: '', redirectTo: 'engagement' },
    { path: 'engagement', component: chat_engagement_component_1.ChatEngagementComponent },
    { path: 'timeouts', component: chat_settings_timeouts_component_1.ChatSettingsTimeoutsComponent },
    { path: 'permissions', component: file_sharing_component_1.FileSharingComponent },
    { path: 'greetingmessage', component: greeting_message_component_1.GreetingMessageComponent },
    { path: 'transcript', component: transcript_forwarding_component_1.TranscriptForwardingComponent },
    { path: 'rules', component: rules_component_1.RulesComponent },
    { path: 'rulesets', component: assignment_rules_component_1.AssignmentRulesComponent },
    { path: 'bannedVisitors', component: banned_component_1.BannedComponent },
    { path: 'tags', component: add_conversation_tags_component_1.AddConversationTagsComponent },
    { path: 'customFields', component: chat_custom_fields_component_1.ChatCustomFieldsComponent }
];
var ChatSettingsModule = /** @class */ (function () {
    function ChatSettingsModule() {
    }
    ChatSettingsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                ngx_summernote_1.NgxSummernoteModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [router_1.RouterModule],
            providers: [
                ChatSettingService_1.ChatSettingService,
                AssignmentRuleService_1.AssignmentAutomationSettingsService
            ],
            declarations: [
                chat_engagement_component_1.ChatEngagementComponent,
                chat_settings_timeouts_component_1.ChatSettingsTimeoutsComponent,
                file_sharing_component_1.FileSharingComponent,
                greeting_message_component_1.GreetingMessageComponent,
                transcript_forwarding_component_1.TranscriptForwardingComponent,
                rules_component_1.RulesComponent,
                rule_sets_component_1.RuleSetsComponent,
                banned_component_1.BannedComponent,
                add_conversation_tags_component_1.AddConversationTagsComponent,
                assignment_rules_component_1.AssignmentRulesComponent,
                rulesets_list_component_1.RulesetsListComponent,
                rulesets_form_component_1.RulesetsFormComponent,
                chat_custom_fields_component_1.ChatCustomFieldsComponent
            ]
        })
    ], ChatSettingsModule);
    return ChatSettingsModule;
}());
exports.ChatSettingsModule = ChatSettingsModule;
//# sourceMappingURL=chat-settings.module.js.map