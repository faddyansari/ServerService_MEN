"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetsListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var RulesetsListComponent = /** @class */ (function () {
    function RulesetsListComponent(_assignmentRuleService, formbuilder, dialog, _authService, snackBar) {
        var _this = this;
        this._assignmentRuleService = _assignmentRuleService;
        this.formbuilder = formbuilder;
        this.dialog = dialog;
        this._authService = _authService;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this.rulesList = [];
        this.searchValue = '';
        this.rulesMap = {};
        this.subscriptions.push(_assignmentRuleService.RuleSetList.subscribe(function (list) {
            //console.log(list);
            if (list && list.length) {
                _this.rulesList = list;
                _this.UpdateRulesMap(list);
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                // console.log(data);
            }
        }));
    }
    RulesetsListComponent.prototype.UpdateRulesMap = function (list) {
        var _this = this;
        list.map(function (rule) {
            if (_this.rulesMap[rule._id] == undefined) {
                _this.rulesMap[rule._id] = {};
            }
            if (!_this.rulesMap[rule._id].selected) {
                _this.rulesMap[rule._id].selected = false;
                _this.rulesMap[rule._id] = JSON.parse(JSON.stringify(rule));
            }
        });
    };
    RulesetsListComponent.prototype.ngOnInit = function () {
    };
    RulesetsListComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    RulesetsListComponent.prototype.DeleteRule = function (id) {
        // console.log(id);
        var _this = this;
        event.preventDefault();
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are You Sure You Want To Delete the Assignment Rule' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._authService.setRequestState(true);
                _this._assignmentRuleService.DeleteNewRule({ id: id }).subscribe(function (data) {
                    if (data.status == 'ok') {
                        _this._authService.setRequestState(false);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: { img: 'ok', msg: 'Assignment Rule Deleted Successfully' },
                            duration: 3000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                }, function (err) {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: { img: 'warning', msg: 'Cannot Delete Assignment Rule' },
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                });
            }
        });
    };
    RulesetsListComponent.prototype.ToggleActivation = function (id, activation) {
        // for enabling and disabling rule
        // console.log(activation);
        var _this = this;
        this._assignmentRuleService.ToggleActivation(id, activation).subscribe(function (response) {
            // console.log(response);
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok', msg: 'RuleSet ' + ((activation) ? 'Enabled' : 'Disabled') + ' Successfully'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    RulesetsListComponent.prototype.EditRule = function (ruleset) {
        // console.log(ruleset);
        this._assignmentRuleService.selectedRule.next(ruleset);
        this._assignmentRuleService.addingRule.next(true);
    };
    RulesetsListComponent = __decorate([
        core_1.Component({
            selector: 'app-rulesets-list',
            templateUrl: './rulesets-list.component.html',
            styleUrls: ['./rulesets-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RulesetsListComponent);
    return RulesetsListComponent;
}());
exports.RulesetsListComponent = RulesetsListComponent;
//# sourceMappingURL=rulesets-list.component.js.map