"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleConfirmationComponent = void 0;
var dialog_1 = require("@angular/material/dialog");
var core_1 = require("@angular/core");
var RuleConfirmationComponent = /** @class */ (function () {
    function RuleConfirmationComponent(data, dialogRef) {
        //console.log(this.data);
        //console.log(this.data.summary[0]);
        this.data = data;
        this.dialogRef = dialogRef;
        this.str = 'also';
        this.str2 = "with  + data.summary[3] + operator between them";
    }
    RuleConfirmationComponent.prototype.ngOnInit = function () {
    };
    RuleConfirmationComponent.prototype.Close = function () {
        this.dialogRef.close({
            status: true
        });
    };
    RuleConfirmationComponent = __decorate([
        core_1.Component({
            selector: 'app-rule-confirmation',
            templateUrl: './rule-confirmation.component.html',
            styleUrls: ['./rule-confirmation.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], RuleConfirmationComponent);
    return RuleConfirmationComponent;
}());
exports.RuleConfirmationComponent = RuleConfirmationComponent;
//# sourceMappingURL=rule-confirmation.component.js.map