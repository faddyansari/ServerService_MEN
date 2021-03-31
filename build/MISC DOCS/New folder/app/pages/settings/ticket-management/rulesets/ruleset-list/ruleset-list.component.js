"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var RulesetListComponent = /** @class */ (function () {
    function RulesetListComponent(_ruleSetService, formbuilder, dialog, _authService) {
        var _this = this;
        this._ruleSetService = _ruleSetService;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this._authService = _authService;
        this.subscriptions = [];
        this.rulesList = [];
        this.searchValue = '';
        this.subscriptions.push(this._ruleSetService.RulesList.subscribe(function (rulesList) {
            _this.rulesList = rulesList;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
            }
        }));
    }
    RulesetListComponent.prototype.ngOnInit = function () {
    };
    RulesetListComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesetListComponent.prototype.DeleteRule = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to delete the rule?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ruleSetService.DeleteRulesets(id).subscribe(function (response) {
                    if (response.status == 'ok') {
                        //TODO NOTIFICATION LOGIC
                    }
                    else {
                        //TODO ERROR LOGIC
                    }
                });
            }
        });
    };
    RulesetListComponent.prototype.ToggleActivation = function (id, activation) {
        this._ruleSetService.ToggleActivation(id, activation).subscribe(function (response) {
            if (response.status == 'ok') {
                //TODO NOTIFICATION LOGIC
            }
            else {
                //TODO ERROR LOGIC
            }
        });
    };
    RulesetListComponent.prototype.EditRule = function (ruleset) {
        this._ruleSetService.SelectedRule.next(ruleset);
        //this._ruleSetService.EditRule.next(true);
    };
    RulesetListComponent = __decorate([
        core_1.Component({
            selector: 'app-ruleset-list',
            templateUrl: './ruleset-list.component.html',
            styleUrls: ['./ruleset-list.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RulesetListComponent);
    return RulesetListComponent;
}());
exports.RulesetListComponent = RulesetListComponent;
//# sourceMappingURL=ruleset-list.component.js.map