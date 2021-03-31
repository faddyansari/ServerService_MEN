"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoaccessComponent = void 0;
var core_1 = require("@angular/core");
var NoaccessComponent = /** @class */ (function () {
    function NoaccessComponent(_globalStateService) {
        this._globalStateService = _globalStateService;
        this.count = 5;
    }
    NoaccessComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.count--;
            if (_this.count == 0) {
                _this._globalStateService.canAccessPageNotFound.next(false);
                _this._globalStateService.NavigateTo('/home');
            }
        }, 1000);
    };
    NoaccessComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.interval);
    };
    NoaccessComponent = __decorate([
        core_1.Component({
            selector: 'app-noaccess',
            templateUrl: './noaccess.component.html',
            styleUrls: ['./noaccess.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], NoaccessComponent);
    return NoaccessComponent;
}());
exports.NoaccessComponent = NoaccessComponent;
//# sourceMappingURL=noaccess.component.js.map