"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpEntityComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var DpEntityComponent = /** @class */ (function () {
    function DpEntityComponent(formbuilder, dialog, BotService) {
        var _this = this;
        this.dialog = dialog;
        this.BotService = BotService;
        this.subscriptions = [];
        this.entity_list = [];
        this.t_phrase_list = [];
        this.slot_list = [];
        this.entityId = 0;
        this.updatedEntity = '';
        this.showEntityForm = false;
        this.EntityForm = formbuilder.group({
            'entity_name': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getEntity().subscribe(function (data) {
            _this.entity_list = data;
            // this.list=data;
        }));
        this.subscriptions.push(BotService.getTPhrase().subscribe(function (data) {
            _this.t_phrase_list = data;
        }));
    }
    DpEntityComponent.prototype.ngOnInit = function () {
        this.slot_list.push({
            id: this.slot_list.length + 1,
            value: 'text'
        }, {
            id: this.slot_list.length + 1,
            value: 'bool'
        }, {
            id: this.slot_list.length + 1,
            value: 'categorical'
        }, {
            id: this.slot_list.length + 1,
            value: 'float'
        }, {
            id: this.slot_list.length + 1,
            value: 'list'
        }, {
            id: this.slot_list.length + 1,
            value: 'unfeaturized'
        }, {
            id: this.slot_list.length + 1,
            value: 'Not Used'
        });
    };
    DpEntityComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DpEntityComponent.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    DpEntityComponent.prototype.AddEntity = function (name) {
        var color = this.getRandomColor();
        var slot_type = "";
        this.BotService.addEntity(name, slot_type, color);
        this.EntityForm.reset();
    };
    DpEntityComponent.prototype.selectSlotType = function (entity, event) {
        this.BotService.selSlotType(entity, event.target.value);
    };
    DpEntityComponent.prototype.toggleEntityForm = function () {
        this.showEntityForm = !this.showEntityForm;
    };
    DpEntityComponent.prototype.editEntity = function (entity) {
        var _this = this;
        this.updatedEntity = '';
        this.entity_list.map(function (i) {
            if (i._id == entity._id) {
                _this.updatedEntity = i.entity_name;
                i.editable = true;
                return i;
            }
        });
    };
    DpEntityComponent.prototype.updateEntity = function (entity) {
        entity.editable = false;
        this.BotService.updateEntity(entity, this.updatedEntity);
        this.updatedEntity = '';
        // this.BotService.updateEntityList(this.entity_list);
        // this.BotService.updateTPhraseList(this.t_phrase_list);
    };
    DpEntityComponent.prototype.cancelEdit = function (entity) {
        this.entity_list.map(function (i) {
            if (i.id == entity.id) {
                i.editable = false;
                return i;
            }
        });
    };
    DpEntityComponent.prototype.deleteEntity = function (entity, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete " + entity.entity_name + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.entity_list.splice(index, 1);
                _this.BotService.deleteEntity(entity._id);
            }
            // this.BotService.updateEntityList(this.entity_list);
        });
    };
    DpEntityComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-entity',
            templateUrl: './dp-entity.component.html',
            styleUrls: ['./dp-entity.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DpEntityComponent);
    return DpEntityComponent;
}());
exports.DpEntityComponent = DpEntityComponent;
//# sourceMappingURL=dp-entity.component.js.map