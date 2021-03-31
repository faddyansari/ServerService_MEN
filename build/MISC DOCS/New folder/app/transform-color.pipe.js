"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformColorPipe = void 0;
var core_1 = require("@angular/core");
var TransformColorPipe = /** @class */ (function () {
    function TransformColorPipe() {
    }
    TransformColorPipe.prototype.transform = function (value, args) {
        console.log('In Pipe');
        console.log(value);
        return this.RGBAToHexAString(value);
    };
    TransformColorPipe.prototype.RGBAToHexAString = function (rgba) {
        console.log(rgba);
        if (new RegExp(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/).test(rgba))
            return rgba;
        var sep = rgba.indexOf(",") > -1 ? "," : " ";
        rgba = rgba.substr(5).split(")")[0].split(sep);
        // Strip the slash if using space-separated syntax
        if (rgba.indexOf("/") > -1)
            rgba.splice(3, 1);
        for (var R in rgba) {
            var r = rgba[R];
            if (r.indexOf("%") > -1) {
                var p = r.substr(0, r.length - 1) / 100;
                if (parseInt(R) < 3) {
                    rgba[R] = Math.round(p * 255);
                }
                else {
                    rgba[R] = p;
                }
            }
        }
        console.log(this.RGBAToHexA(rgba));
        return this.RGBAToHexA(rgba);
    };
    TransformColorPipe.prototype.RGBAToHexA = function (rgba) {
        //console.log(rgba);
        var r = (+rgba[0]).toString(16), g = (+rgba[1]).toString(16), b = (+rgba[2]).toString(16), a = Math.round(+rgba[3] * 255).toString(16);
        if (!a)
            a = 'F';
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        if (a.length == 1)
            a = "0" + a;
        //console.log(a);
        return "#" + r + g + b + a;
    };
    TransformColorPipe = __decorate([
        core_1.Pipe({
            name: 'transformColor'
        })
    ], TransformColorPipe);
    return TransformColorPipe;
}());
exports.TransformColorPipe = TransformColorPipe;
//# sourceMappingURL=transform-color.pipe.js.map