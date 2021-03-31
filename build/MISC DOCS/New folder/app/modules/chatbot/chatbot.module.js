"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var shared_module_1 = require("../shared/shared.module");
var nlu_component_1 = require("../../pages/chatbot/nlu/nlu.component");
var data_prep_component_1 = require("../../pages/chatbot/nlu/data-prep/data-prep.component");
var train_component_1 = require("../../pages/chatbot/nlu/train/train.component");
var core_component_1 = require("../../pages/chatbot/core/core.component");
var data_prep_component_2 = require("../../pages/chatbot/core/data-prep/data-prep.component");
var train_component_2 = require("../../pages/chatbot/core/train/train.component");
var chatbot_component_1 = require("../../pages/chatbot/chatbot.component");
var dp_synonyms_component_1 = require("../../pages/chatbot/nlu/data-prep/dp-synonyms/dp-synonyms.component");
var dp_actions_component_1 = require("../../pages/chatbot/core/data-prep/dp-actions/dp-actions.component");
var dp_entity_component_1 = require("../../pages/chatbot/nlu/data-prep/dp-entity/dp-entity.component");
var dp_intent_component_1 = require("../../pages/chatbot/nlu/data-prep/dp-intent/dp-intent.component");
var dp_regex_component_1 = require("../../pages/chatbot/nlu/data-prep/dp-regex/dp-regex.component");
var dp_stories_component_1 = require("../../pages/chatbot/core/data-prep/dp-stories/dp-stories.component");
var resp_function_component_1 = require("../../pages/chatbot/core/data-prep/resp-function/resp-function.component");
var routes = [
    {
        path: '',
        component: chatbot_component_1.ChatbotComponent,
        children: [
            { path: '', redirectTo: 'nlu' },
            { path: 'nlu', children: [
                    { path: '', redirectTo: 'data-prep' },
                    { path: 'data-prep', component: data_prep_component_1.NluDataPrepComponent },
                    { path: 'train', component: train_component_1.NluTrainComponent },
                ], component: nlu_component_1.NluComponent },
            { path: 'core', children: [
                    { path: '', redirectTo: 'data-prep' },
                    { path: 'data-prep', component: data_prep_component_2.CoreDataPrepComponent },
                    { path: 'train', component: train_component_2.CoreTrainComponent },
                ], component: core_component_1.CoreComponent },
        ],
    }
];
var ChatbotModule = /** @class */ (function () {
    function ChatbotModule() {
    }
    ChatbotModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild(routes)
            ],
            exports: [
                router_1.RouterModule
            ],
            declarations: [
                chatbot_component_1.ChatbotComponent,
                nlu_component_1.NluComponent,
                data_prep_component_1.NluDataPrepComponent,
                train_component_1.NluTrainComponent,
                core_component_1.CoreComponent,
                data_prep_component_2.CoreDataPrepComponent,
                train_component_2.CoreTrainComponent,
                dp_synonyms_component_1.DpSynonymsComponent,
                dp_actions_component_1.DpActionsComponent,
                dp_entity_component_1.DpEntityComponent,
                dp_intent_component_1.DpIntentComponent,
                dp_regex_component_1.DpRegexComponent,
                dp_stories_component_1.DpStoriesComponent,
                resp_function_component_1.RespFunctionComponent,
            ]
        })
    ], ChatbotModule);
    return ChatbotModule;
}());
exports.ChatbotModule = ChatbotModule;
//# sourceMappingURL=chatbot.module.js.map