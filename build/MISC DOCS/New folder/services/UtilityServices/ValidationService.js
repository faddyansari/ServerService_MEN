"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/switchMap");
var ValidationService = /** @class */ (function () {
    function ValidationService(http, _authService, _ticketService) {
        this.http = http;
        this._authService = _authService;
        this._ticketService = _ticketService;
        this.subscriptions = [];
        this.automatedMessagesList = [];
        this.formList = [];
    }
    //checks if particular email already exists
    ValidationService.prototype.isEmailUnique = function (control) {
        var _this = this;
        console.log('Checking Email Unique');
        return Observable_1.Observable.timer(2000).switchMap(function () {
            return _this._authService.ValidateEmail(control.value)
                .mapTo(null)
                .catch(function (err) { return Observable_1.Observable.of({
                isEmailUnique: true
            }); });
        });
    };
    //checks if particular entered number already exists
    ValidationService.prototype.NumbersOnly = function (event) {
        var pattern = /[0-9\-]+/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    //checks if particular website already exists
    ValidationService.prototype.isWebsiteUnique = function (control) {
        var _this = this;
        console.log('Checking Website Unique');
        this._authService.setRequestState(true);
        return Observable_1.Observable.timer(1000).switchMap(function () {
            return _this._authService.ValidateWebsite(control.value.replace(/(www\.)?/ig, ''))
                .mapTo(null)
                .catch(function (err) { return Observable_1.Observable.of({ isWebsiteUnique: true }); });
        });
    };
    //checks if tag is present or not?
    ValidationService.prototype.CheckTag = function (control) {
        var hashTag = this.automatedResForm.get('hashTag');
        if (this.automatedMessagesList.length == 0) {
            return Observable_1.Observable.of(null);
        }
        else {
            for (var i = 0; i < this.automatedMessagesList.length; i++) {
                if (this.automatedMessagesList[i].hashTag == hashTag.value) {
                    return Observable_1.Observable.of({ 'matched': true });
                }
                else {
                    return Observable_1.Observable.of(null);
                }
            }
        }
    };
    ValidationService.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this._ticketService.setSelectedThread(undefined);
        // this.subscriptions.forEach(subscription => {
        //   subscription.unsubscribe();
        // })
    };
    ValidationService = __decorate([
        core_1.Injectable()
    ], ValidationService);
    return ValidationService;
}());
exports.ValidationService = ValidationService;
//# sourceMappingURL=ValidationService.js.map