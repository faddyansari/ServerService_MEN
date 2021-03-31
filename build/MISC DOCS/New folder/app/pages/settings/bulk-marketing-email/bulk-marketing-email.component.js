"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkMarketingEmailComponent = void 0;
var core_1 = require("@angular/core");
var BulkMarketingEmailComponent = /** @class */ (function () {
    function BulkMarketingEmailComponent(_globalStateService, _emailTemplateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._emailTemplateService = _emailTemplateService;
        this.validation = undefined;
        this.objectkeys = Object.keys;
        this.showTemplatingOptions = false;
        this.showTemplateList = false;
        this.passLayout = '';
        this.subscriptions = [];
        this.selectedTemplate = undefined;
        this.name = '';
        this._globalStateService.contentInfo.next('');
        this._globalStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(function (res) {
            if (res) {
                _this.selectedTemplate = res;
            }
            else {
                _this.selectedTemplate = undefined;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.validation.subscribe(function (res) {
            if (res) {
                _this.validation = res;
            }
            else {
                _this.validation = undefined;
            }
        }));
        this._globalStateService.currentRoute.subscribe(function (route) {
            _this.currentRoute = route;
        });
    }
    BulkMarketingEmailComponent.prototype.buttonPressed = function (event, type) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this._emailTemplateService.ButtonPressed.next({
            type: this.name,
            buttonType: type,
        });
    };
    BulkMarketingEmailComponent.prototype.IfBuilder = function () {
        if (this.currentRoute.endsWith('basic') ||
            this.currentRoute.endsWith('commerce') ||
            this.currentRoute.endsWith('three-col') ||
            this.currentRoute.endsWith('text')) {
            return true;
        }
        else
            return false;
    };
    BulkMarketingEmailComponent.prototype.ToggleTemplateOptions = function () {
        this.showTemplatingOptions = !this.showTemplatingOptions;
    };
    BulkMarketingEmailComponent.prototype.ngOnInit = function () {
    };
    BulkMarketingEmailComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (x) {
            x.unsubscribe();
        });
        this._emailTemplateService.selectedTemplate.next(undefined);
    };
    __decorate([
        core_1.Input()
    ], BulkMarketingEmailComponent.prototype, "activeTab", void 0);
    BulkMarketingEmailComponent = __decorate([
        core_1.Component({
            selector: 'app-bulk-marketing-email',
            templateUrl: './bulk-marketing-email.component.html',
            styleUrls: ['./bulk-marketing-email.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], BulkMarketingEmailComponent);
    return BulkMarketingEmailComponent;
}());
exports.BulkMarketingEmailComponent = BulkMarketingEmailComponent;
//# sourceMappingURL=bulk-marketing-email.component.js.map