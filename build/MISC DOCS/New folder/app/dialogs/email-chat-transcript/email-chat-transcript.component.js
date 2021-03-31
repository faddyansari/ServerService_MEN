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
exports.EmailChatTranscriptComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var EmailChatTranscriptComponent = /** @class */ (function () {
    function EmailChatTranscriptComponent(data, dialogRef) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.loading = false;
        this.email = '';
        this.invalidEmail = false;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        (data.email) ? this.email = data.email : '';
    }
    EmailChatTranscriptComponent.prototype.ngOnInit = function () {
    };
    EmailChatTranscriptComponent.prototype.SendTranscript = function () {
        if (new RegExp(this.emailPattern).test(this.email)) {
            this.invalidEmail = false;
            this.dialogRef.close({ email: this.email });
        }
        else
            this.invalidEmail = true;
    };
    EmailChatTranscriptComponent = __decorate([
        core_1.Component({
            selector: 'app-email-chat-transcript',
            templateUrl: './email-chat-transcript.component.html',
            styleUrls: ['./email-chat-transcript.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], EmailChatTranscriptComponent);
    return EmailChatTranscriptComponent;
}());
exports.EmailChatTranscriptComponent = EmailChatTranscriptComponent;
//# sourceMappingURL=email-chat-transcript.component.js.map