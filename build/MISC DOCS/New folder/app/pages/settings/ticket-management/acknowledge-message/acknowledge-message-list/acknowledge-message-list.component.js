"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgeMessageListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var AcknowledgeMessageListComponent = /** @class */ (function () {
    function AcknowledgeMessageListComponent(_ackMessageSvc, dialog) {
        var _this = this;
        this._ackMessageSvc = _ackMessageSvc;
        this.dialog = dialog;
        this.allAckMessage = [];
        this.subscriptions = [];
        this._ackMessageSvc.getAllAckMessages();
        this.subscriptions.push(this._ackMessageSvc.AllAckMessages.subscribe(function (data) {
            if (data && data.length) {
                _this.allAckMessage = data;
            }
            else {
                _this.allAckMessage = [];
            }
        }));
    }
    AcknowledgeMessageListComponent.prototype.ngOnInit = function () {
    };
    AcknowledgeMessageListComponent.prototype.editMessage = function (message) {
        this._ackMessageSvc.selectedAckMessage.next(message);
    };
    AcknowledgeMessageListComponent.prototype.deleteMessage = function (name) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this acknowledgement message?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                if (_this.allAckMessage && _this.allAckMessage.length) {
                    var ind = _this.allAckMessage.findIndex(function (x) { return x.name == name; });
                    _this.allAckMessage.splice(ind, 1);
                    _this._ackMessageSvc.deleteAckMessage(_this.allAckMessage);
                }
            }
        });
    };
    AcknowledgeMessageListComponent.prototype.toggleActivation = function (name, flag) {
        var _this = this;
        this.allAckMessage.forEach(function (val) {
            if (val.activated && val.name != name) {
                val.activated = false;
                return;
            }
            else {
                var index = _this.allAckMessage.findIndex(function (res) { return res.name == name; });
                _this.allAckMessage[index].activated = flag;
                _this._ackMessageSvc.toggleActivation(_this.allAckMessage, flag).subscribe(function (res) {
                });
            }
        });
    };
    AcknowledgeMessageListComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AcknowledgeMessageListComponent = __decorate([
        core_1.Component({
            selector: 'app-acknowledge-message-list',
            templateUrl: './acknowledge-message-list.component.html',
            styleUrls: ['./acknowledge-message-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], AcknowledgeMessageListComponent);
    return AcknowledgeMessageListComponent;
}());
exports.AcknowledgeMessageListComponent = AcknowledgeMessageListComponent;
//# sourceMappingURL=acknowledge-message-list.component.js.map