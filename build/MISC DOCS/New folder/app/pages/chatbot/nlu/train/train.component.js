"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NluTrainComponent = void 0;
var core_1 = require("@angular/core");
var NluTrainComponent = /** @class */ (function () {
    function NluTrainComponent(BotService, router) {
        var _this = this;
        this.BotService = BotService;
        this.router = router;
        this.subscriptions = [];
        this.intent_list = [];
        this.t_phrase_list = [];
        this.entities_list = [];
        this.synonym_list = [];
        this.regex_list = [];
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
    }
    // href_data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.rasaJSON));
    NluTrainComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    NluTrainComponent.prototype.ngOnInit = function () {
    };
    NluTrainComponent.prototype.ngAfterViewInit = function () {
        // this.createCustomJSON();
        var _this = this;
        setTimeout(function () {
            _this.createCustomJSON();
        }, 1000);
    };
    NluTrainComponent.prototype.back = function () {
        this.router.navigateByUrl('/chatbot/nlu');
    };
    NluTrainComponent.prototype.createCustomJSON = function () {
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
    NluTrainComponent.prototype.downloadObjectAsJson = function (exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    NluTrainComponent = __decorate([
        core_1.Component({
            selector: 'app-nlu-train',
            templateUrl: './train.component.html',
            styleUrls: ['./train.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], NluTrainComponent);
    return NluTrainComponent;
}());
exports.NluTrainComponent = NluTrainComponent;
//# sourceMappingURL=train.component.js.map