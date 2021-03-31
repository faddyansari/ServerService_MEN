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
exports.PreviewAckMessageComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var PreviewAckMessageComponent = /** @class */ (function () {
    function PreviewAckMessageComponent(data, sanitized) {
        this.data = data;
        this.sanitized = sanitized;
    }
    PreviewAckMessageComponent.prototype.ngOnInit = function () {
    };
    PreviewAckMessageComponent.prototype.TransformMessage = function (data) {
        var temp = data.replace(/{{ticket.id}}/gi, "1234").replace(/{{ticket.priority}}/gi, "HIGH").replace(/{{ticket.state}}/gi, "OPEN").replace(/{{ticket.source}}/gi, "email").replace(/{{ticket.assignedTo}}/gi, "Mr. Donald").replace(/{{visitor.email}}/gi, "harry_potter@sbtjapan.com").replace(/{{visitor.name}}/gi, "Harry Potter");
        temp = this.sanitized.bypassSecurityTrustHtml(temp);
        return temp;
    };
    PreviewAckMessageComponent = __decorate([
        core_1.Component({
            selector: 'app-preview-ack-message',
            templateUrl: './preview-ack-message.component.html',
            styleUrls: ['./preview-ack-message.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA))
    ], PreviewAckMessageComponent);
    return PreviewAckMessageComponent;
}());
exports.PreviewAckMessageComponent = PreviewAckMessageComponent;
//# sourceMappingURL=preview-ack-message.component.js.map