"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconCustomerSearchComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var IconCustomerSearchComponent = /** @class */ (function () {
    function IconCustomerSearchComponent(formbuilder) {
        this.formbuilder = formbuilder;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.whiteSpaceRegex = /^[^\s]+(\s+[^\s]+)*$/;
        this.phoneNumberRegex = /^([+]{1})?\d+$/;
        this.numbersOnly = /^[0-9]*$/;
        /**INPUTS AND OUTPUTS */
        this.loadingIconSearch = false;
        this.searchData = new core_1.EventEmitter();
        this.searchCustomerForm = this.formbuilder.group({
            'customerId': ['', [forms_1.Validators.pattern(this.whiteSpaceRegex), forms_1.Validators.pattern(this.numbersOnly)]],
            'emailAddress': ['', [forms_1.Validators.pattern(this.emailPattern)]],
            'phoneNumber': ['', [forms_1.Validators.pattern(this.phoneNumberRegex), forms_1.Validators.maxLength(15)]]
        });
    }
    Object.defineProperty(IconCustomerSearchComponent.prototype, "searchedData", {
        get: function () {
            return this._searchedData;
        },
        set: function (value) {
            this._searchedData = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IconCustomerSearchComponent.prototype, "selectedThread", {
        get: function () {
            return this._selectedThread;
        },
        set: function (value) {
            this._selectedThread = value;
            this.searchCustomerForm.get('customerId').setValue('');
            this.searchCustomerForm.get('emailAddress').setValue('');
            this.searchCustomerForm.get('phoneNumber').setValue('');
            this.searchedData = [];
            this._searchedData = [];
        },
        enumerable: false,
        configurable: true
    });
    ;
    IconCustomerSearchComponent.prototype.ngOnInit = function () {
    };
    IconCustomerSearchComponent.prototype.SubmitForm = function () {
        this.searchData.emit(this.searchCustomerForm.value);
    };
    IconCustomerSearchComponent.prototype.typeof = function (value) {
        return typeof value;
    };
    IconCustomerSearchComponent.prototype.CheckValue = function () {
        if (!this.searchCustomerForm.get('customerId').value && !this.searchCustomerForm.get('emailAddress').value && !this.searchCustomerForm.get('phoneNumber').value) {
            return true;
        }
        else
            return false;
    };
    IconCustomerSearchComponent.prototype.ngOnDestroy = function () {
    };
    IconCustomerSearchComponent.prototype.ResetForm = function () {
        this.searchCustomerForm.get('customerId').setValue('');
        this.searchCustomerForm.get('emailAddress').setValue('');
        this.searchCustomerForm.get('phoneNumber').setValue('');
        this.searchedData = [];
        this._searchedData = [];
    };
    __decorate([
        core_1.Input('loadingIconSearch')
    ], IconCustomerSearchComponent.prototype, "loadingIconSearch", void 0);
    __decorate([
        core_1.Input()
    ], IconCustomerSearchComponent.prototype, "searchedData", null);
    __decorate([
        core_1.Output('searchData')
    ], IconCustomerSearchComponent.prototype, "searchData", void 0);
    __decorate([
        core_1.Input()
    ], IconCustomerSearchComponent.prototype, "selectedThread", null);
    IconCustomerSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-icon-customer-search',
            templateUrl: './icon-customer-search.component.html',
            styleUrls: ['./icon-customer-search.component.scss']
        })
    ], IconCustomerSearchComponent);
    return IconCustomerSearchComponent;
}());
exports.IconCustomerSearchComponent = IconCustomerSearchComponent;
//# sourceMappingURL=icon-customer-search.component.js.map