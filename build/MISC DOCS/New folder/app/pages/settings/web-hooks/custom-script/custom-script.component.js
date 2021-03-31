"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomScriptComponent = void 0;
var core_1 = require("@angular/core");
var CustomScriptComponent = /** @class */ (function () {
    function CustomScriptComponent(formbuilder, _webhookSettings, _appStateService, _authService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._webhookSettings = _webhookSettings;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.loading = false;
        this.script = '';
        this.error = '';
        this.subscriptions = [];
        this.package = undefined;
        this.subscriptions.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.integratons;
                if (!_this.package.allowed || !_this.package.customScript) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Webhooks');
        this.customScriptForm = this.formbuilder.group({
            'script': [
                (this.script) ? this.script : null,
                []
            ]
        });
    }
    CustomScriptComponent.prototype.AddScript = function () {
        var _this = this;
        if (this.customScriptForm.valid && (this.script != this.customScriptForm.get('script').value)) {
            this.error = '';
            this.loading = true;
            this._webhookSettings.SetScript(this.customScriptForm.get('script').value).subscribe(function (response) {
                //Todo resposne post actions here
                _this.loading = false;
                if (response.status == 'ok') {
                    //Success Case
                }
            }, function (err) {
                //Todo Error Logic Here
                _this.loading = false;
                _this.error = err;
            });
        }
    };
    CustomScriptComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this._webhookSettings.getCustomScript().subscribe(function (script) {
            _this.script = script;
            _this.customScriptForm.get('script').setValue(script);
        }));
    };
    CustomScriptComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        // this._webhookSettings.Destroy();
    };
    CustomScriptComponent = __decorate([
        core_1.Component({
            selector: 'app-custom-script',
            templateUrl: './custom-script.component.html',
            styleUrls: ['./custom-script.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CustomScriptComponent);
    return CustomScriptComponent;
}());
exports.CustomScriptComponent = CustomScriptComponent;
//# sourceMappingURL=custom-script.component.js.map