"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDataPrepComponent = void 0;
var core_1 = require("@angular/core");
var CoreDataPrepComponent = /** @class */ (function () {
    function CoreDataPrepComponent(router) {
        this.router = router;
        this.response = true;
        this.stories = false;
        this.actions = false;
    }
    CoreDataPrepComponent.prototype.ngOnInit = function () {
    };
    CoreDataPrepComponent.prototype.back = function () {
        this.router.navigateByUrl('/chatbot/core');
    };
    CoreDataPrepComponent.prototype.setPillActive = function (pill) {
        switch (pill) {
            case 'response':
                this.response = true;
                this.stories = false;
                this.actions = false;
                break;
            case 'stories':
                this.response = false;
                this.stories = true;
                this.actions = false;
                break;
            case 'actions':
                this.response = false;
                this.stories = false;
                this.actions = true;
                break;
        }
    };
    CoreDataPrepComponent = __decorate([
        core_1.Component({
            selector: 'app-core-data-prep',
            templateUrl: './data-prep.component.html',
            styleUrls: ['./data-prep.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], CoreDataPrepComponent);
    return CoreDataPrepComponent;
}());
exports.CoreDataPrepComponent = CoreDataPrepComponent;
//# sourceMappingURL=data-prep.component.js.map