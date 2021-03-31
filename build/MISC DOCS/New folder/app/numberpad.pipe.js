"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberPad = void 0;
var core_1 = require("@angular/core");
var NumberPad = /** @class */ (function () {
    function NumberPad() {
    }
    NumberPad.prototype.transform = function (input, places) {
        var out = "";
        if (places) {
            var placesLength = parseInt(places, 10);
            var inputLength = input.toString().length;
            for (var i = 0; i < (placesLength - inputLength); i++) {
                out = '0' + out;
            }
            out = out + input;
        }
        return out;
    };
    NumberPad = __decorate([
        core_1.Pipe({
            name: 'numberpad'
        })
    ], NumberPad);
    return NumberPad;
}());
exports.NumberPad = NumberPad;
//# sourceMappingURL=numberpad.pipe.js.map