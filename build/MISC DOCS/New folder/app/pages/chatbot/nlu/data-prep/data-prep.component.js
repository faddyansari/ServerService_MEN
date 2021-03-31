"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NluDataPrepComponent = void 0;
var core_1 = require("@angular/core");
var NluDataPrepComponent = /** @class */ (function () {
    function NluDataPrepComponent(router) {
        this.router = router;
        this.intent = true;
        this.entity = false;
        this.synonyms = false;
        this.regex = false;
    }
    NluDataPrepComponent.prototype.ngOnInit = function () {
    };
    NluDataPrepComponent.prototype.setPillActive = function (pill) {
        switch (pill) {
            case 'intent':
                this.intent = true;
                this.entity = false;
                this.synonyms = false;
                this.regex = false;
                break;
            case 'entity':
                this.intent = false;
                this.entity = true;
                this.synonyms = false;
                this.regex = false;
                break;
            case 'synonyms':
                this.intent = false;
                this.entity = false;
                this.synonyms = true;
                this.regex = false;
                break;
            case 'regex':
                this.intent = false;
                this.entity = false;
                this.synonyms = false;
                this.regex = true;
                break;
        }
    };
    NluDataPrepComponent.prototype.back = function () {
        this.router.navigateByUrl('/chatbot/nlu');
    };
    NluDataPrepComponent = __decorate([
        core_1.Component({
            selector: 'app-nlu-data-prep',
            templateUrl: './data-prep.component.html',
            styleUrls: ['./data-prep.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], NluDataPrepComponent);
    return NluDataPrepComponent;
}());
exports.NluDataPrepComponent = NluDataPrepComponent;
//# sourceMappingURL=data-prep.component.js.map