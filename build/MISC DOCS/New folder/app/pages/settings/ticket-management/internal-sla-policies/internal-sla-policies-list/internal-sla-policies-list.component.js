"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalSlaPoliciesListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var InternalSlaPoliciesListComponent = /** @class */ (function () {
    function InternalSlaPoliciesListComponent(dialog, snackBar, _slaPolicyService) {
        var _this = this;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._slaPolicyService = _slaPolicyService;
        this.subscriptions = [];
        this.allIntPolicies = [];
        this.reOrderEnable = false;
        this.subscriptions.push(this._slaPolicyService.AllInternalSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allIntPolicies = data;
            }
            else {
                _this.allIntPolicies = [];
            }
        }));
        this.subscriptions.push(this._slaPolicyService.reOrderIntPolicy.subscribe(function (data) {
            _this.reOrderEnable = data;
        }));
    }
    InternalSlaPoliciesListComponent.prototype.ngOnInit = function () {
    };
    InternalSlaPoliciesListComponent.prototype.editPolicy = function (policy) {
        this._slaPolicyService.selectedInternalSLAPolicy.next(policy);
    };
    InternalSlaPoliciesListComponent.prototype.ReorderSLAPolicy = function () {
        this.reOrderEnable = true;
    };
    InternalSlaPoliciesListComponent.prototype.DoneReorder = function () {
        this.reOrderEnable = false;
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Policies reordered successfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
    };
    InternalSlaPoliciesListComponent.prototype.CancelReorder = function () {
        this.reOrderEnable = false;
    };
    InternalSlaPoliciesListComponent.prototype.moveUp = function (id, index, order) {
        if (index == 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No policies above, Not allowed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            this._slaPolicyService.changeInReorderInt.next(true);
            this._slaPolicyService.reOrderInternalSLA(id, this.allIntPolicies[index - 1].order, this.allIntPolicies[index - 1]._id, order);
        }
    };
    InternalSlaPoliciesListComponent.prototype.moveDown = function (id, index, order) {
        if (index === this.allIntPolicies.length - 1) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'No policy to swap down, Not allowed!!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
            return;
        }
        else {
            this._slaPolicyService.changeInReorderInt.next(true);
            this._slaPolicyService.reOrderInternalSLA(id, this.allIntPolicies[index + 1].order, this.allIntPolicies[index + 1]._id, order);
        }
    };
    InternalSlaPoliciesListComponent.prototype.deletePolicy = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this SLA policy?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._slaPolicyService.deleteInternalSLAPolicy(id);
            }
        });
    };
    InternalSlaPoliciesListComponent.prototype.toggleActivation = function (id, flag) {
        this._slaPolicyService.toggleInternalSLAPolicyActivation(id, flag).subscribe(function (res) {
            if (res.status == "ok") {
            }
        });
    };
    InternalSlaPoliciesListComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    InternalSlaPoliciesListComponent = __decorate([
        core_1.Component({
            selector: 'app-internal-sla-policies-list',
            templateUrl: './internal-sla-policies-list.component.html',
            styleUrls: ['./internal-sla-policies-list.component.css']
        })
    ], InternalSlaPoliciesListComponent);
    return InternalSlaPoliciesListComponent;
}());
exports.InternalSlaPoliciesListComponent = InternalSlaPoliciesListComponent;
//# sourceMappingURL=internal-sla-policies-list.component.js.map