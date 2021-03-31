"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartySyncComponent = void 0;
var core_1 = require("@angular/core");
var ThirdPartySyncComponent = /** @class */ (function () {
    function ThirdPartySyncComponent(formbuilder, _authService, _webhookSettings, _appStateService) {
        var _this = this;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this._webhookSettings = _webhookSettings;
        this._appStateService = _appStateService;
        this.loading = false;
        this.script = '';
        this.subscriptions = [];
        this.sbt = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Webhooks');
        // no message will be shown when userGetValidated == 'unknown'
        this.currentAppTokenObj = {
            key: '', userGetValidated: 'unknown'
        };
        this.generateAppTokenForm = this.formbuilder.group({
            'generatedAppToken': [
                this.currentAppTokenObj['key'],
                []
            ]
        });
        this.subscriptions.push(this._webhookSettings.currentAppToken.subscribe(function (appToken) {
            // console.log("appToken recieved");
            // console.log(appToken)
            _this.generateAppTokenForm.controls['generatedAppToken'].setValue(appToken['key']);
            _this.currentAppTokenObj['userGetValidated'] = appToken['userGetValidated'];
        }));
        this.subscriptions.push(this._authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
    }
    // public AddScript() {
    //   if (this.customScriptForm.valid && (this.script != this.customScriptForm.get('script').value)) {
    //     this.loading = true;
    //     this._webhookSettings.SetScript(this.customScriptForm.get('script').value).subscribe(response => {
    //       //Todo resposne post actions here
    //       this.loading = false;
    //       if (response.status == 'ok') {
    //         //Success Case
    //       }
    //     }, err => {
    //       //Todo Error Logic Here
    //       this.loading = false;
    //     });
    //   }
    // }
    ThirdPartySyncComponent.prototype.ngOnInit = function () {
        // this.subscriptions.push(this._webhookSettings.getCustomScript().subscribe(script => {
        //   this.script = script;
        //   this.customScriptForm.get('script').setValue(script);
        // }));
    };
    ThirdPartySyncComponent.prototype.GenerateAppToken = function () {
        // console.log("generate!")
        this._webhookSettings.GenerateAppToken();
    };
    ThirdPartySyncComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        this._webhookSettings.Destroy();
    };
    ThirdPartySyncComponent = __decorate([
        core_1.Component({
            selector: 'app-third-party-sync',
            templateUrl: './third-party-sync.component.html',
            styleUrls: ['./third-party-sync.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ThirdPartySyncComponent);
    return ThirdPartySyncComponent;
}());
exports.ThirdPartySyncComponent = ThirdPartySyncComponent;
//# sourceMappingURL=third-party-sync.component.js.map