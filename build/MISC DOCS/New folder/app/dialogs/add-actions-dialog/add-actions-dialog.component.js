"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddActionsDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var AddActionsDialogComponent = /** @class */ (function () {
    function AddActionsDialogComponent(formbuilder, 
    //private _validationService: ValidationService,
    dialogRef) {
        this.formbuilder = formbuilder;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.addActionForm = formbuilder.group({
            'action_name': [null, forms_1.Validators.required],
            'endpoint_url': [null, forms_1.Validators.required],
            'template': [null, forms_1.Validators.required]
        });
    }
    AddActionsDialogComponent.prototype.ngOnInit = function () {
    };
    AddActionsDialogComponent.prototype.ngAfterViewInit = function () { };
    AddActionsDialogComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AddActionsDialogComponent.prototype.submitForm = function (form) {
        if (this.addActionForm.valid) {
            this.dialogRef.close({ data: { action_name: this.addActionForm.get('action_name').value, endpoint_url: this.addActionForm.get('endpoint_url').value, template: this.addActionForm.get('template').value } });
        }
    };
    AddActionsDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-actions-dialog',
            templateUrl: './add-actions-dialog.component.html',
            styleUrls: ['./add-actions-dialog.component.css']
        })
    ], AddActionsDialogComponent);
    return AddActionsDialogComponent;
}());
exports.AddActionsDialogComponent = AddActionsDialogComponent;
//# sourceMappingURL=add-actions-dialog.component.js.map