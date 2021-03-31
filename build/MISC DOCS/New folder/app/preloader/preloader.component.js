"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloaderComponent = void 0;
var core_1 = require("@angular/core");
var PreloaderComponent = /** @class */ (function () {
    function PreloaderComponent() {
    }
    PreloaderComponent.prototype.ngOnInit = function () {
        //console.log(this.type);
    };
    __decorate([
        core_1.Input()
    ], PreloaderComponent.prototype, "type", void 0);
    PreloaderComponent = __decorate([
        core_1.Component({
            selector: 'app-preloader',
            templateUrl: './preloader.component.html',
            styleUrls: ['./preloader.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], PreloaderComponent);
    return PreloaderComponent;
}());
exports.PreloaderComponent = PreloaderComponent;
//# sourceMappingURL=preloader.component.js.map