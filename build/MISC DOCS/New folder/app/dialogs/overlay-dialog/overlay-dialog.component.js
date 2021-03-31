"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayDialogComponent = void 0;
var core_1 = require("@angular/core");
var OverlayDialogComponent = /** @class */ (function () {
    function OverlayDialogComponent(_localStorageStorage) {
        var _this = this;
        this.status = '';
        this.changed = '';
        this.logout = false;
        _localStorageStorage.getStatus().subscribe(function (status) {
            //console.log(status);
            _this.logout = status;
        });
    }
    OverlayDialogComponent.prototype.ngOnInit = function () {
    };
    OverlayDialogComponent.prototype.Connected = function (status) {
        this.changed = status;
    };
    OverlayDialogComponent.prototype.ngAfterContentChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.status != this.changed) {
            this.status = this.changed;
        }
    };
    OverlayDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-overlay-dialog',
            templateUrl: './overlay-dialog.component.html',
            styleUrls: ['./overlay-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], OverlayDialogComponent);
    return OverlayDialogComponent;
}());
exports.OverlayDialogComponent = OverlayDialogComponent;
//# sourceMappingURL=overlay-dialog.component.js.map