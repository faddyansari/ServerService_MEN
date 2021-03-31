"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketTemplatesListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var TicketTemplatesListComponent = /** @class */ (function () {
    function TicketTemplatesListComponent(_ticketTemplateService, dialog) {
        var _this = this;
        this._ticketTemplateService = _ticketTemplateService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.allTemplates = [];
        this.subscriptions.push(this._ticketTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                _this.allTemplates = data;
            }
            else {
                _this.allTemplates = [];
            }
        }));
    }
    TicketTemplatesListComponent.prototype.editTemplate = function (template) {
        this._ticketTemplateService.selectedTemplate.next(template);
    };
    TicketTemplatesListComponent.prototype.deleteTemplate = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this ticket template?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ticketTemplateService.DeleteTicketTemplate(id);
            }
        });
    };
    TicketTemplatesListComponent.prototype.cloneTemplate = function (template) {
        this._ticketTemplateService.cloneTemplate.next(true);
        var clonedTemplate = JSON.parse(JSON.stringify(template));
        clonedTemplate.templateName = "Copy of" + ' ' + clonedTemplate.templateName;
        template.message = '';
        this._ticketTemplateService.selectedTemplate.next(clonedTemplate);
    };
    TicketTemplatesListComponent.prototype.ngOnInit = function () {
    };
    TicketTemplatesListComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-templates-list',
            templateUrl: './ticket-templates-list.component.html',
            styleUrls: ['./ticket-templates-list.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketTemplatesListComponent);
    return TicketTemplatesListComponent;
}());
exports.TicketTemplatesListComponent = TicketTemplatesListComponent;
//# sourceMappingURL=ticket-templates-list.component.js.map