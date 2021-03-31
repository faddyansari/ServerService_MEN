"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcknowledgeMessageComponent = void 0;
var core_1 = require("@angular/core");
var AcknowledgeMessageComponent = /** @class */ (function () {
    function AcknowledgeMessageComponent(dialog, _ackMessageService, snackBar, _appStateService) {
        var _this = this;
        this.dialog = dialog;
        this._ackMessageService = _ackMessageService;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.addMessage = false;
        this.selectedMessage = undefined;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(this._ackMessageService.AddAckMessage.subscribe(function (data) {
            _this.addMessage = data;
        }));
        this.subscriptions.push(this._ackMessageService.selectedAckMessage.subscribe(function (data) {
            _this.selectedMessage = data;
        }));
    }
    AcknowledgeMessageComponent.prototype.ngOnInit = function () {
    };
    AcknowledgeMessageComponent.prototype.AddAckMessage = function () {
        this._ackMessageService.AddAckMessage.next(true);
    };
    AcknowledgeMessageComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    AcknowledgeMessageComponent = __decorate([
        core_1.Component({
            selector: 'app-acknowledge-message',
            templateUrl: './acknowledge-message.component.html',
            styleUrls: ['./acknowledge-message.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AcknowledgeMessageComponent);
    return AcknowledgeMessageComponent;
}());
exports.AcknowledgeMessageComponent = AcknowledgeMessageComponent;
//# sourceMappingURL=acknowledge-message.component.js.map