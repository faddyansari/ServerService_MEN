"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DpActionsComponent = void 0;
var core_1 = require("@angular/core");
var add_actions_dialog_component_1 = require("../../../../../dialogs/add-actions-dialog/add-actions-dialog.component");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var DpActionsComponent = /** @class */ (function () {
    function DpActionsComponent(snackBar, dialog, formbuilder, BotService) {
        var _this = this;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.BotService = BotService;
        this.subscriptions = [];
        this.action_list = [];
        this.showActionForm = false;
        this.ActionForm = formbuilder.group({
            'action_name': [null, forms_1.Validators.required],
            'endpoint_url': [null, forms_1.Validators.required],
            'template': [null, forms_1.Validators.required]
        });
        this.subscriptions.push(BotService.getActions().subscribe(function (data) {
            _this.action_list = data;
        }));
    }
    DpActionsComponent.prototype.ngOnInit = function () {
    };
    DpActionsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    DpActionsComponent.prototype.AddActions = function () {
        var _this = this;
        this.dialog.open(add_actions_dialog_component_1.AddActionsDialogComponent, {
            disableClose: true
        }).afterClosed().subscribe(function (response) {
            if (response.data) {
                _this.BotService.AddAction(response.data.action_name, response.data.endpoint_url, response.data.template).subscribe(function (resp) {
                    //console.log(resp);
                    if (resp.status == 'ok') {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Action added successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                });
            }
        });
    };
    DpActionsComponent.prototype.toggleActionForm = function () {
        this.showActionForm = !this.showActionForm;
    };
    DpActionsComponent.prototype.deleteAction = function (actions, index) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure to delete " + actions.action_name + " ?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this.BotService.deleteAction(actions._id, index);
            }
        });
    };
    DpActionsComponent = __decorate([
        core_1.Component({
            selector: 'app-dp-actions',
            templateUrl: './dp-actions.component.html',
            styleUrls: ['./dp-actions.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], DpActionsComponent);
    return DpActionsComponent;
}());
exports.DpActionsComponent = DpActionsComponent;
//# sourceMappingURL=dp-actions.component.js.map