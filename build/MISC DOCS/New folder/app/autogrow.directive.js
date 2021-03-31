"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoGrowDirective = void 0;
var core_1 = require("@angular/core");
var AutoGrowDirective = /** @class */ (function () {
    function AutoGrowDirective(element) {
        this.element = element;
    }
    //= scrollHeight = this.element.nativeElement.scrollHeight
    AutoGrowDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.restrictAutoSize) {
            setTimeout(function () {
                _this.adjustCustom();
            }, 0);
        }
    };
    AutoGrowDirective.prototype.adjustCustom = function () {
        var element = this.element.nativeElement;
        element.style.height = this.minHeight + 'px';
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight - this.minHeight) + 'px';
        if (element.scrollHeight <= this.maximumHeight) {
            element.style.overflowY = 'hidden';
            delete element.style.maxHeight;
        }
        else {
            element.style.overflowY = 'scroll';
            element.style.maxHeight = this.maximumHeight + 'px';
        }
    };
    __decorate([
        core_1.Input()
    ], AutoGrowDirective.prototype, "maximumHeight", void 0);
    __decorate([
        core_1.Input()
    ], AutoGrowDirective.prototype, "minHeight", void 0);
    __decorate([
        core_1.Input()
    ], AutoGrowDirective.prototype, "restrictAutoSize", void 0);
    __decorate([
        core_1.HostListener('input', ['$event.target']),
        core_1.HostListener('keydown', ['$event.target']),
        core_1.HostListener('keyup', ['$event.target']),
        core_1.HostListener('cut', ['$event.target']),
        core_1.HostListener('paste', ['$event.target']),
        core_1.HostListener('change', ['$event.target'])
    ], AutoGrowDirective.prototype, "ngOnInit", null);
    AutoGrowDirective = __decorate([
        core_1.Directive({
            selector: '[appAutoGrow]'
        })
    ], AutoGrowDirective);
    return AutoGrowDirective;
}());
exports.AutoGrowDirective = AutoGrowDirective;
//# sourceMappingURL=autogrow.directive.js.map