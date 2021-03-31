"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var FormsListComponent = /** @class */ (function () {
    function FormsListComponent(_formDesignerService, dialog) {
        var _this = this;
        this._formDesignerService = _formDesignerService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.Forms = [];
        this.subscriptions.push(this._formDesignerService.WholeForm.subscribe(function (data) {
            if (data && data.length) {
                _this.Forms = data;
                // console.log(this.Forms);
            }
        }));
    }
    FormsListComponent.prototype.ngOnInit = function () {
    };
    FormsListComponent.prototype.EditForm = function (form) {
        this._formDesignerService.selectedForm.next(form);
    };
    FormsListComponent.prototype.DeleteForm = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this form?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._formDesignerService.DeleteForm(id);
            }
        });
    };
    FormsListComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        // this._formDesignerService.Destroy();
    };
    FormsListComponent = __decorate([
        core_1.Component({
            selector: 'app-forms-list',
            templateUrl: './forms-list.component.html',
            styleUrls: ['./forms-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FormsListComponent);
    return FormsListComponent;
}());
exports.FormsListComponent = FormsListComponent;
//# sourceMappingURL=forms-list.component.js.map