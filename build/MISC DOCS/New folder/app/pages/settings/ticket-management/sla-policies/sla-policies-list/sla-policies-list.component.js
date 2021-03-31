"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlaPoliciesListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var SlaPoliciesListComponent = /** @class */ (function () {
    function SlaPoliciesListComponent(dialog, snackBar, _slaPolicyService) {
        var _this = this;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._slaPolicyService = _slaPolicyService;
        this.isDragged = false;
        this.random = Math.random();
        this.subscriptions = [];
        this.allSLAPolicies = [];
        this.reOrderEnable = false;
        this.subscriptions.push(this._slaPolicyService.AllSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                _this.allSLAPolicies = data;
            }
            else {
                _this.allSLAPolicies = [];
            }
        }));
        this.subscriptions.push(this._slaPolicyService.reOrderPolicy.subscribe(function (data) {
            _this.reOrderEnable = data;
        }));
    }
    SlaPoliciesListComponent.prototype.ngOnInit = function () {
    };
    SlaPoliciesListComponent.prototype.editPolicy = function (policy) {
        this._slaPolicyService.selectedSLAPolicy.next(policy);
    };
    SlaPoliciesListComponent.prototype.ReorderSLAPolicy = function () {
        this.reOrderEnable = true;
    };
    SlaPoliciesListComponent.prototype.DoneReorder = function () {
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
    SlaPoliciesListComponent.prototype.CancelReorder = function () {
        this.reOrderEnable = false;
    };
    SlaPoliciesListComponent.prototype.moveUp = function (id, index, order) {
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
            this._slaPolicyService.changeInReorder.next(true);
            this._slaPolicyService.reOrder(id, this.allSLAPolicies[index - 1].order, this.allSLAPolicies[index - 1]._id, order);
        }
    };
    SlaPoliciesListComponent.prototype.moveDown = function (id, index, order) {
        if (index === this.allSLAPolicies.length - 1) {
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
            this._slaPolicyService.changeInReorder.next(true);
            this._slaPolicyService.reOrder(id, this.allSLAPolicies[index + 1].order, this.allSLAPolicies[index + 1]._id, order);
        }
    };
    SlaPoliciesListComponent.prototype.deletePolicy = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this SLA policy?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._slaPolicyService.deleteSLAPolicy(id);
            }
        });
    };
    SlaPoliciesListComponent.prototype.toggleActivation = function (id, flag) {
        this._slaPolicyService.toggleSLAPolicyActivation(id, flag).subscribe(function (res) {
            if (res.status == "ok") {
            }
        });
    };
    SlaPoliciesListComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    SlaPoliciesListComponent = __decorate([
        core_1.Component({
            selector: 'app-sla-policies-list',
            templateUrl: './sla-policies-list.component.html',
            styleUrls: ['./sla-policies-list.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], SlaPoliciesListComponent);
    return SlaPoliciesListComponent;
}());
exports.SlaPoliciesListComponent = SlaPoliciesListComponent;
//# sourceMappingURL=sla-policies-list.component.js.map