"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContactDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var AddContactDialogComponent = /** @class */ (function () {
    function AddContactDialogComponent(_authService, formbuilder, dialogRef, _socket) {
        this._authService = _authService;
        this.formbuilder = formbuilder;
        this.dialogRef = dialogRef;
        this._socket = _socket;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.loading = false;
        this.isEmailUnique = true;
        this.contactRegForm = formbuilder.group({
            'name': [null, forms_1.Validators.required],
            'phone_no': ['',
                [
                    forms_1.Validators.pattern(/^[0-9\-]+$/),
                    forms_1.Validators.required
                ]
            ],
            'email': ['',
                [
                    forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required
                ]
            ],
        });
    }
    AddContactDialogComponent.prototype.ngOnInit = function () { };
    AddContactDialogComponent.prototype.ngAfterViewInit = function () { };
    AddContactDialogComponent.prototype.ngOnDestroy = function () { };
    AddContactDialogComponent.prototype.NumbersOnly = function (event) {
        var pattern = /[0-9\-]+/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    AddContactDialogComponent.prototype.submitForm = function (form) {
        //this.contactRegForm.valid
        if (this.contactRegForm.valid) {
            var contact = {
                name: this.contactRegForm.get('name').value,
                phone_no: this.contactRegForm.get('phone_no').value,
                email: this.contactRegForm.get('email').value,
                image: null
            };
            this.dialogRef.close(contact);
        }
    };
    AddContactDialogComponent.prototype.Close = function (event) {
        this.dialogRef.close();
    };
    AddContactDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-contact-dialog',
            templateUrl: './add-contact-dialog.component.html',
            styleUrls: ['./add-contact-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AddContactDialogComponent);
    return AddContactDialogComponent;
}());
exports.AddContactDialogComponent = AddContactDialogComponent;
//# sourceMappingURL=add-contact-dialog.component.js.map