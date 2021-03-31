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
exports.ShowChatInfoDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ShowChatInfoDialogComponent = /** @class */ (function () {
    function ShowChatInfoDialogComponent(data, _authService, _socketService, dialogRef) {
        var _this = this;
        this.data = data;
        this._authService = _authService;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.loading = false;
        if (data.conversation) {
            this.conversation = data.conversation;
        }
        this.subscriptions.push(_socketService.getSocket().subscribe(function (data) { return _this.socket = data; }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
    }
    ShowChatInfoDialogComponent.prototype.ngOnInit = function () { };
    ShowChatInfoDialogComponent.prototype.ngAfterViewInit = function () { };
    ShowChatInfoDialogComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ShowChatInfoDialogComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    ShowChatInfoDialogComponent.prototype.ImageBroken = function () {
        this.imageError = true;
    };
    ShowChatInfoDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-show-chat-info-dialog',
            templateUrl: './show-chat-info-dialog.component.html',
            styleUrls: ['./show-chat-info-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ShowChatInfoDialogComponent);
    return ShowChatInfoDialogComponent;
}());
exports.ShowChatInfoDialogComponent = ShowChatInfoDialogComponent;
//# sourceMappingURL=show-chat-info-dialog.component.js.map