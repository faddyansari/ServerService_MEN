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
exports.BigImgComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var BigImgComponent = /** @class */ (function () {
    function BigImgComponent(data) {
        //console.log(data.fileDetails);
        this.data = data;
        this.image = data.url;
        this.details = data.fileDetails;
    }
    BigImgComponent.prototype.ngOnInit = function () {
    };
    BigImgComponent = __decorate([
        core_1.Component({
            selector: 'app-big-img',
            templateUrl: './big-img.component.html',
            styleUrls: ['./big-img.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], BigImgComponent);
    return BigImgComponent;
}());
exports.BigImgComponent = BigImgComponent;
//# sourceMappingURL=big-img.component.js.map