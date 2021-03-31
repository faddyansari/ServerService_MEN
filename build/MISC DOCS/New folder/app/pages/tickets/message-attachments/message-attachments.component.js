"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAttachmentsComponent = void 0;
var core_1 = require("@angular/core");
var MessageAttachmentsComponent = /** @class */ (function () {
    function MessageAttachmentsComponent() {
    }
    MessageAttachmentsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input('message')
    ], MessageAttachmentsComponent.prototype, "message", void 0);
    MessageAttachmentsComponent = __decorate([
        core_1.Component({
            selector: 'app-message-attachments',
            templateUrl: './message-attachments.component.html',
            styleUrls: ['./message-attachments.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], MessageAttachmentsComponent);
    return MessageAttachmentsComponent;
}());
exports.MessageAttachmentsComponent = MessageAttachmentsComponent;
//# sourceMappingURL=message-attachments.component.js.map