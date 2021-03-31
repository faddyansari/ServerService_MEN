"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateOptionsComponent = void 0;
var core_1 = require("@angular/core");
var TemplateOptionsComponent = /** @class */ (function () {
    function TemplateOptionsComponent(_globalStateService, _router, router, _emailTemplateService) {
        // this.subscriptions.push(this._router.params.subscribe(params => {
        // 	console.log(params);
        // 	if (params.type) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._router = _router;
        this.router = router;
        this._emailTemplateService = _emailTemplateService;
        this.subscriptions = [];
        this.showDialog = false;
        this.selectedTemplate = undefined;
        this.currentRoute = '';
        // 	}
        //   }));
        this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(function (res) {
            if (res) {
                _this.selectedTemplate = res;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(function (data) {
            _this.buttons = data;
            switch (_this.buttons.buttonType) {
                case 'cancel':
                    _this.Cancel();
                    break;
            }
        }));
        this._globalStateService.currentRoute.subscribe(function (route) {
            _this.currentRoute = route;
        });
    }
    TemplateOptionsComponent.prototype.IfBuilder = function () {
        if (this.currentRoute.endsWith('basic') ||
            this.currentRoute.endsWith('commerce') ||
            this.currentRoute.endsWith('three-col') ||
            this.currentRoute.endsWith('text')) {
            return true;
        }
        else
            return false;
    };
    TemplateOptionsComponent.prototype.ngOnInit = function () {
    };
    TemplateOptionsComponent.prototype.ToggleOptions = function () {
        this.showDialog = !this.showDialog;
    };
    TemplateOptionsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    TemplateOptionsComponent.prototype.Cancel = function () {
        this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
    };
    TemplateOptionsComponent = __decorate([
        core_1.Component({
            selector: 'app-template-options',
            templateUrl: './template-options.component.html',
            styleUrls: ['./template-options.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TemplateOptionsComponent);
    return TemplateOptionsComponent;
}());
exports.TemplateOptionsComponent = TemplateOptionsComponent;
//# sourceMappingURL=template-options.component.js.map