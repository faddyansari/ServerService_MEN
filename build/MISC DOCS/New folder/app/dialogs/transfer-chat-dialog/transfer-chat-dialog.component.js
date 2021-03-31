"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferChatDialog = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var TransferChatDialog = /** @class */ (function () {
    function TransferChatDialog(data) {
        this.data = data;
        this.selectedAgent = {
            nickname: 'ZZZZZZZZ',
            id: 'dummy'
        };
        this.show = true;
        //console.log('IN Transfer Chat Dialog');
        //console.log(data);
        if (data.length > 0) {
            if (data[0] == undefined)
                this.show = false;
        }
    }
    TransferChatDialog.prototype.ngAfterViewInit = function () {
    };
    TransferChatDialog.prototype.ngOnInit = function () {
    };
    TransferChatDialog.prototype.SelectedAgent = function (agentID) {
        var _this = this;
        this.data.map(function (agent) {
            if (agent.id == agentID) {
                _this.selectedAgent = agent;
            }
        });
    };
    TransferChatDialog = __decorate([
        core_1.Component({
            selector: 'app-transfer-chat-dialog',
            templateUrl: './transfer-chat-dialog.component.html',
            styleUrls: ['./transfer-chat-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], TransferChatDialog);
    return TransferChatDialog;
}());
exports.TransferChatDialog = TransferChatDialog;
//# sourceMappingURL=transfer-chat-dialog.component.js.map