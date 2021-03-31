"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreTrainComponent = void 0;
var core_1 = require("@angular/core");
var CoreTrainComponent = /** @class */ (function () {
    function CoreTrainComponent(BotService, router) {
        var _this = this;
        this.BotService = BotService;
        this.router = router;
        this.story_list = [];
        this.intent_list = [];
        this.resp_func_list = [];
        this.action_list = [];
        this.entities_list = [];
        this.slot_list = [];
        this.subscriptions = [];
        this.stories_data = '';
        this.domain_data = '';
        this.t_phrase_list = [];
        this.synonym_list = [];
        this.regex_list = [];
        this.loader = false;
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
        this.subscriptions.push(BotService.getTPhrase().subscribe(function (data) {
            _this.t_phrase_list = data;
        }));
        this.subscriptions.push(BotService.getEntity().subscribe(function (data) {
            _this.entities_list = data;
        }));
        this.subscriptions.push(BotService.getSynonym().subscribe(function (data) {
            _this.synonym_list = data;
        }));
        this.subscriptions.push(BotService.getRegex().subscribe(function (data) {
            _this.regex_list = data;
        }));
        this.subscriptions.push(BotService.rasa_JSON.subscribe(function (data) {
            _this.rasaJSON = data;
        }));
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
        this.subscriptions.push(BotService.getRespFunc().subscribe(function (data) {
            _this.resp_func_list = data;
        }));
        this.subscriptions.push(BotService.getStories().subscribe(function (data) {
            _this.story_list = data;
        }));
        this.subscriptions.push(BotService.getEntity().subscribe(function (data) {
            _this.entities_list = data;
        }));
        this.subscriptions.push(BotService.rasa_JSON.subscribe(function (data) {
            _this.rasaJSON = data;
        }));
        this.subscriptions.push(BotService.action_list.subscribe(function (data) {
            _this.action_list = data;
        }));
    }
    CoreTrainComponent.prototype.ngOnInit = function () {
    };
    CoreTrainComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.createCustomJSON();
            _this.load_domain();
            _this.load_stories();
        }, 1000);
    };
    CoreTrainComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    //Helpers
    CoreTrainComponent.prototype.getIntentName = function (intent_id) {
        if (intent_id && this.intent_list.filter(function (i) { return i._id == intent_id; }).length) {
            return this.intent_list.filter(function (i) { return i._id == intent_id; })[0].name;
        }
        else {
            return intent_id;
        }
    };
    CoreTrainComponent.prototype.getResponseName = function (resp_id) {
        if (resp_id && this.resp_func_list.filter(function (i) { return i._id == resp_id; }).length) {
            return this.resp_func_list.filter(function (i) { return i._id == resp_id; })[0].func_name;
        }
        else {
            return resp_id;
        }
    };
    CoreTrainComponent.prototype.getActionName = function (act_id) {
        if (act_id && this.action_list.filter(function (i) { return i._id == act_id; }).length) {
            return this.action_list.filter(function (i) { return i._id == act_id; })[0].action_name;
        }
        else {
            return act_id;
        }
    };
    CoreTrainComponent.prototype.createCustomJSON = function () {
        var commonexamples = [];
        var entity_synonyms = [];
        var regex_features = [];
        // console.log(this.entities_list)
        var phrase_list = JSON.parse(JSON.stringify(this.t_phrase_list));
        var entities_list = JSON.parse(JSON.stringify(this.entities_list));
        var synonym_list = JSON.parse(JSON.stringify(this.synonym_list));
        var regex_list = JSON.parse(JSON.stringify(this.regex_list));
        this.intent_list.forEach(function (i) {
            var phrases = phrase_list.filter(function (t) { return t.intent_id == i._id; });
            //  console.log(phrase);
            if (phrases.length) {
                phrases.forEach(function (phrase) {
                    phrase.entities.forEach(function (element, index) {
                        if (entities_list.filter(function (e) { return e._id == element.entity; }).length) {
                            element.entity = entities_list.filter(function (e) { return e._id == element.entity; })[0].entity_name;
                        }
                        else {
                            phrase.entities.splice(index, 1);
                        }
                    });
                    phrase.entities.filter(function (e) {
                        delete e['id'];
                        delete e['entity_del'];
                    });
                    commonexamples.push({
                        intent: i.name,
                        entities: phrase.entities,
                        text: phrase.text.toLowerCase()
                    });
                });
            }
        });
        this.synonym_list.forEach(function (p) {
            if (p.synonyms.length) {
                entity_synonyms.push({
                    value: p.entity_value,
                    synonyms: p.synonyms
                });
            }
        });
        this.regex_list.forEach(function (p) {
            if (p.regex.length) {
                regex_features.push({
                    name: p.regex_value,
                    pattern: JSON.parse(JSON.stringify(p.regex[0]))
                });
            }
        });
        this.rasaJSON.rasa_nlu_data.common_examples = commonexamples;
        this.rasaJSON.rasa_nlu_data.entity_synonyms = entity_synonyms;
        this.rasaJSON.rasa_nlu_data.regex_features = regex_features;
        this.BotService.setRasaJSON(this.rasaJSON);
        //console.log(this.rasaJSON);
        //this.downloadObjectAsJson(this.rasaJSON,'data');
        // console.log(this.t_phrase_list);
    };
    CoreTrainComponent.prototype.load_stories = function () {
        var _this = this;
        var data = '';
        this.story_list.forEach(function (story) {
            data += '## ' + story.story_name + '\n';
            story.intents.forEach(function (intent) {
                data += '* ' + _this.getIntentName(intent.intent_id) + '\n';
                intent.respFuncs.forEach(function (resp) {
                    data += '    - ' + _this.getResponseName(resp) + '\n';
                });
                intent.actions.forEach(function (act) {
                    data += '    - ' + _this.getActionName(act) + '\n';
                });
            });
            data += '\n';
        });
        //console.log(data);
        this.stories_data = data;
        // console.log(data);
    };
    CoreTrainComponent.prototype.load_domain = function () {
        var data = 'entities:\n';
        this.entities_list.forEach(function (entity) {
            if (!entity.del) {
                data += '  - ' + entity.entity_name + '\n';
            }
        });
        data += '\nintents:\n';
        this.intent_list.forEach(function (intent) {
            if (!intent.del) {
                data += '  - ' + intent.name + '\n';
            }
        });
        //data += '\nslots:\n';
        data += '\ntemplates:\n';
        this.resp_func_list.forEach(function (resp_func) {
            if (!resp_func.del) {
                data += '  ' + resp_func.func_name + ':\n';
                resp_func.response.forEach(function (resp) {
                    if (!resp.resp_del) {
                        data += '    - text: "' + resp.text + '"\n';
                    }
                });
            }
        });
        data += '\nactions:\n';
        this.resp_func_list.forEach(function (resp_func) {
            if (!resp_func.del) {
                data += '  - ' + resp_func.func_name + '\n';
            }
        });
        this.action_list.forEach(function (action) {
            if (!action.del) {
                data += '  - ' + action.action_name + '\n';
            }
        });
        this.domain_data = data;
    };
    CoreTrainComponent.prototype.back = function () {
        this.router.navigateByUrl('/chatbot/core');
    };
    CoreTrainComponent.prototype.Execute = function () {
        var _this = this;
        this.loader = true;
        this.BotService.Execute(this.domain_data, this.stories_data, this.rasaJSON).subscribe(function (res) {
            // if(res.status == "ok"){
            _this.loader = false;
        });
    };
    CoreTrainComponent = __decorate([
        core_1.Component({
            selector: 'app-core-train',
            templateUrl: './train.component.html',
            styleUrls: ['./train.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], CoreTrainComponent);
    return CoreTrainComponent;
}());
exports.CoreTrainComponent = CoreTrainComponent;
//# sourceMappingURL=train.component.js.map