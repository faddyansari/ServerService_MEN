"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var EmailTemplateListComponent = /** @class */ (function () {
    function EmailTemplateListComponent(_globalStateService, _emailTemplateService, dialog) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._emailTemplateService = _emailTemplateService;
        this.dialog = dialog;
        this.all_templates = [];
        this.Object = Object;
        this.subscriptions = [];
        this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                _this.all_templates = data;
            }
        }));
        this._globalStateService.currentRoute.subscribe(function (route) {
            _this.currentRoute = route;
        });
    }
    EmailTemplateListComponent.prototype.ngOnInit = function () {
    };
    EmailTemplateListComponent.prototype.isEmpty = function () {
        for (var key in this) {
            if (this.hasOwnProperty(key))
                return false;
        }
        return true;
    };
    EmailTemplateListComponent.prototype.DeleteTemplate = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this template?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._emailTemplateService.DeleteTemplate(id);
            }
        });
    };
    EmailTemplateListComponent.prototype.EditTemplate = function (template) {
        console.log(template.sourceType);
        this._emailTemplateService.selectedTemplate.next(template);
        // if (template.sourceType.toString() != 'htmlEditor' || template.sourceType.toString() != 'importTemplate'){
        //   console.log("here", this.currentRoute + '/template-options/builder/' +template.sourceType);
        //   this._globalStateService.NavigateTo(this.currentRoute + '/template-options/builder/' +template.sourceType);
        //   return;
        // }
        // else {
        switch (template.sourceType) {
            case 'htmlEditor':
                this._globalStateService.NavigateTo(this.currentRoute + '/template-options/htmlEditor');
                break;
            case 'importTemplate':
                this._globalStateService.NavigateTo(this.currentRoute + '/template-options/importTemplate');
                break;
            default:
                this._globalStateService.NavigateTo(this.currentRoute + '/template-options/builder/' + template.sourceType);
            // }
        }
    };
    EmailTemplateListComponent = __decorate([
        core_1.Component({
            selector: 'app-email-template-list',
            templateUrl: './email-template-list.component.html',
            styleUrls: ['./email-template-list.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], EmailTemplateListComponent);
    return EmailTemplateListComponent;
}());
exports.EmailTemplateListComponent = EmailTemplateListComponent;
//# sourceMappingURL=email-template-list.component.js.map