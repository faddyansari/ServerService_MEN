"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmSessionDetailsComponent = void 0;
var core_1 = require("@angular/core");
var CrmSessionDetailsComponent = /** @class */ (function () {
    function CrmSessionDetailsComponent(_crmService) {
        var _this = this;
        this._crmService = _crmService;
        this.subscriptions = [];
        this.showBrowsingHistory = false;
        this.showSessionLogs = false;
        this.tabs = {
            "visitorHistory": true,
            "browsingHistory": false
        };
        this.subscriptions.push(_crmService.getSelectedSessionDetails().subscribe(function (session) {
            // console.log(session);        
            _this.selectedSession = session;
        }));
    }
    CrmSessionDetailsComponent.prototype.ngOnInit = function () {
    };
    CrmSessionDetailsComponent.prototype.vhListTabs = function (tabName) {
        var _this = this;
        Object.keys(this.tabs).map(function (k) {
            if (k == tabName) {
                _this.tabs[k] = true;
            }
            else {
                _this.tabs[k] = false;
            }
        });
    };
    CrmSessionDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-crm-session-details',
            templateUrl: './crm-session-details.component.html',
            styleUrls: ['./crm-session-details.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CrmSessionDetailsComponent);
    return CrmSessionDetailsComponent;
}());
exports.CrmSessionDetailsComponent = CrmSessionDetailsComponent;
//# sourceMappingURL=crm-session-details.component.js.map