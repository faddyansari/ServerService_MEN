"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreComponent = void 0;
var core_1 = require("@angular/core");
var CoreComponent = /** @class */ (function () {
    function CoreComponent(_chatbotService) {
        this._chatbotService = _chatbotService;
    }
    CoreComponent.prototype.ngOnInit = function () {
    };
    CoreComponent.prototype.toggleInfo = function () {
        this._chatbotService.toggleInfo();
    };
    CoreComponent = __decorate([
        core_1.Component({
            selector: 'app-core',
            templateUrl: './core.component.html',
            styleUrls: ['./core.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], CoreComponent);
    return CoreComponent;
}());
exports.CoreComponent = CoreComponent;
//# sourceMappingURL=core.component.js.map