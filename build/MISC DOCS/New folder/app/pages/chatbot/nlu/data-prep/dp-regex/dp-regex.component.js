"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpRegexComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var DpRegexComponent = /** @class */ (function () {
    function DpRegexComponent(BotService, formbuilder, dialog) {
        var _this = this;
        this.BotService = BotService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.entity_list = [];
        this.intent_list = [];
        this.regex_list = [];
        this.regex_value = '';
        this.selectedValue = '';
        this.inputUser = '';
        this.showRegexForm = false;
        this.RegexForm = formbuilder.group({
            'regex_value': ['', forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getEntity().subscribe(function (data) {
            _this.entity_list = data;
        }));
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
        this.subscriptions.push(BotService.getRegex().subscribe(function (data) {
            _this.regex_list = data;
        }));
    }
    DpRegexComponent.prototype.ngOnInit = function () {
    };
    DpRegexComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DpRegexComponent.prototype.getUserInput = function () {
        this.BotService.userInput(this.inputUser).subscribe(function (response) {
            console.log(response);
        });
    };
    DpRegexComponent.prototype.selectEntity = function (event) {
        this.selectedValue = event.target.value;
    };
    DpRegexComponent.prototype.selectIntent = function (event) {
        this.selectedValue = event.target.value;
    };
    DpRegexComponent.prototype.addRegexValue = function (value) {
        this.RegexForm.get('regex_value').setValue('');
        this.selectedValue = '';
        this.BotService.addRegexValue(value);
    };
    DpRegexComponent.prototype.deleteRegexValue = function (regValue, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete this Value??? It will also delete regex of this value!" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.regex_list.splice(index, 1);
                _this.BotService.deleteRegexValues(regValue);
            }
        });
    };
    // onAddTag(tag, reg_list){
    //   this.BotService.addRegex(tag.value, reg_list);
    // }
    DpRegexComponent.prototype.onEnter = function (tag, reg_list) {
        var _this = this;
        this.regex_list.map(function (p) {
            if (p._id == reg_list._id) {
                // if(p.regex.length > 0){
                //   console.log('Can not enter multiple regex for single value.');
                // }else{
                // p.regex.push(tag);
                _this.BotService.addRegex(tag, reg_list);
                // }
            }
        });
        this.AddReg.nativeElement.value = '';
    };
    // onRemoveTag(tag, reg_list){
    //   this.BotService.removeRegex(tag, reg_list);
    // }
    DpRegexComponent.prototype.toggleRegexForm = function () {
        this.showRegexForm = !this.showRegexForm;
    };
    DpRegexComponent.prototype.onRemoveTag = function (tagIndex, reg_list) {
        this.BotService.removeRegex(tagIndex, reg_list);
        // this.regex_list.map(p=>{
        //   if(p._id == reg_list._id){
        //     p.regex.splice(tagIndex,1);
        //   }
        // })
    };
    __decorate([
        core_1.ViewChild('box')
    ], DpRegexComponent.prototype, "AddReg", void 0);
    DpRegexComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-regex',
            templateUrl: './dp-regex.component.html',
            styleUrls: ['./dp-regex.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DpRegexComponent);
    return DpRegexComponent;
}());
exports.DpRegexComponent = DpRegexComponent;
//# sourceMappingURL=dp-regex.component.js.map