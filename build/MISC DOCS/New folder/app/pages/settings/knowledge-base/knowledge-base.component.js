"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseComponent = void 0;
var core_1 = require("@angular/core");
var KnowledgeBaseComponent = /** @class */ (function () {
    function KnowledgeBaseComponent(_globalStateServie, _authService) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this._authService = _authService;
        this.subscription = [];
        this.package = undefined;
        this.subscription.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.knowledgebase;
            }
        }));
    }
    KnowledgeBaseComponent.prototype.ngOnInit = function () {
    };
    KnowledgeBaseComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    __decorate([
        core_1.Input()
    ], KnowledgeBaseComponent.prototype, "activeTab", void 0);
    KnowledgeBaseComponent = __decorate([
        core_1.Component({
            selector: 'app-knowledge-base',
            templateUrl: './knowledge-base.component.html',
            styleUrls: ['./knowledge-base.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], KnowledgeBaseComponent);
    return KnowledgeBaseComponent;
}());
exports.KnowledgeBaseComponent = KnowledgeBaseComponent;
//# sourceMappingURL=knowledge-base.component.js.map