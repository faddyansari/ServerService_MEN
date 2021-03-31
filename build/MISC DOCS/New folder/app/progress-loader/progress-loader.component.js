"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressLoaderComponent = void 0;
var core_1 = require("@angular/core");
var ProgressLoaderComponent = /** @class */ (function () {
    function ProgressLoaderComponent() {
        this.isBig = true;
        this.progress = 0;
        // @Input() color: string = 'green';
        this.errored = false;
        this.Resend = new core_1.EventEmitter();
        this.status = '';
        this.CancelUpload = new core_1.EventEmitter();
        this.classes = [];
    }
    ProgressLoaderComponent.prototype.ngOnInit = function () {
    };
    ProgressLoaderComponent.prototype.Cancel = function () {
        // console.log('Emit FromProgress Loader')
        this.CancelUpload.emit();
    };
    ProgressLoaderComponent.prototype.Retry = function () {
        this.Resend.emit();
    };
    __decorate([
        core_1.Input()
    ], ProgressLoaderComponent.prototype, "isBig", void 0);
    __decorate([
        core_1.Input()
    ], ProgressLoaderComponent.prototype, "progress", void 0);
    __decorate([
        core_1.Input()
    ], ProgressLoaderComponent.prototype, "errored", void 0);
    __decorate([
        core_1.Output()
    ], ProgressLoaderComponent.prototype, "Resend", void 0);
    __decorate([
        core_1.Input()
    ], ProgressLoaderComponent.prototype, "status", void 0);
    __decorate([
        core_1.Output()
    ], ProgressLoaderComponent.prototype, "CancelUpload", void 0);
    ProgressLoaderComponent = __decorate([
        core_1.Component({
            selector: 'app-progress-loader',
            templateUrl: './progress-loader.component.html',
            styleUrls: ['./progress-loader.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], ProgressLoaderComponent);
    return ProgressLoaderComponent;
}());
exports.ProgressLoaderComponent = ProgressLoaderComponent;
//# sourceMappingURL=progress-loader.component.js.map