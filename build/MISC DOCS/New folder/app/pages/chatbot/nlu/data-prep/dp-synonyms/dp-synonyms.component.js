"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpSynonymsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var DpSynonymsComponent = /** @class */ (function () {
    function DpSynonymsComponent(formbuilder, dialog, BotService) {
        var _this = this;
        this.dialog = dialog;
        this.BotService = BotService;
        this.subscriptions = [];
        this.phrase_values = [];
        this.synonym_list = [];
        this.selectedValue = '';
        this.showSynonymForm = false;
        this.SynonymForm = formbuilder.group({
            'entity_value': ['', forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getTPhrase().subscribe(function (data) {
            if (data.length) {
                _this.phrase_values = [];
                data.forEach(function (phrase) {
                    phrase.entities.forEach(function (entity) {
                        if (!_this.phrase_values.filter(function (p) { return p.value == entity.value; }).length) {
                            _this.phrase_values.push({ value: entity.value, id: entity.id });
                        }
                    });
                });
            }
        }));
        this.subscriptions.push(BotService.getSynonym().subscribe(function (data) {
            _this.synonym_list = data;
        }));
    }
    DpSynonymsComponent.prototype.ngOnInit = function () {
    };
    DpSynonymsComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DpSynonymsComponent.prototype.selectSynonymValue = function (event) {
        this.selectedValue = event.target.value;
    };
    DpSynonymsComponent.prototype.toggleSynonymForm = function () {
        this.showSynonymForm = !this.showSynonymForm;
    };
    DpSynonymsComponent.prototype.addSynonymValue = function (value) {
        this.SynonymForm.get('entity_value').setValue('');
        this.selectedValue = '';
        this.BotService.addSynonymValues(value);
    };
    DpSynonymsComponent.prototype.deleteSynonymValue = function (synValue, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete this Value??? It will also delete all synonyms of this value!" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.synonym_list.splice(index, 1);
                _this.BotService.deleteSynonymValues(synValue);
            }
        });
    };
    // onAddTag(tag, syn_list){
    //   this.BotService.addSynonym(tag.value, syn_list);
    // }
    DpSynonymsComponent.prototype.onEnter = function (tag, syn_list) {
        var _this = this;
        this.synonym_list.map(function (p) {
            if (p._id == syn_list._id) {
                //if(p.synonyms.filter(data => data == tag).length > 0){
                //  console.log('synonym already exist');
                //}else{
                //p.synonyms.push(tag);
                _this.BotService.addSynonym(tag, syn_list);
                //}
            }
        });
        console.log(event.target);
        event.target.value = '';
        console.log(event.target.value);
    };
    DpSynonymsComponent.prototype.onRemoveTag = function (tagIndex, syn_list) {
        this.BotService.removeSynonym(tagIndex, syn_list);
        //   this.synonym_list.map(p=>{
        //     if(p._id == syn_list._id){
        //       p.synonyms.splice(tagIndex,1);
        //     }
        //   })
    };
    __decorate([
        core_1.ViewChild('box')
    ], DpSynonymsComponent.prototype, "AddSyn", void 0);
    DpSynonymsComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-synonyms',
            templateUrl: './dp-synonyms.component.html',
            styleUrls: ['./dp-synonyms.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DpSynonymsComponent);
    return DpSynonymsComponent;
}());
exports.DpSynonymsComponent = DpSynonymsComponent;
//# sourceMappingURL=dp-synonyms.component.js.map