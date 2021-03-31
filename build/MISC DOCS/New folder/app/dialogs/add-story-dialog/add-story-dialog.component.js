"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStoryDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var AddStoryDialogComponent = /** @class */ (function () {
    function AddStoryDialogComponent(formbuilder, 
    //private _validationService: ValidationService,
    dialogRef) {
        this.formbuilder = formbuilder;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.addStoryForm = formbuilder.group({
            'story_name': [null, forms_1.Validators.required] //this._validationService.RequiredValidator
        });
    }
    AddStoryDialogComponent.prototype.ngOnInit = function () {
    };
    AddStoryDialogComponent.prototype.ngAfterViewInit = function () { };
    AddStoryDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AddStoryDialogComponent.prototype.submitForm = function (form) {
        if (this.addStoryForm.valid) {
            this.dialogRef.close({ data: this.addStoryForm.get('story_name').value });
        }
    };
    AddStoryDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-story-dialog',
            templateUrl: './add-story-dialog.component.html',
            styleUrls: ['./add-story-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddStoryDialogComponent);
    return AddStoryDialogComponent;
}());
exports.AddStoryDialogComponent = AddStoryDialogComponent;
//# sourceMappingURL=add-story-dialog.component.js.map