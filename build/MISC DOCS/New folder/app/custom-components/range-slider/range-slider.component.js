"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeSliderComponent = void 0;
var core_1 = require("@angular/core");
var RangeSliderComponent = /** @class */ (function () {
    function RangeSliderComponent() {
        this.disabled = false;
        this.controlVal = new core_1.EventEmitter();
    }
    RangeSliderComponent.prototype.ngOnInit = function () {
    };
    RangeSliderComponent.prototype.showSliderValue = function (ev) {
        this.bulletPosition = ev.target.value;
        //this.bulletPosition = ev.target.value;
        this.controlVal.emit({ value: ev.target.value, controlValue: this.controlValue, settingType: this.settingType, setting: this.setting });
    };
    RangeSliderComponent.prototype.DisableInput = function (event) {
        event.preventDefault();
    };
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "dbValue", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "minVal", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "maxVal", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "displayVal", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "controlValue", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "setting", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "settingType", void 0);
    __decorate([
        core_1.Input()
    ], RangeSliderComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Output()
    ], RangeSliderComponent.prototype, "controlVal", void 0);
    RangeSliderComponent = __decorate([
        core_1.Component({
            selector: 'app-range-slider',
            templateUrl: './range-slider.component.html',
            styleUrls: ['./range-slider.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], RangeSliderComponent);
    return RangeSliderComponent;
}());
exports.RangeSliderComponent = RangeSliderComponent;
//# sourceMappingURL=range-slider.component.js.map